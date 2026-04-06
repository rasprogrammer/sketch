import { Shape } from "@repo/types";


export class Eraser {
    private context: CanvasRenderingContext2D;
    private shapes: Shape[];

    constructor (
        context: CanvasRenderingContext2D, 
        shapes: Shape[]
    ) {
        this.context = context;
        this.shapes = shapes;
    }
}