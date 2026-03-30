import type { WebSocketServer } from "ws";


export const setupWebSocketServer = (wss: WebSocketServer) => {
    wss.on('connection', (socket, request) => {
        

        // Handle incoming messages
        socket.on('message', (data) => {
            try {
                const message = JSON.parse(data.toString());
                
            } catch (error) {

            }
        });

        // Handle disconnetion 
        socket.on('close', () => {

        });

    });

    wss.on("listening", () => {

    });
}