'use client'

import { Layout } from "antd";
import "./globals.css";
import Nav from "./nav";
import '@ant-design/v5-patch-for-react-19';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Layout>
          <Layout.Header className="p-0">
            <Nav></Nav>
          </Layout.Header>
          <Layout.Content className="h-[calc(100vh-4rem)]">{children}</Layout.Content>
        </Layout>
      </body>
    </html>
  );
}
