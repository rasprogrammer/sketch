import { client } from "../lib/prisma"

export const createRoom = async (roomName: string, userId: string) => {
    return await client.room.create({
        data: {
            slug: roomName,
            adminId: userId,
            users: {
                connect: [{id: userId}]
            }
        }
    });
}


export const getRoomByName = async (roomName: string) => {
    return await client.room.findFirst({
        where: {
            slug: roomName
        }
    });
}


export const getRoomById = async (id: string) => {
    return await client.room.findFirst({
        where: {
            id: id
        }
    });
}


export const getRoomWithUsers = async (roomId: string) => {
    return await client.room.findUnique({
        where: {
            id: roomId,
        },
        include: { users: true }
    })
}


export const deleteRoomByRoomId = async (roomId: string) => {
    return await client.room.delete({
        where: { id: roomId }
    })
}

export const connectUserWithRoom = async (roomId: string, userId: string) => {
    return await client.room.update({
        where: {
            id: roomId
        },
        data: {
            users: {
                connect: [{ id : userId }]
            }
        }
    });
}

export const leaveUserFromRoom = async (roomId: string, userId: string) => {
    return await client.room.update({
        where: {
            id: roomId
        },
        data: {
            users: {
                disconnect: [{id: userId}]
            }
        }
        
    })
}


export const getRoomsByUserId = async (userId: string) => {
    return await client.user.findUnique({
        where: {
            id: userId            
        },
        select: {
            id: true,
            name: true,
            rooms: {
                select: {
                    id: true, 
                    slug: true, 
                    createdAt: true,
                    users: {
                        select: {
                            id: true,
                            name: true,
                        }
                    }
                }
            }
        }
        
    })
}