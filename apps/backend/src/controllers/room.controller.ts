import type { Response } from "express";
import type { AuthRequest } from "../utils/request-type";
import { HttpStatus } from "../utils/HttpStatus";
import { CreateRoomSchema } from "@repo/types";
import { getRoomByName, createRoom as createRoomByName } from "@repo/database";
import { connectUserWithRoom, deleteRoomByRoomId, getRoomById, getRoomsByUserId, getRoomWithUsers, leaveUserFromRoom } from "@repo/database/src/roomService";

export const createRoom = async (req: AuthRequest, res: Response) => {
    try {
        const parsedData = CreateRoomSchema.safeParse(req.body);
        if (!parsedData.success) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false, 
                error: parsedData.error
            });
        }

        const userId = req.auth?.id;
        if (!userId) {
            return res.status(HttpStatus.UNAUTHORIZED).json({
                success: false, 
                error: "Unauthorized user"
            });
        }

        const { roomName } = parsedData.data;

        const existingRoom = await getRoomByName(roomName);
        if (existingRoom) {
            return res.status(HttpStatus.CONFLICT).json({
                success: false,
                error: "Room already exists"
            });
        }

        const room = await createRoomByName(roomName, userId);
        
        return res.status(HttpStatus.CREATED).json({
            success: false, 
            message: "Room created successfully",
            roomId: room.id,
            slug: room.slug
        });

    } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            success: false, 
            error: "Failed to create room"
        });
    }
    
}

export const joinRoom = async (req: AuthRequest, res: Response) => {
    try {
        // get userId(auth) and roomId(body)
        const userId = req.auth?.id;
        const roomId = req.body.roomId;

        if (!userId) {
            return res.status(HttpStatus.UNAUTHORIZED).json({
                success: false, 
                error: "Unauthorized user"
            });
        }

        if (!roomId) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false, 
                error: "Room Id is required"
            });
        }

        const room = await getRoomWithUsers(roomId);
        if (!room) {
            return res.status(HttpStatus.NOT_FOUND).json({
                success: false,
                error: "Room doesn't exist"
            })
        }

        const user = room.users.find(u => u.id === userId);
        if (!user) {
            await connectUserWithRoom(roomId, userId);
        }
        
        return res.status(HttpStatus.OK).json({
            success: true,
            message: "Joined room successful",
            roomId
        });
        
    } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            success: false, 
            error: "Failed to join the room"
        });
    }

}

export const leaveRoom = async (req: AuthRequest, res: Response) => {
    const userId = req.auth?.id;
    const roomId = req.body.roomId;

    if (!userId) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
            success: false,
            error: "Unauthorized user"
        })
    }

    if (!roomId) {
        return res.status(HttpStatus.BAD_REQUEST).json({
            success: false,
            error: "Room Id is required"
        })
    }

    const room = await getRoomById(roomId);
    if (!room) {
        return res.status(HttpStatus.NOT_FOUND).json({
            success: false, 
            error: "Room doesn't exist"
        })
    }

    if (room.adminId === userId) {
        await deleteRoomByRoomId(roomId);

        return res.status(HttpStatus.OK).json({
            success: true,
            message: "Room delete successful"
        })
    }

    await leaveUserFromRoom(roomId, userId);

    return res.status(HttpStatus.OK).json({
        success: true,
        message: "Leaved room successful"
    });
}

export const verifyRoom = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.auth?.id;
        const roomId = req.body.roomId;

        if (!userId) {
            return res.status(HttpStatus.UNAUTHORIZED).json({
                success: false, 
                error: "Unauthorized"
            })
        }

        if (!roomId) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false, 
                error: "Room ID is required"
            })
        }

        const room = await getRoomWithUsers(roomId);
        if (!room) {
            return res.status(HttpStatus.NOT_FOUND).json({
                success: false, 
                error: "Room doesn't exist"
            })
        }

        const isUserInRoom = room.users.find(u => u.id === userId);
        if (!isUserInRoom) {
            return res.status(HttpStatus.NOT_FOUND).json({
                success: false, 
                error: "User doesn't exist in this room"
            })
        }

        return res.status(HttpStatus.OK).json({
            success: true,
            message: "User is in this room"
        })
        
    } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            error: "Failed to verify room"
        })
    }
    
}

export const getRooms = async (req: AuthRequest, res: Response) => {
    try {

        const userId = req.auth?.id;
        if (!userId) {
            return res.status(HttpStatus.UNAUTHORIZED).json({
                success: false, 
                error: "Unauthorized"
            })
        }

        const user = await getRoomsByUserId(userId);
        if (!user) {
            return res.status(HttpStatus.NOT_FOUND).json({
                success: false, 
                error: "User not found"
            })
        }

        if (!user.rooms?.length) {
            return res.status(HttpStatus.OK).json({
                success: true,
                message: "Rooms not available",
                data: {
                    userName: user.name,
                    rooms: []
                }
            })
        }

        const formattedRooms = user.rooms.map(room => ({
            roomId: room.id,
            slug: room.slug,
            createdAt: room.createdAt,
            participants: room.users.filter(participant => participant.name),
            noOfParticipants: room.users.length
        }));

        return res.status(HttpStatus.OK).json({
            success: true,
            message: "Rooms fetched successful",
            data: {
                userName: user.name,
                rooms: formattedRooms
            }
        });

    } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            error: "Failed to get rooms"
        })
    }
    
}