import { Layout, ClerkProvider, Header, Content, Sider } from '@/app/third-party-wrapper'
import "./globals.css";
import '@ant-design/v5-patch-for-react-19';
import { AntdRegistry } from "@ant-design/nextjs-registry";
import SideNav from './sideNav';
import Nav from './nav';
import { UserProvider } from './context/userContext';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <UserProvider>
      <html lang="en">
        <body>
          <AntdRegistry>
            <Layout>
              <Header className="p-0 pl-0">
                <Nav></Nav>
              </Header>
              <Content className="h-[calc(100vh-4rem)]">
                <Layout className='h-full' hasSider>
                  <Sider className='top-0 h-full'>
                    <SideNav></SideNav>
                  </Sider>
                  <Content className='w-fit h-full overflow-auto bg-white' style={{padding: '1.25rem'}} >
                    {children}
                  </Content>
                </Layout>
              </Content>
            </Layout>
          </AntdRegistry>
        </body>
      </html>
    </UserProvider>
  );
}
