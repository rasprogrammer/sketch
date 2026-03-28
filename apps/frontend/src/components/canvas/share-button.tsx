import { Check, ChevronDown, Copy, Loader2, Share2 } from "lucide-react";
import { useRef, useState } from "react";


export default function ShareButton({ roomId }: {
    roomId: string;
}) {

    const [isProcessing, setIsProcessing] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const menuRef = useRef(null);

    const handleCopy = () => {

    }

    const handleShare = () => {
        
    }
    

    return (
        <>
        <div className='relative hidden lg:block' ref={menuRef}>
            {/* Main Button */}
            <button
                onClick={() => setIsOpen(prev => !prev)}
                disabled={isProcessing}
                className='bg-primary flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-base text-base transition disabled:opacity-50'
            >
                {isProcessing ? (
                <Loader2 className='h-5 w-5 animate-spin' />
                ) : copied ? (
                <Check className='h-5 w-5 text-green-400' />
                ) : (
                <Share2 className='h-5 w-5' />
                )}
                {isProcessing ? 'Processing...' : copied ? 'Copied!' : 'Share'}
                <ChevronDown className='h-4 w-4' />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className='bg-background absolute right-0 mt-2 w-44 rounded-lg p-2 shadow-lg'>
                <button
                    onClick={handleShare}
                    disabled={isProcessing}
                    className='hover:bg-light_background flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-sm text-base disabled:opacity-50'
                >
                    {isProcessing ? (
                    <Loader2 className='h-4 w-4 animate-spin' />
                    ) : (
                    <Share2 className='h-4 w-4' />
                    )}
                    {isProcessing ? 'Sharing...' : 'Share'}
                </button>
                <button
                    onClick={handleCopy}
                    disabled={isProcessing}
                    className='hover:bg-light_background flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-sm text-base disabled:opacity-50'
                >
                    {isProcessing ? (
                    <Loader2 className='h-4 w-4 animate-spin' />
                    ) : copied ? (
                    <Check className='h-4 w-4 text-green-500' />
                    ) : (
                    <Copy className='h-4 w-4' />
                    )}
                    {isProcessing ? 'Copying...' : copied ? 'Copied!' : 'Copy Link'}
                </button>
                </div>
            )}
        </div>
        </>
    )
}