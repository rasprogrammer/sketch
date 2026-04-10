"use client";

import { Tool } from "@/type/tool";
import CanvasFooter from "./footer/canvas-footer";
import CanvasHeader from "./header/canvas-header";
import CanvasSidebar from "./sidebar/canvas-sidebar";
import { useSocket } from "@/hooks/useSocket";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { CanvasEngine } from "@/canvas-engine/CanvasEngine";
import { useCanvasEngineStore } from "@/stores/canvas-store";


const cursorStyles = {
  Eraser: 'none',
  Freehand: 'crosshair',
  Text: 'text',
  Selection: 'pointer',
  Rectangle: 'crosshair',
  Diamond: 'crosshair',
  Ellipse: 'crosshair',
  Arrow: 'default',
  Line: 'crosshair',
  default: 'crosshair',
};

export default function Canvas({roomId} : {
    roomId: string;
}) {

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const { canvasEngine, setCanvasEngine } = useCanvasEngineStore();
    const [token] = useState<string | null>(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('token')?.split(' ')[1] || null;
        }
        return null;
    });

    const selectedTool: Tool = 'Selection';
    
    const { sendMessage } = useSocket({
        roomId,
        token: token || '',
        onMessage: () => {},
        onOpen: () => console.log('connected'),
        onClose: () => console.log('disconnected')
    });

    // Initialize canvas and controllers
    useEffect(() => {
        if (!token) {
            toast.error('Unauthorized access');
            return;
        }

        const canvas = canvasRef.current;
        if (!canvas) return;

        const handleSendMessage = (message: any) => {
            sendMessage(message);
        };

        const draw = new CanvasEngine(canvas, roomId, handleSendMessage);
        setCanvasEngine(draw);
            
        // Mouse event handlers with optimized state updates
        const handleMouseEvent = () => {
            
        };

        canvas.addEventListener('mousedown', handleMouseEvent);
        canvas.addEventListener('mouseup', handleMouseEvent);

        return () => {
            draw.destroy();
            canvas.removeEventListener('mousedown', handleMouseEvent);
            canvas.removeEventListener('mouseup', handleMouseEvent);
        };

    }, [token, roomId, sendMessage, setCanvasEngine]);

    return (
        <>            
            <CanvasHeader roomId={roomId} sendMessage={sendMessage} />
            <CanvasSidebar selectedTool={selectedTool} />
            {/* <h2>Canvas ${roomId} </h2> */}
            <CanvasFooter />
        </>
    )
}