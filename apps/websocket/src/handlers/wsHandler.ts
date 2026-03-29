import type { WebSocketServer } from "ws";


export const setupWebSocketServer = (wss: WebSocketServer) => {
    wss.on('connection', (socket, request) => {
        
    })
}