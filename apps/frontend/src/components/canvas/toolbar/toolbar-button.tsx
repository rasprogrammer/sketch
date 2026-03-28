import { HdIcon, Icon } from "lucide-react";
import Tooltip from "./tooltip";

interface ToolbarButtonProps {
  id: number;
  tooltip: string;
  isSelected?: boolean;
  onClick?: () => void;
  icon: React.ElementType;
}

export default function ToolbarButton({ id, tooltip, isSelected, onClick, icon: Icon }: ToolbarButtonProps) {
    return (
        <>
        <div className='group relative flex'>
            <button
                onClick={onClick}
                className={`relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-md transition ${
                isSelected ? 'bg-tool_select' : 'hover:bg-light_background'
                }`}
            >
                <Icon size={16} className='text-base' />
                <span className='absolute right-1 bottom-0 text-[9px] text-gray-400 opacity-80'>
                {id}
                </span>
            </button>

            {/* Tooltip */}
            <Tooltip tooltip={tooltip} />
        </div>
        </>
    )
}