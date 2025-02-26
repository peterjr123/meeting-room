'use client'

import { useEffect, useState } from "react";
import { ReservationFormData } from "../lib/data/type";
import { Form, Input, Button, AutoComplete, AutoCompleteProps, Cascader } from "antd";
import TextArea from "antd/es/input/TextArea";
import { endTimeDisplayDecode, endTimeDisplayEncode } from "../lib/utils";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { fetchUserList } from "../lib/data/api";
import ParticipantsCascaderItem from "./participantCascaderItem";
const { Item, List } = Form;

export default function ReservationForm({ onPressSubmit, formValues }
    : {
        onPressSubmit: (formValues: ReservationFormData) => void,
        formValues: ReservationFormData
    }
) {
    const [form] = Form.useForm();
    useEffect(() => {

        form.setFieldsValue({
            ...formValues,
            endTime: endTimeDisplayEncode(formValues.endTime)
        });
    }, [formValues, form])

    function onFinish(formValues: ReservationFormData) {
        onPressSubmit({
            ...formValues,
            participants: formValues.participants.map((participant) => participant.at(1) as string),
            endTime: endTimeDisplayDecode(formValues.endTime)
        })
    }

    return (
        <Form
            form={form}
            name="reservation-form"
            wrapperCol={{ span: 16 }}
            labelCol={{ span: 8 }}
            style={{ maxWidth: 600 }}
            onFinish={onFinish}>
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
            <ParticipantsCascaderItem />
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
