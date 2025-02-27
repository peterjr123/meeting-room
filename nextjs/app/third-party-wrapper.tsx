'use client'

import { Layout, Menu, Popconfirm } from "antd"
import { ClerkProvider } from "@clerk/nextjs"
import { Card, Descriptions, Form, Input } from "antd";


const { Header, Content, Sider} = Layout;
export { Layout, Header, Content, Sider, Menu, ClerkProvider, Popconfirm }

const { Item } = Form
export { Card, Descriptions, Form, Input, Item }