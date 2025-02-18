'use client'

import { Menu, MenuProps } from "antd";
import Image from "next/image";
import Link from "next/link";
import { UserOutlined, LogoutOutlined, LoginOutlined, FormOutlined } from "@ant-design/icons";
import { SignInButton, SignUpButton, useUser, SignOutButton } from "@clerk/nextjs";



type MenuItem = Required<MenuProps>['items'][number];

export default function Nav() {
    const { isSignedIn } = useUser();

    const items: MenuItem[]
        = (!isSignedIn ? [
            {
                icon: <LoginOutlined />,
                label: <SignInButton />,
                key: 'login',
            },
            {
                icon: <FormOutlined />,
                label: <SignUpButton />,
                key: 'signup',
            }
        ] : [
            {
                icon: <LogoutOutlined />,
                label: <SignOutButton />,
                key: 'signOut'
            },
            {
                icon: <UserOutlined />,
                label: <Link href="/profile">Profile</Link>,
                key: 'profile'
            }
        ]);

    return (
        <div className="flex items-center fixed z-10 w-screen h-16">
            <div className="bg-white p-2 h-full flex items-center">
                <Link href="/">
                    <Image className="w-9" src="/favicon.ico" alt="logo" width={32} height={32} />
                </Link>
            </div>
            <Menu className="flex-grow justify-end" selectedKeys={[]} items={items} mode="horizontal">
            </Menu>
        </div>
    );
}
