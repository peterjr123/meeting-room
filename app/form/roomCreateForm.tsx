'use client'

import { RoomData } from "../lib/data/type";
import { Form, Input, Button } from "antd";
import TextArea from "antd/es/input/TextArea";
const { Item } = Form;

export default function ReservationForm({ onPressSubmit, existingRooms }
    : {
        onPressSubmit: (formValues: RoomData) => void,
        existingRooms: RoomData[]
    }
) {
    function onFinish(formValues: { name: string, position: string, details: string}) {
        existingRooms
        onPressSubmit({
            ...formValues,
            id: -1, // not needed
        })
    }
    return (
        <Form
            name="reservation-form"
            wrapperCol={{ span: 16 }}
            labelCol={{ span: 8 }}
            style={{ maxWidth: 600 }}
            onFinish={onFinish}>
            <Item label="name" name="name" validateTrigger="onBlur" hasFeedback rules={[{ validator: (rule, value) => {
                if(existingRooms.findIndex((data) => data.name === value) === -1) {
                    return Promise.resolve();
                }
                return Promise.reject(new Error("room name must be unique"))
            }}, {required: true}]}>
                <Input placeholder="enter the text..."/>
            </Item>
            <Item label="position" name="position">
                <Input placeholder="enter the text..."/>
            </Item>
            <Item label="details" name="details">
                <TextArea placeholder="enter the text..." style={{ resize: 'none', height: 120 }} />
            </Item>
            <Item className="float-end" label={null}>
                <Button type="primary" htmlType="submit">등록하기</Button>
            </Item>
        </Form>
    )
}
