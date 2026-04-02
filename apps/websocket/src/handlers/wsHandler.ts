import type { WebSocketServer } from "ws";
import { logger } from "../utils/logger";
import { PORT } from "../config";
import { getToken } from "../services/getToken";
import { authenticateWebsocket } from "../services/auth";


export const setupWebSocketServer = (wss: WebSocketServer) => {
    
    wss.on('connection', (socket, request) => {
        const url = request.url;
        if (!url) {
            logger.error('Connection request missing URL');
            socket.close();
            return;
        }

        const token = getToken(url);
        const authenticate = authenticateWebsocket(token);
        if (!authenticate) {
            logger.error('Unauthenticated User');
            socket.close();
            return;
        }

        const userId = authenticate.id;
        logger.info(`User ${userId} connected`);
        

        // Handle incoming messages
        socket.on('message', (data) => {
            try {
                const message = JSON.parse(data.toString());

                switch (message.type) {
                    case "room:join":
                    case "room:leave":
                        // handleRoomEvent
                        break;
                    case "canvas:draw":
                    case "canvas:clear":
                    case "canvas:erase":
                    case "canvas:update":
                        // handleCanvasEvent
                        break;
                    
                    default: 
                        logger.warn(`Unknown message type received: ${message.type}`);
                }
                
            } catch (error) {
                logger.error("Invalid message format", error);
            }
        });

        // Handle disconnetion 
        socket.on('close', () => {
            logger.info(`User ${userId} disconnected`);
            // handleUserDisconnect
        });

    });

    wss.on("listening", () => {
        logger.info(`WebSocket server is running on ws://localhost:${PORT}`);
    });
}