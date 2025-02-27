'use client'

import { login } from "@/app/lib/authentication/api";
import LoginForm from "@/app/ui/auth/loginForm";
import FilckerAlert from "@/app/ui/result/filckerAlert";
import { Card } from "antd";
import { useState } from "react";

export default function LoginPage() {
    const [alertDisplay, setAlertDisplay] = useState<boolean>(false);
    
    async function onFinish(formValues: { username: string, password: string }) {
        console.log(formValues)
        const result = await login(formValues.username, formValues.password)
        if (result.message) {
            setAlertDisplay(true)
        }
    }

    return (
        <>
            <FilckerAlert
                message="로그인 실패"
                description="username과 password를 확인해 주세요."
                type="error"
                display={alertDisplay} />
            <Card title="로그인">
                <LoginForm onFinish={onFinish}/>
            </Card>
        </>
    )
}
