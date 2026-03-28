import LogoutButton from "../logoutButton";
import ShareButton from "../share-button";
import Toolbar from "../toolbar/toolbar";


export default function CanvasHeader({roomId, sendMessage}: {
    roomId: string;
    sendMessage: string;
}) {
    return (
        <>
        <header className='fixed top-0 left-0 z-0 flex w-full items-center justify-between bg-transparent px-15 pt-6 lg:px-20'>
            <LogoutButton roomId={roomId} sendMessage={sendMessage} />
            <Toolbar roomId={roomId} sendMessage={sendMessage} />
            <ShareButton roomId={roomId} />
        </header>
        </>
    )
}