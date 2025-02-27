import Image from "next/image";
import Link from "next/link";
import logo from "@/app/logo.ico"
import NavMenu from "./navMenu";


export default async function Nav() {
    return (
        <div className="flex items-center fixed z-10 w-screen h-16">
            <div className="bg-white p-2 h-full flex items-center" style={{ borderBottom: '1px solid rgba(5,5,5,0.06)'}}>
                <Link href="/">
                    <Image className="w-24" src={logo} alt="logo"/>
                </Link>
                <p>
                    회의실 예약 시스템
                </p>
            </div>
            <NavMenu></NavMenu>
        </div>
    );
}
