import siteMetadata from "@/lib/siteMetadata";
import Image from "next/image";
import Logout from "../auth/logout";


export default function DashboardHeader() {
    return <>
        <header className='fixed inset-x-0 top-0 z-50 bg-white drop-shadow-md'>
            <section className='mx-auto flex max-w-7xl items-center justify-between px-4 py-4'>
                <div className='ml-1 flex items-center justify-center gap-3'>
                <Image
                    src={'/images/logo.png'}
                    alt={'CoSketch logo'}
                    width={40}
                    height={40}
                    priority
                    className='w-6 md:w-10'
                />

                <h1
                    className={` text-secondary text-2xl font-extrabold md:text-3xl`}
                >
                    {siteMetadata.header}
                </h1>
                </div>

                <Logout />
            </section>
        </header>
    </>
}