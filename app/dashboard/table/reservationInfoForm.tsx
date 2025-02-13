'use client'

import React, { useEffect } from 'react';
import type { FormProps } from 'antd';
import { Button, Checkbox, Form, Input } from 'antd';

export type FieldType = {
    startTime?: string;
    endTime?: string;
    room?: string;
};

export default function ReservationInfoForm({ formValues, onSubmit }: 
    { formValues: FieldType, onSubmit: Function }) {
    const [form] = Form.useForm();

    useEffect(() => {
        form.setFieldsValue({
            ...formValues
        });
    }, [formValues])

    const onPressSubmit = (values: any) => {
        onSubmit(values);
    } 

    return (
        <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            form={form}
            initialValues={{ ...formValues }}
            onFinish={onPressSubmit}
            autoComplete="off"
        >
            <Form.Item<FieldType>
                label="start time"
                name="startTime"
            >
                <Input readOnly/>
            </Form.Item>

            <Form.Item<FieldType>
                label="end time"
                name="endTime"
            >
                <Input readOnly/>
            </Form.Item>

            <Form.Item<FieldType>
                label="room"
                name="room"
            >
                <Input readOnly/>
            </Form.Item>

            <Form.Item label={null}>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    );
}