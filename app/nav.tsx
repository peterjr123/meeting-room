import { Menu, MenuProps, Layout } from "antd";
import Image from "next/image";
import Link from "next/link";

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
    {
        label:
            <Link href="/login">login</Link>,
        key: 'login',
    },
    {
        label: 'signup',
        key: 'signup',
    }
]


export default function Nav() {

    return (
        <div className="flex items-center fixed z-10 w-screen h-16">
            <div className="bg-white p-2 h-full flex items-center">
                <Link href="/dashboard">
                    <Image className="w-9" src="/favicon.ico" alt="logo" width={32} height={32} />
                </Link>
            </div>
            <Menu className="flex-grow" items={items} mode="horizontal">
            </Menu>
        </div>
    );
}