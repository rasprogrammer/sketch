"use client";

import CanvasFooter from "./footer/canvas-footer";
import CanvasHeader from "./header/canvas-header";
import CanvasSidebar from "./sidebar/canvas-sidebar";

export default function Canvas({roomId} : {
    roomId: string;
}) {

    
    const sendMessage: string = "Canvas Header -- ";

    return (
        <>
            <CanvasHeader roomId={roomId} sendMessage={sendMessage} />
            {/* <CanvasSidebar />
            <h2>Canvas ${roomId} </h2>
            <CanvasFooter /> */}
        </>
    )
}