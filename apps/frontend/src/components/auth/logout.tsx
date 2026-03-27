"use client"; 

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";


export default function Logout() {

    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem('token');
        toast.success('Logout success');
        router.push('/');
    };

    return (
        <>
            <div className='flex items-center justify-between gap-4 text-base font-bold'>
                <button
                className='bg-primary-darker hover:bg-primary cursor-pointer rounded-xl border-2 border-gray-200 px-6 py-1.5 text-base'
                onClick={() => handleLogout()}
                >
                Logout
                </button>
            </div>
        </>
    );
}