'use client'
import { Menu, MenuProps } from "antd";
import Link from "next/link";
import { UserOutlined, LogoutOutlined, LoginOutlined, FormOutlined } from "@ant-design/icons";
import { UserData } from "./lib/data/type";
import { useEffect, useState } from "react";
import { logout, useUser } from "./lib/authentication/api";
import { usePathname } from "next/navigation";


type MenuItem = Required<MenuProps>['items'][number];

export default function NavMenu() {
    const [user, setUser] = useState<UserData>();
    const pathname = usePathname()

    const fetchUser = async () => {
        const user = await useUser();
        setUser(user);
    }

    useEffect(() => {
        fetchUser()
    }, [pathname]) 

    const items: MenuItem[]
        = (!user ? [
            {
                icon: <LoginOutlined />,
                label: <Link href="/auth/login">login</Link>,
                key: 'login',
            },
            {
                icon: <FormOutlined />,
                label: <Link href="/auth/signup">signup</Link>,
                key: 'signup',
            }
        ] : [
            {
                icon: <LogoutOutlined />,
                label: <span onClick={logout}>logout</span>,
                key: 'logout'
            },
            {
                icon: <UserOutlined />,
                label: <Link href="/profile">{(!user ? "invalid" : user.name)}</Link>,
                key: 'profile'
            }
        ]);

    return (
        <Menu className="flex-grow justify-end" selectedKeys={[]} items={items} mode="horizontal" />
    );
}
