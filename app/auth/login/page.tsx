'use client'

import { login } from "@/app/lib/authentication/api";
import { RoomData } from "@/app/lib/data/type";
import { Form, Input, Button, Alert, Card } from "antd";
import Password from "antd/es/input/Password";
import TextArea from "antd/es/input/TextArea";
import { useState } from "react";
const { Item } = Form;

export default function LoginPage() {
    const [loginStatus, setLoginStatus] = useState<"default" | "failed">("default");
    async function onFinish(formValues: { username: string, password: string }) {
        console.log(formValues)
        const result = await login(formValues.username, formValues.password)
        if (!result) {
            setLoginStatus("failed")
        }
    }

    return (
        <>
            {(loginStatus === "failed")
                ?
                <div className="mb-7">
                    <Alert
                        message="로그인 실패"
                        description="username과 password를 확인해 주세요."
                        type="error"
                        showIcon
                    />
                </div>
                :
                null
            }
            <Card title="로그인">
                <Form
                    name="reservation-form"
                    wrapperCol={{ span: 16 }}
                    labelCol={{ span: 8 }}
                    style={{ maxWidth: 600 }}
                    onFinish={onFinish}>
                    <Item label="이름" name="username" validateTrigger="onBlur" hasFeedback rules={[{ required: true }]}>
                        <Input placeholder="username..." />
                    </Item>
                    <Item label="password" name="password" hasFeedback rules={[{ required: true }]}>
                        <Password placeholder="password..." />
                    </Item>
                    <Item className="float-end" label={null}>
                        <Button type="primary" htmlType="submit">로그인</Button>
                    </Item>
                </Form>
            </Card>
        </>
    )
}
