'use client'
import { Menu, MenuProps } from "antd";
import Link from "next/link";
import { UserOutlined, LogoutOutlined, LoginOutlined, FormOutlined } from "@ant-design/icons";
import { logout } from "./lib/authentication/api";
import { useUser } from "./context/userContext";

type MenuItem = Required<MenuProps>['items'][number];

export default function NavMenu() {
    const { user } = useUser();

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
