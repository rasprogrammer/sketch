import type { WebSocketServer } from "ws";
import { logger } from "../utils/logger";
import { PORT } from "../config";
import { getToken } from "../services/getToken";
import { authenticateWebsocket } from "../services/auth";


export const setupWebSocketServer = (wss: WebSocketServer) => {
    wss.on('connection', (socket, request) => {
        console.log('request url > ', request.url);

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