"use client"; 

import Canvas from "@/components/canvas/canvas";
import { useParams } from "next/navigation";
import { useState } from "react";


export default function CanvasPage() {

    const { roomId } = useParams() as { roomId: string };

    return (
        <>
            <section className='h-screen overflow-hidden'>
                <Canvas roomId={roomId} />
            </section>
        </>
    );
}