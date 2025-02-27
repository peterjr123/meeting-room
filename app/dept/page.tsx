'use client'

import { Card, Form, Input, Item } from "@/app/third-party-wrapper";
import { createDepartmentData, deleteDepartmentData, fetchDepartmentList } from "../lib/data/api";
import { Alert, Button, List } from 'antd'
import { DepartmentData } from "../lib/data/type";
import { useEffect, useState } from "react";
import DepartmentList from "./departmentList";

export default function DepartementPage() {
    const [departments, setDepartments] = useState<DepartmentData[]>();
    const [createStatus, setCreateStatus] = useState<"default" | "failed">("default");
    async function updateDepartments() {
        const departments = await fetchDepartmentList();
        if (!departments) return;
        setDepartments([...departments])
    }
    useEffect(() => {
        updateDepartments()
    }, [])

    async function onFinish(formData: {name: string}) {
        const result = await createDepartmentData(formData.name);
        if(!result)
            setCreateStatus("failed")
        else
            setCreateStatus("default")
        updateDepartments();
    }

    function onDeleteDepartment(departmentId: number) {
        deleteDepartmentData(departmentId);
        updateDepartments();
    }




    return (
        <>
            {(createStatus === "failed")
                ?
                <div className="mb-7">
                    <Alert
                        message="부서 등록 실패"
                        description="동일한 이름의 부서가 이미 존재합니다."
                        type="error"
                        showIcon
                    />
                </div>
                :
                null
            }
            <Card title="부서 목록">
                <DepartmentList departments={departments} onDelete={onDeleteDepartment}/>
            </Card>
            <Card style={{ marginTop: "1rem" }} title="부서 등록">
                <Form
                    name="reservation-form"
                    wrapperCol={{ span: 16 }}
                    labelCol={{ span: 8 }}
                    style={{ maxWidth: 600 }}
                    onFinish={onFinish}>
                    <Item label="부서 명" name="name">
                        <Input placeholder="enter the text..." />
                    </Item>
                    <Item className="float-end" label={null}>
                        <Button type="primary" htmlType="submit">등록하기</Button>
                    </Item>
                </Form>
            </Card>
        </>

    )
}