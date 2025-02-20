
import { AppstoreOutlined, HomeOutlined, SnippetsOutlined, SettingOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import Link from 'next/link';

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
    {
        key: 'home',
        label: <Link href='/'>Home</Link>,
        icon: <HomeOutlined />,
    },
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
    {
        type: 'divider',
    },
    {
        key: 'profile',
        label: <Link href='/my'>My Reservation</Link>,
        icon: <SettingOutlined />
    },
    {
        key: 'meeting_room',
        label: <Link href='/config'>Meeting Room</Link>,
        icon: <SettingOutlined />
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
