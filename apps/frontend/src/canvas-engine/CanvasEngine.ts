import { CanvasMessage, Shape, ShapeOptions, Tool } from "@repo/types";
import rough from "roughjs";
import { RoughCanvas } from "roughjs/bin/canvas";
import { RoughGenerator } from "roughjs/bin/generator";
import { SelectionManager } from "./SelectionManager";
import { Eraser } from "./Eraser";
import { getExistingShapes } from "@/api/canvas";
import { getStroke } from 'perfect-freehand';
import { Drawable } from "roughjs/bin/core";
import cuid from "cuid";

export class CanvasEngine {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private rc: RoughCanvas;
    private generator: RoughGenerator;
    private sendMessage: (message: CanvasMessage) => void;
    
    private existingShapes: Shape[] = [];
    
    private textInput: HTMLInputElement | null = null;

    private roomId: string;

    private selectedTool: Tool = 'Selection';
    
    private isTextInputActive: boolean = false;
    
    // Stroke style configurations
    private strokeStyles = {
        solid: [],
        dashed: [10, 5],
        dotted: [2, 6],
    };

    // Roughness levels for hand-drawn style
    private roughnessLevels = { none: 0, normal: 1, high: 2, };

    // Stroke width options
    private strokeWidths = {
        thin: 1,
        medium: 2,
        thick: 4,
    };

    private roughness: 'none' | 'normal' | 'high' = 'none';
    private strokeStyle: 'solid' | 'dashed' | 'dotted' = 'solid';
    private strokeWidth: 'thin' | 'medium' | 'thick' = 'thin';
    private fillStyle: 'hachure' | 'solid' | 'cross-hatch' = 'hachure';
    private fillColor: string = 'transparent';
    private strokeColor: string = 'black';
    private seed = 42;

    private selectionManager: SelectionManager;

    // Drawing coordinates
    private x1: number = 0;
    private x2: number = 0;
    private y1: number = 0;
    private y2: number = 0;

    private eraser: Eraser | null = null;
    private isErasing: boolean = false;
    private eraserSize: number = 10;

    constructor(
        canvas: HTMLCanvasElement,
        roomId: string,
        sendMessage: (message: CanvasMessage) => void,
    ) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d')!;
        this.rc = rough.canvas(canvas);
        this.generator = rough.generator();
        this.roomId = roomId;
        this.sendMessage = sendMessage;

        this.selectionManager = new SelectionManager(
            this.canvas,
            this.context,
            sendMessage,
            roomId
        );

        this.eraser = new Eraser(this.context, this.existingShapes);


        this.init().then(() => this.initHandlers());
        console.log('init');
    }

    private async init() {
        try {
            console.log('init started');

            const shapes: Shape[] = await getExistingShapes(this.roomId);

            console.log('shapes fetched', shapes);

            this.existingShapes = Array.isArray(shapes) ? shapes : [];

            this.clearCanvas();

            console.log('init finished');
        } catch (err) {
            console.error('init failed:', err);
        }
    }

    
    private initHandlers() {
        console.log('hiii');
        this.canvas.addEventListener('pointerdown', this.pointerDownHandler);
        this.canvas.addEventListener('pointermove', this.pointerMoveHandler);
        this.canvas.addEventListener('pointerup', this.pointerUpHandler);
        this.canvas.addEventListener('pointercancel', this.pointerUpHandler);
        this.canvas.addEventListener('pointerout', this.pointerUpHandler);

        // Add keyboard event listeners for modifier keys
        window.addEventListener('keydown', this.keyDownHandler);
    }

    destroy() {
        if (this.textInput) {
            this.textInput.remove();
        }
        this.canvas.removeEventListener('pointerdown', this.pointerDownHandler);
        this.canvas.removeEventListener('pointermove', this.pointerMoveHandler);
        this.canvas.removeEventListener('pointerup', this.pointerUpHandler);
        this.canvas.removeEventListener('pointercancel', this.pointerUpHandler);
        this.canvas.removeEventListener('pointerout', this.pointerUpHandler);

        window.removeEventListener('keydown', this.keyDownHandler);
    }

    private keyDownHandler = (event: KeyboardEvent) => {
        // Delete key for deleting selected shape
        if (event.key === 'Delete' || event.key === 'Backspace') {
        this.deleteSelectedShape();
        }
    };

    private getShapeOptions(): ShapeOptions {
        return {
        roughness: this.roughness,
        strokeStyle: this.strokeStyle,
        strokeWidth: this.strokeWidth,
        fillStyle: this.fillStyle,
        fillColor: this.fillColor,
        strokeColor: this.strokeColor,
        seed: this.seed,
        };
    }

    private deleteSelectedShape() {
        const selectedShape = this.selectionManager.getSelectedShape();
        if (selectedShape) {
            // Remove the selected shape from existingShapes
            this.existingShapes = this.existingShapes.filter(
                shape => shape.id !== selectedShape.id,
            );

            this.sendMessage({
                type: 'canvas:erase',
                room: this.roomId,
                shapeId: selectedShape.id,
            });

            // Clear selection
            this.selectionManager.setSelectedShape(null);
            this.clearCanvas();
        }
    }

    public clearCanvas() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.save();

        this.drawAllShapes();

        // Draw selection outline for selected shape
        const selectedShape = this.selectionManager.getSelectedShape();
        if (selectedShape) {
            this.selectionManager.drawSelectionOutline(selectedShape);
        }

        // Draw marquee selection if active
        this.selectionManager.drawMarqueeSelection();

        this.context.restore();
    }

    
    private convertToRoughOptions(options: ShapeOptions) {
        return {
            roughness: this.roughnessLevels[options.roughness],
            stroke: options.strokeColor,
            strokeWidth: this.strokeWidths[options.strokeWidth],
            fill: options.fillColor,
            fillStyle: options.fillStyle,
            strokeLineDash: this.strokeStyles[options.strokeStyle],
            seed: options.seed,
        };
    }

    
    private drawAllShapes() {
        this.existingShapes.forEach(shape => {
            if (shape.type === 'Freehand' && shape.paths) {
                this.context.save();
                this.context.fillStyle = shape.options.strokeColor;
                this.context.beginPath();

                const stroke = getStroke(shape.paths, {
                size:
                    (this.strokeWidths[shape.options.strokeWidth] + 1) *
                    3 *
                    (shape.pressures
                    ? 1 +
                        shape.pressures.reduce((a, b) => a + b, 0) /
                        shape.pressures.length
                    : 1),
                thinning:
                    0.5 +
                    (shape.pressures
                    ? (shape.pressures.reduce((a, b) => a + b, 0) /
                        shape.pressures.length) *
                        0.5
                    : 0),
                smoothing: 0.5,
                streamline: 0.5,
                simulatePressure: true,
                easing: t => t,
                start: {
                    taper: 0,
                    cap: true,
                    easing: t => t,
                },
                end: {
                    taper: 0,
                    cap: true,
                    easing: t => t,
                },
                });

                for (let i = 0; i < stroke.length; i++) {
                const [x, y] = stroke[i];
                if (i === 0) {
                    this.context.moveTo(x, y);
                } else {
                    this.context.lineTo(x, y);
                }
                }

                this.context.closePath();
                this.context.fill();
                this.context.restore();
            } else if (shape.type === 'Text' && shape.text) {
                this.context.save();
                this.context.font = '32px Comic Sans MS, cursive';
                this.context.fillStyle = shape.options.strokeColor;
                this.context.textBaseline = 'top';
                this.context.textAlign = 'left';

                // Add subtle shadow for better visibility
                this.context.shadowColor = 'rgba(0, 0, 0, 0.2)';
                this.context.shadowBlur = 2;
                this.context.shadowOffsetX = 1;
                this.context.shadowOffsetY = 1;
                this.context.fillText(shape.text, shape.x1, shape.y1);

                this.context.restore();
            } else {
                // Generate drawable from shape data using the shape's own options
                const roughOptions = this.convertToRoughOptions(shape.options);
                const drawable = this.generateDrawableFromShapeData(
                shape,
                roughOptions,
                );

                // Apply rotation if needed
                if (shape.rotation) {
                this.context.save();
                const centerX = (shape.x1 + shape.x2) / 2;
                const centerY = (shape.y1 + shape.y2) / 2;
                this.context.translate(centerX, centerY);
                this.context.rotate((shape.rotation * Math.PI) / 180);
                this.context.translate(-centerX, -centerY);
                }

                // Draw the shape
                if (Array.isArray(drawable)) {
                drawable.forEach(d => this.rc.draw(d));
                } else if (drawable) {
                this.rc.draw(drawable);
                }

                if (shape.rotation) {
                this.context.restore();
                }
            }
        });
    }

    private pointerDownHandler = (event: PointerEvent) => { 
        const rect = this.canvas.getBoundingClientRect();
        this.x1 = event.clientX - rect.left;
        this.y1 = event.clientY - rect.top;

        if (this.selectedTool === 'Text') {
            this.startTextInput(event.clientX, event.clientY);
            return;
        }

        if (this.selectedTool === 'Eraser') {
            this.isErasing = true;
            this.eraseAtPoint(this.x1, this.y1);
            return;
        }
        
        if (this.selectedTool === 'Freehand') {
            
        }
        
        if (this.selectedTool === 'Selection') {
            
        }
    }
    
    private pointerMoveHandler = (event: PointerEvent) => {

    }

    private pointerUpHandler = (event: PointerEvent) => {

    }
    
    private cleanupTextInput() {
        if (!this.textInput) return;

        // Store the reference to the text input
        const textInput = this.textInput;

        // Reset the state variables first
        this.textInput = null;
        this.isTextInputActive = false;

        // Then try to remove the element if it still exists
        try {
            if (textInput.parentNode) {
                textInput.remove();
            }
        } catch (error) {
            console.warn('Error during text input cleanup:', error);
        }
    }
    
    private finishTextInput(textInput: HTMLInputElement) {
        // Only proceed if this is still the current text input
        if (textInput !== this.textInput) return;

        const text = textInput.value.trim();
        if (text) {
            const rect = textInput.getBoundingClientRect();
            const canvasRect = this.canvas.getBoundingClientRect();

            // Measure text width for more accurate sizing
            this.context.save();
            this.context.font = '32px Comic Sans MS, cursive';
            const textWidth = this.context.measureText(text).width;
            this.context.restore();

            const newShape: Shape = {
                id: cuid(),
                type: 'Text',
                x1: rect.left - canvasRect.left,
                y1: rect.top - canvasRect.top,
                x2: rect.left - canvasRect.left + textWidth,
                y2: rect.bottom - canvasRect.top,
                text: text,
                options: this.getShapeOptions(),
            };

            this.existingShapes.push(newShape);
            this.sendMessage({
                type: 'canvas:draw',
                room: this.roomId,
                data: newShape,
            });
        }

        this.cleanupTextInput();
        this.clearCanvas();
    }


    
    private startTextInput(x: number, y: number) {
        // First, ensure any existing text input is properly cleaned up
        this.cleanupTextInput();

        // const rect =
        this.canvas.getBoundingClientRect();
        // const canvasX = x - rect.left;
        // const canvasY = y - rect.top;

        // Create new text input
        const textInput = document.createElement('input');
        textInput.type = 'text';
        textInput.style.position = 'absolute';
        textInput.style.left = `${x}px`;
        textInput.style.top = `${y}px`;
        textInput.style.fontFamily = 'Comic Sans MS, cursive';
        textInput.style.fontSize = '32px';
        textInput.style.background = 'transparent';
        textInput.style.border = 'none';
        textInput.style.outline = 'none';
        textInput.style.color = this.strokeColor;
        textInput.style.padding = '4px 4px';
        textInput.style.margin = '0';
        textInput.style.width = 'auto';
        textInput.style.minWidth = '50px';
        textInput.style.zIndex = '1000';
        textInput.style.cursor = 'text';
        textInput.style.borderRadius = '4px';
        textInput.style.transition = 'background-color 0.2s';

        // Add to canvas container first
        const canvasContainer = this.canvas.parentElement;
        if (!canvasContainer) return;

        canvasContainer.appendChild(textInput);
        this.textInput = textInput;
        this.isTextInputActive = true;

        // Add event listeners after the element is in the DOM
        const handleBlur = () => {
        if (textInput === this.textInput) {
            this.finishTextInput(textInput);
        }
        };

        const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (textInput === this.textInput) {
            this.finishTextInput(textInput);
            }
        } else if (e.key === 'Escape') {
            e.preventDefault();
            this.cleanupTextInput();
            this.clearCanvas();
        }
        };

        textInput.addEventListener('blur', handleBlur);
        textInput.addEventListener('keydown', handleKeyDown);

        // Focus after a small delay
        setTimeout(() => {
        if (textInput === this.textInput && textInput.parentNode) {
            textInput.focus();
        }
        }, 0);
    }


    private generateDrawableFromShapeData(
        shape: Shape,
        options: {
        roughness: number;
        stroke: string;
        strokeWidth: number;
        fill: string;
        fillStyle: 'solid' | 'hachure' | 'cross-hatch';
        strokeLineDash: number[] | never[];
        seed: number;
        },
    ): Drawable | Drawable[] {
        switch (shape.type) {
        case 'Rectangle':
            return this.generator.rectangle(
            Math.min(shape.x1, shape.x2),
            Math.min(shape.y1, shape.y2),
            Math.abs(shape.x2 - shape.x1),
            Math.abs(shape.y2 - shape.y1),
            options,
            );
        case 'Diamond': {
            const centerX = (shape.x1 + shape.x2) / 2;
            const centerY = (shape.y1 + shape.y2) / 2;
            const width = Math.abs(shape.x2 - shape.x1);
            const height = Math.abs(shape.y2 - shape.y1);
            const points: [number, number][] = [
            [centerX, centerY - height / 2],
            [centerX + width / 2, centerY],
            [centerX, centerY + height / 2],
            [centerX - width / 2, centerY],
            ];
            return this.generator.polygon(points, options);
        }
        case 'Ellipse': {
            const centerX = (shape.x1 + shape.x2) / 2;
            const centerY = (shape.y1 + shape.y2) / 2;
            return this.generator.ellipse(
            centerX,
            centerY,
            Math.abs(shape.x2 - shape.x1),
            Math.abs(shape.y2 - shape.y1),
            options,
            );
        }
        case 'Line':
            return this.generator.line(
            shape.x1,
            shape.y1,
            shape.x2,
            shape.y2,
            options,
            );
        case 'Arrow': {
            const angle = Math.atan2(shape.y2 - shape.y1, shape.x2 - shape.x1);
            const arrowSize = 16;
            const arrowLeftX = shape.x2 - arrowSize * Math.cos(angle - Math.PI / 6);
            const arrowLeftY = shape.y2 - arrowSize * Math.sin(angle - Math.PI / 6);
            const arrowRightX =
            shape.x2 - arrowSize * Math.cos(angle + Math.PI / 6);
            const arrowRightY =
            shape.y2 - arrowSize * Math.sin(angle + Math.PI / 6);

            return [
            this.generator.line(shape.x1, shape.y1, shape.x2, shape.y2, options),
            this.generator.line(
                shape.x2,
                shape.y2,
                arrowLeftX,
                arrowLeftY,
                options,
            ),
            this.generator.line(
                shape.x2,
                shape.y2,
                arrowRightX,
                arrowRightY,
                options,
            ),
            ];
        }
        default:
            return this.generator.rectangle(0, 0, 0, 0, options); // Fallback
        }
    }

    
    /**
     * Sets the current drawing tool
     */
    public setSelectedTool(tool: Tool) {
        this.selectedTool = tool;

        // When switching to Selection tool, maintain current selection
        // When switching to other tools, clear selection
        if (tool !== 'Selection') {
        this.selectionManager.setSelectedShape(null);
        this.clearCanvas();
        }
    }

    public getSelectedTool() {
        return this.selectedTool;
    }

    
    public getSelectedShape(): Shape | null {
        return this.selectionManager.getSelectedShape();
    }

    private eraseAtPoint(x: number, y: number): void {
        if (!this.eraser) return;

        // Make sure eraser has the latest shapes
        this.eraser = new Eraser(this.context, this.existingShapes);
        this.eraser.setEraserSize(this.eraserSize);

        // Check each shape to see if it intersects with the eraser
        const shapesToErase: Shape[] = [];
        const remainingShapes: Shape[] = [];

        this.existingShapes.forEach(shape => {
        if (shape.type === 'Freehand' && shape.paths) {
            // For freehand shapes, check if any point is within eraser radius
            const isErased = shape.paths.some(point => {
            const distance = Math.sqrt(
                Math.pow(point[0] - x, 2) + Math.pow(point[1] - y, 2),
            );
            return distance <= this.eraserSize / 2;
            });

            if (isErased) {
            shapesToErase.push(shape);
            } else {
            remainingShapes.push(shape);
            }
        } else if (shape.type === 'Text') {
            // Check if the eraser point is within the text bounds
            const isWithinText =
            x >= shape.x1 && x <= shape.x2 && y >= shape.y1 && y <= shape.y2;

            if (isWithinText) {
            shapesToErase.push(shape);
            } else {
            remainingShapes.push(shape);
            }
        } else {
            // For other shapes, use the existing eraser logic
            const currentEraser = this.eraser;
            if (currentEraser) {
            const erasedShapes = currentEraser.erase(x, y);
            const isErased = !erasedShapes.some(erased => erased.id === shape.id);

            if (isErased) {
                shapesToErase.push(shape);
            } else {
                remainingShapes.push(shape);
            }
            }
        }
        });

        // Send erase messages for each erased shape
        shapesToErase.forEach(shape => {
        this.sendMessage({
            type: 'canvas:erase',
            room: this.roomId,
            shapeId: shape.id,
        });
        });

        // Update existing shapes
        this.existingShapes = remainingShapes;

        // Redraw canvas
        this.clearCanvas();
    }

    public setEraserSize(size: number): void {
        this.eraserSize = size;
        if (this.eraser) {
            this.eraser.setEraserSize(size);
        }
    }




}