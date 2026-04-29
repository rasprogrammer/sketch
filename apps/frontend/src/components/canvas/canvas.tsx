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
import { useToolStore } from "@/stores/tool-store";
import { useCanvasStyleStore } from "@/stores/canvas-style-store";
import { useIsShapeSelectedStore } from "@/stores/shape-selected-store";


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
    
    // Canvas style properties - moved before conditional checks
    const {
        strokeColor,
        backgroundColor,
        strokeWidth,
        strokeStyle,
        roughness,
        fillStyle,
    } = useCanvasStyleStore();

    const selectedTool = useToolStore(s => s.selectedTool);

    const handleOnMessage = () => {

    }
    
    const { sendMessage } = useSocket({
        roomId,
        token: token || '',
        onMessage: () => handleOnMessage,
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
            const currentSelection = draw.getSelectedShape();
            const isSelected = !!currentSelection;
            const currentState = useIsShapeSelectedStore.getState().isShapeSelected;
            console.log('currentState > ', currentState, ' isSelected > ', isSelected);
            if (isSelected !== currentState) {
                useIsShapeSelectedStore.setState({ isShapeSelected: isSelected });
            }
        };

        canvas.addEventListener('mousedown', handleMouseEvent);
        canvas.addEventListener('mouseup', handleMouseEvent);

        return () => {
            draw.destroy();
            canvas.removeEventListener('mousedown', handleMouseEvent);
            canvas.removeEventListener('mouseup', handleMouseEvent);
        };

    }, [token, roomId, sendMessage, setCanvasEngine]);

    // Update selected tool
    useEffect(() => {
        if (!canvasEngine) return;

        const currentTool = canvasEngine.getSelectedTool();
        if (currentTool !== selectedTool) {
            canvasEngine.setSelectedTool(selectedTool);
        }
    }, [canvasEngine, selectedTool]);

    // Canvas sizing
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            if (!canvasEngine) return;
            canvasEngine.clearCanvas();
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    
    // Cursor style
    useEffect(() => {
        const canvas = canvasRef.current;
        console.log('canvas > ', canvas);
        if (canvas) {
            canvas.style.cursor = cursorStyles[selectedTool] || cursorStyles.default;
        }
    }, [selectedTool]);


    return (
        <>            
            <CanvasHeader roomId={roomId} sendMessage={sendMessage} />
            <CanvasSidebar selectedTool={selectedTool} />
            <canvas ref={canvasRef} className='bg-[#f6f6f6] text-white' />
            <CanvasFooter />
        </>
    )
}