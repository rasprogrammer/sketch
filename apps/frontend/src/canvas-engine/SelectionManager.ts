import { CanvasMessage, Shape } from "@repo/types";


export class SelectionManager {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private sendMessage: (message: CanvasMessage) => void;
    private roomId: string;

    private selectedShape: Shape | null = null; // Currently selected shape
    
    // For marquee selection
    private isMarqueeSelecting = false;
    private marqueeStartX = 0;
    private marqueeStartY = 0;
    private marqueeEndX = 0;
    private marqueeEndY = 0;

    // For rotation
    private rotationCenter = { x: 0, y: 0 };


    constructor (
        canvas: HTMLCanvasElement,
        context: CanvasRenderingContext2D,
        sendMessage: (message: CanvasMessage) => void,
        roomId: string,
    ) {
        this.canvas = canvas;
        this.context = context;
        this.sendMessage = sendMessage;
        this.roomId = roomId;
    }

    
    public getSelectedShape(): Shape | null {
        return this.selectedShape;
    }

    
    public setSelectedShape(shape: Shape | null) {
        if (
            this.selectedShape === shape ||
            (this.selectedShape && shape && this.selectedShape.id === shape.id)
        ) {
            return;
        }
        this.selectedShape = shape;
    }

    
    public drawMarqueeSelection() {
        if (!this.isMarqueeSelecting) return;

        const minX = Math.min(this.marqueeStartX, this.marqueeEndX);
        const maxX = Math.max(this.marqueeStartX, this.marqueeEndX);
        const minY = Math.min(this.marqueeStartY, this.marqueeEndY);
        const maxY = Math.max(this.marqueeStartY, this.marqueeEndY);

        this.context.save();
        this.context.strokeStyle = '#625ee0';
        this.context.lineWidth = 1;
        this.context.strokeRect(minX, minY, maxX - minX, maxY - minY);
        this.context.fillStyle = 'rgba(98, 94, 224, 0.1)';
        this.context.fillRect(minX, minY, maxX - minX, maxY - minY);
        this.context.restore();
    }


    
    public drawSelectionOutline(shape: Shape) {
        if (shape.type === 'Freehand' && shape.paths) {
            // For freehand shapes, draw a bounding box around the path
            const minX = Math.min(...shape.paths.map(p => p[0]));
            const maxX = Math.max(...shape.paths.map(p => p[0]));
            const minY = Math.min(...shape.paths.map(p => p[1]));
            const maxY = Math.max(...shape.paths.map(p => p[1]));

            this.context.save();
            this.context.strokeStyle = '#625ee0';
            this.context.lineWidth = 1;
            this.context.setLineDash([]);

            // Draw selection rectangle with padding
            const padding = 8;
            this.context.strokeRect(
                minX - padding,
                minY - padding,
                maxX - minX + padding * 2,
                maxY - minY + padding * 2,
            );

            // Draw corner handles
            const cornerHandles = [
                { x: minX - padding, y: minY - padding }, // top-left
                { x: maxX + padding, y: minY - padding }, // top-right
                { x: maxX + padding, y: maxY + padding }, // bottom-right
                { x: minX - padding, y: maxY + padding }, // bottom-left
            ];

            for (const pos of cornerHandles) {
                this.context.beginPath();
                this.context.rect(pos.x - 4, pos.y - 4, 8, 8);
                this.context.fillStyle = '#625ee0';
                this.context.fill();
                this.context.strokeStyle = '#625ee0';
                this.context.stroke();
            }

            this.context.restore();
            return;
        }

        if (shape.type === 'Text') {
            const { x1, y1, x2, y2 } = shape;
            const padding = 8;

            const width = x2 - x1;
            const height = y2 - y1;

            this.context.save();
            this.context.strokeStyle = '#625ee0';
            this.context.lineWidth = 1;
            this.context.setLineDash([]);

            // Draw bounding box with padding
            this.context.strokeRect(
                x1 - padding,
                y1 - padding,
                width + padding * 2,
                height + padding * 2,
            );

            // Draw corner handles
            const cornerHandles = [
                { x: x1 - padding, y: y1 - padding }, // top-left
                { x: x2 + padding, y: y1 - padding }, // top-right
                { x: x2 + padding, y: y2 + padding }, // bottom-right
                { x: x1 - padding, y: y2 + padding }, // bottom-left
            ];

            for (const pos of cornerHandles) {
                this.context.beginPath();
                this.context.rect(pos.x - 4, pos.y - 4, 8, 8);
                this.context.fillStyle = '#625ee0';
                this.context.fill();
                this.context.strokeStyle = '#625ee0';
                this.context.stroke();
            }

            this.context.restore();
            return;
        }
    }



}