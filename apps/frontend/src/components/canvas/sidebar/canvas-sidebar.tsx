import { Tool } from "@/type/tool";
import { useState } from "react";
import clsx from "clsx";
import ColorPalette from "./color-palette";
import IconSelector from "./icon-selector";
import { CrossHatchSquareIcon, HachureSquareIcon } from "@/data/icons/canvas-sidebar/fill-icons";
import { SquareIcon } from "lucide-react";
import { BoldHorizontalLineIcon, ComplexSquiggleIcon, DashedLineIcon, DottedLineIcon, HorizontalLineIcon, SketchyLineIcon, SquiggleLineIcon, ThickHorizontalLineIcon, ThinHorizontalLineIcon } from "@/data/icons/canvas-sidebar/stroke-icons";


export default function CanvasSidebar({ selectedTool } : {
    selectedTool: Tool
}) {

    const [isShapeSelected, setIsShapeSelected] = useState(true);

    const [strokeColor, setStrokeColor] = useState("");
    
    const [backgroundColor, setBackgroundColor] = useState("");
    
    const [fillStyle, setFillStyle] = useState("");

    const [strokeWidth, setStrokeWidth] = useState("");

    const [strokeStyle, setStrokeStyle] = useState("");

    const [roughness, setRoughness] = useState("");

    return (
        <>
        <section
            onMouseUp={event => event.stopPropagation()}
            className={clsx(
                'bg-background absolute left-4 flex h-auto flex-col space-y-4 rounded-lg px-3 py-4 text-gray-400 shadow-md',
                'top-32',
                !isShapeSelected &&
                (selectedTool === 'Eraser' || selectedTool === 'Selection')
                ? 'hidden'
                : '',
            )}
            >
                
            {/* Stroke Settings */}
            <div>
                <ColorPalette
                selectedColor={strokeColor}
                setColor={setStrokeColor}
                type='Stroke'
                />

                <ColorPalette
                selectedColor={backgroundColor}
                setColor={setBackgroundColor}
                type='Background'
                />

                <IconSelector
                title='Fill'
                icons={[
                    { Icon: HachureSquareIcon, key: 'hachure' },
                    { Icon: CrossHatchSquareIcon, key: 'cross-hatch' },
                    { Icon: SquareIcon, key: 'solid' },
                ]}
                selectedIcon={fillStyle}
                setSelectedIcon={setFillStyle}
                />

                <IconSelector
                title='Stroke Width'
                icons={[
                    { Icon: HorizontalLineIcon, key: 'thin' },
                    { Icon: BoldHorizontalLineIcon, key: 'medium' },
                    { Icon: ThickHorizontalLineIcon, key: 'thick' },
                ]}
                selectedIcon={strokeWidth}
                setSelectedIcon={setStrokeWidth}
                />

                <IconSelector
                title='Stroke Style'
                icons={[
                    { Icon: ThinHorizontalLineIcon, key: 'solid' },
                    { Icon: DashedLineIcon, key: 'dashed' },
                    { Icon: DottedLineIcon, key: 'dotted' },
                ]}
                selectedIcon={strokeStyle}
                setSelectedIcon={setStrokeStyle}
                />

                <IconSelector
                title='Roughness'
                icons={[
                    { Icon: SquiggleLineIcon, key: 'none' },
                    { Icon: ComplexSquiggleIcon, key: 'normal' },
                    { Icon: SketchyLineIcon, key: 'high' },
                ]}
                selectedIcon={roughness}
                setSelectedIcon={setRoughness}
                />
            </div>
        </section>
        </>
    )
}