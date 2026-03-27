

export default function Logout() {
    return (
        <>
            <div className='flex items-center justify-between gap-4 text-base font-bold'>
                <button
                className='bg-primary-darker hover:bg-primary cursor-pointer rounded-xl border-2 border-gray-200 px-6 py-1.5 text-base'
                // onClick={() => {
                    // setDailogBoxOpen(true);
                // }}
                >
                Logout
                </button>
            </div>
        </>
    );
}