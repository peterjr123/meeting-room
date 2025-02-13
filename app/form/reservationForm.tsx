'use client'

import { useEffect } from "react";
import { ReservationFormData, ReservationRequestData } from "../lib/data/type";
import { Form, Input, Button } from "antd";
import TextArea from "antd/es/input/TextArea";
const { Item } = Form;

export default function ReservationForm({ onPressSubmit, formValues }
    : {
        onPressSubmit: (formValues: ReservationFormData) => void,
        formValues: ReservationFormData
    }
) {
    const [form] = Form.useForm();

    useEffect(() => {
        form.setFieldsValue({
            ...formValues
        });
        console.log({ ...formValues })
    }, [formValues])


    return (
        <Form
            form={form}
            name="reservation-form"
            wrapperCol={{ span: 16 }}
            labelCol={{ span: 8 }}
            style={{ maxWidth: 600 }}
            onFinish={onPressSubmit}>
            <Item label="date" name="date">
                <Input readOnly />
            </Item>

            <Item label="time">
                <div className="flex">
                    <Item className="inline-block flex-grow" style={{ marginBottom: 0 }} name="startTime">
                        <Input readOnly />
                    </Item>
                    <span className="mx-2">~</span>
                    <Item className="inline-block flex-grow" style={{ marginBottom: 0 }} name="endTime">
                        <Input readOnly />
                    </Item>
                </div>
            </Item>
            <Item label="room" name="room">
                <Input readOnly />
            </Item>
            <Item label="user" name="userName">
                <Input readOnly />
            </Item>
            <Item label="purpose" name="purpose">
                <Input placeholder="enter the text..." />
            </Item>
            <Item label="details" name="details">
                <TextArea placeholder="enter the text..." style={{ resize: 'none', height: 120 }} />
            </Item>
            <Item className="float-end" label={null}>
                <Button type="primary" htmlType="submit">예약하기</Button>
            </Item>
        </Form>
    )
}