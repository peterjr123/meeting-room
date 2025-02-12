'use client'

import { Layout } from "antd";
import "./globals.css";
import Nav from "./nav";
import '@ant-design/v5-patch-for-react-19';
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'

const {Header, Content} = Layout

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <Layout>
            <Header className="p-0">
              <Nav></Nav>
            </Header>
            <Content className="h-[calc(100vh-4rem)]">{children}</Content>
          </Layout>
        </body>
      </html>
    </ClerkProvider>
  );
}
