'use client'

import { Layout } from 'antd';
import DashboardSideNav from './dashboardSideNav';

const { Header, Content, Sider } = Layout;


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <Layout className='h-full overflow-auto' hasSider>
            <Sider className='sticky top-0 h-full'>
                <DashboardSideNav></DashboardSideNav>
            </Sider>
            <Content className='h-full'>
                {children}
            </Content>
        </Layout>
    );
}