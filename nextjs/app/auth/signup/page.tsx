'use client'

import { signup } from "@/app/lib/authentication/api";
import { fetchDepartmentList } from "@/app/lib/data/api";
import SignUpForm from "@/app/ui/auth/signUpForm";
import { Card } from "antd";
import FilckerAlert from "@/app/ui/result/filckerAlert";
import { useEffect, useState } from "react";


export default function SignUpPage() {
    const [alertDisplay, setAlertDisplay] = useState<boolean>(false);
    const [departments, setDepartments] = useState<string[]>([]);

    useEffect(() => {
        const initDepartments = async () => {
            const departments = await fetchDepartmentList();
            if (!departments) return;
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
            setAlertDisplay(true)
        }
    }

    return (
        <>
            <FilckerAlert
                className="mb-7"
                message="계정 등록 실패"
                description="해당 사용자 name이 이미 존재합니다."
                type="error"
                display={alertDisplay} />
            <Card title="계정 등록">
                <SignUpForm onFinish={onFinish} departments={departments.filter((dept) => dept !== "ADMIN")} />
            </Card>
        </>


    )
}
