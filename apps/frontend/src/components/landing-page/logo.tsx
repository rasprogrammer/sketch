import siteMetadata from "@/lib/siteMetadata";
import Link from "next/link";


export default function Logo () {
    return (
        <Link href="/">
            <h1>{siteMetadata.header}</h1>
        </Link>
    )
}