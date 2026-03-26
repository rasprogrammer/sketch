import { NavLink } from "@/data/navLink";


export default function Navbar() {
    return (
        <nav>
            <ul className='hidden items-center gap-6 font-medium text-gray-700 md:flex'>
                {NavLink.map((link, index) => (
                    <li key={index}>
                    <a
                    href={link.href}
                    className='hover:text-primary-chubb text-base transition'
                    >
                    {link.title}
                    </a>
                </li>
                ))}
            </ul>
        </nav>
    )
}