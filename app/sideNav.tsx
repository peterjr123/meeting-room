import { AppstoreOutlined, HomeOutlined, SnippetsOutlined, SettingOutlined, UsergroupAddOutlined, FileSearchOutlined, TeamOutlined, ClusterOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import Link from 'next/link';

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
    {
        key: 'g1',
        label: "Home",
        type: "group",
        children: [
            {
                key: 'home',
                label: <Link href='/'>Home</Link>,
                icon: <HomeOutlined />,
            },
        ]
    },
    {
        type: 'divider'
    },
    {
        key: 'g2',
        label: "Reservation",
        type: "group",
        children: [
            {
                key: 'quick_reservation',
                label: <Link href='/quick'>Quick Reservation</Link>,
                icon: <SnippetsOutlined />,
            },
            {
                key: 'reservation_schedule',
                label: <Link href='/dashboard'>Dashboard</Link>,
                icon: <AppstoreOutlined />,
            },
        ]
    },
    {
        type: 'divider',
    },
    {
        key: 'g3',
        label: "Information",
        type: "group",
        children: [
            {
                key: 'my_reservation',
                label: <Link href='/my'>My Reservation</Link>,
                icon: <FileSearchOutlined />
            },
            {
                key: 'meeting_room',
                label: <Link href='/config'>Meeting Room</Link>,
                icon: <ClusterOutlined />
            },
            {
                key: 'users',
                label: <Link href='/users'>Users</Link>,
                icon: <TeamOutlined />
            },
        ]
    }

];


export default async function SideNav() {
    return (
        <div className='h-full bg-white'>
            <Menu
                className='h-full'
                mode="inline"
                items={items}
                selectedKeys={[]}
            />
        </div>

    );
};
