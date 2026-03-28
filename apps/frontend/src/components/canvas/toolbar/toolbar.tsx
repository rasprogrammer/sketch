import { Circle, Diamond, Eraser, LockKeyhole, LockKeyholeOpen, LucideIcon, Minus, MousePointer, MoveRight, Pencil, Square, Trash, Type } from "lucide-react";
import { useState } from "react";
import Tooltip from "./tooltip";
import { Tool } from "@/type/tool";
import ToolbarButton from "./toolbar-button";

const tools: { icon: LucideIcon; tool: Tool; id: number; tooltip: string }[] = [
  { icon: MousePointer, tool: 'Selection', id: 1, tooltip: 'Selection - 1' },
  { icon: Square, tool: 'Rectangle', id: 2, tooltip: 'Rectangle - 2' },
  { icon: Diamond, tool: 'Diamond', id: 3, tooltip: 'Diamond - 3' },
  { icon: Circle, tool: 'Ellipse', id: 4, tooltip: 'Ellipse - 4' },
  { icon: MoveRight, tool: 'Arrow', id: 5, tooltip: 'Arrow - 5' },
  { icon: Minus, tool: 'Line', id: 6, tooltip: 'Line - 6' },
  { icon: Pencil, tool: 'Freehand', id: 7, tooltip: 'Draw - 7' },
  { icon: Type, tool: 'Text', id: 8, tooltip: 'Text - 8' },
  { icon: Eraser, tool: 'Eraser', id: 9, tooltip: 'Eraser - 9' },
];



export default function Toolbar({roomId, sendMessage}: {
    roomId: string;
    sendMessage: string;
}) {


    const [isLocked, setIsLocked] = useState(false);
    const [selectedTool, setSelectedTool] = useState({});

    const toggleLock = () => {
        setIsLocked(prev => !prev);
    }

    const handleToolSelect = (tool: Tool) => {
        setSelectedTool(tool)
    }

    const handleClick = () => {
        
    }


    return (
        <>
        <nav className='bg-background flex items-center justify-between gap-2 rounded-lg px-4 py-1 text-base shadow-md'>
            {/* Lock Toggle Button */}
            <div className='group relative'>
                <button
                onClick={toggleLock}
                className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded ${
                    isLocked ? 'bg-tool_select' : 'hover:bg-light_background'
                }`}
                aria-label='Toggle lock'
                >
                {isLocked ? <LockKeyhole size={18} /> : <LockKeyholeOpen size={18} />}
                <Tooltip tooltip={'Keep selected tool active after drawing'} />
                </button>
            </div>

            {/* Toolbar Buttons */}
            <div className='flex gap-2 border-x border-gray-700 px-4'>
                {tools.map(tool => (
                <ToolbarButton
                    key={tool.id}
                    id={tool.id}
                    icon={tool.icon}
                    tooltip={tool.tooltip}
                    onClick={() => handleToolSelect(tool.tool)}
                    isSelected={selectedTool === tool.tool}
                />
                ))}
            </div>

            {/* Clear Button */}
            <div className='group relative'>
                <button
                className='hover:bg-light_background flex h-9 w-9 cursor-pointer items-center justify-center rounded p-2'
                aria-label='Clear canvas'
                onClick={handleClick}
                >
                <Trash size={18} className='text-red-500' />
                </button>
                <Tooltip tooltip={'Clear Canvas'} />
            </div>

            {/* <ConfirmationDialog
                isOpen={isDialogOpen}
                title='Clear Canvas'
                message='Are you sure you want to clear the canvas? This action cannot be undone.'
                confirmText='Clear'
                cancelText='Cancel'
                onConfirm={confirmClear}
                onCancel={cancelClear}
            /> */}
        </nav>
        </>
    );
}