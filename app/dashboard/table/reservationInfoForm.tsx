import React, { useEffect } from 'react';
import type { FormProps } from 'antd';
import { Button, Checkbox, Form, Input } from 'antd';

export type FieldType = {
    startTime?: string;
    endTime?: string;
    room?: string;
};

const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    console.log('Success:', values);
};

const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
};

export default function ReservationInfoForm({ formValues }: 
    { formValues: FieldType }) {
    const [form] = Form.useForm();

    useEffect(() => {
        form.setFieldsValue({
            ...formValues
        });
    }, [formValues])

    return (
        <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            form={form}
            initialValues={{ ...formValues }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
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