'use client'

import { signup } from "@/app/lib/authentication/api";
import { fetchDepartmentList } from "@/app/lib/data/api";
import { Form, Input, Button, Select, Card, Alert } from "antd";
import { useEffect, useState } from "react";
const { Item } = Form;
const { Option } = Select;
const { Password } = Input;

export default function SignUpPage() {
    const [signupStatus, setSignupStatus] = useState<"default" | "failed">("default");

    const [departments, setDepartments] = useState<string[]>([]);

    useEffect(() => {
        const initDepartments = async () => {
            const departments = await fetchDepartmentList();
            if(!departments) return;
            setDepartments([...departments.map((dept) => dept.name)]);
        }
        initDepartments()
    }, [])

    async function onFinish(formValues: { name: string, password: string, department: string }) {
        const result = await signup({
            id: -1,
            name: formValues.name,
            password: formValues.password,
            department: formValues.department
        })
        if (result.message) {
            setSignupStatus("failed")
        }
    }

    return (
        <>
            {(signupStatus === "failed")
                ?
                <div className="mb-7">
                    <Alert
                        message="계정 등록 실패"
                        description="해당 사용자 name이 이미 존재합니다."
                        type="error"
                        showIcon
                    />
                </div>
                :
                null
            }
            <Card title="계정 등록">
                <Form
                    name="signup-form"
                    wrapperCol={{ span: 16 }}
                    labelCol={{ span: 8 }}
                    style={{ maxWidth: 600 }}
                    onFinish={onFinish}>
                    <Item label="이름" name="name" validateTrigger="onBlur" hasFeedback rules={[{ required: true }]}>
                        <Input placeholder="username..." />
                    </Item>
                    <Item label="password" name="password" hasFeedback rules={[{ required: true }]}>
                        <Password placeholder="password..." />
                    </Item>
                    <Item label="department" name="department" hasFeedback rules={[{ required: true }]}>
                        <Select>
                            {departments.map((department) => {
                                if(department !== "ADMIN")
                                    return (<Option key={department} value={department}>{department}</Option>)
                            })}
                        </Select>
                    </Item>
                    <Item className="float-end" label={null}>
                        <Button type="primary" htmlType="submit">등록</Button>
                    </Item>
                </Form>
            </Card>
        </>


    )
}
