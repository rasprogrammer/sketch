import Actions from "./action/action";
import Rooms from "./room/rooms";


export default function DashboardBody() {
    return (
        <>
        <section className='mx-auto max-w-7xl px-6'>
            <Actions />
            <Rooms />
        </section>
        </>
    );
}