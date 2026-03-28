"use client";

import { Tool } from "@/type/tool";
import CanvasFooter from "./footer/canvas-footer";
import CanvasHeader from "./header/canvas-header";
import CanvasSidebar from "./sidebar/canvas-sidebar";

export default function Canvas({roomId} : {
    roomId: string;
}) {

    const selectedTool: Tool = 'Selection';
    
    const sendMessage: string = "Canvas Header -- ";

    return (
        <>
            <CanvasHeader roomId={roomId} sendMessage={sendMessage} />
            <CanvasSidebar selectedTool={selectedTool} />
            {/* <h2>Canvas ${roomId} </h2> */}
            <CanvasFooter />
        </>
    )
}