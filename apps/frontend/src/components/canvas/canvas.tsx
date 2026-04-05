"use client";

import { Tool } from "@/type/tool";
import CanvasFooter from "./footer/canvas-footer";
import CanvasHeader from "./header/canvas-header";
import CanvasSidebar from "./sidebar/canvas-sidebar";
import { useSocket } from "@/hooks/useSocket";
import { useEffect, useState } from "react";

export default function Canvas({roomId} : {
    roomId: string;
}) {
    
    const [token, setToken] = useState<string | null>(() => {
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
    })

    return (
        <>            
            <CanvasHeader roomId={roomId} sendMessage={sendMessage} />
            <CanvasSidebar selectedTool={selectedTool} />
            {/* <h2>Canvas ${roomId} </h2> */}
            <CanvasFooter />
        </>
    )
}