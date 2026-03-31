import type { WebSocketServer } from "ws";
import { logger } from "../utils/logger";
import { PORT } from "../config";


export const setupWebSocketServer = (wss: WebSocketServer) => {
    wss.on('connection', (socket, request) => {
        const userId: string = ""; // this will be changed and authenticate
        

        // Handle incoming messages
        socket.on('message', (data) => {
            try {
                const message = JSON.parse(data.toString());
                
            } catch (error) {

            }
        });

        // Handle disconnetion 
        socket.on('close', () => {
            logger.info(`User ${userId} disconnected`);
        });

    });

    wss.on("listening", () => {
        logger.info(`WebSocket server is running on ws://localhost:${PORT}`);
    });
}