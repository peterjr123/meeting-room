'use client'

import { useEffect, useState } from "react";
import { ReccuringReservationData } from "../lib/data/type";
import { Form, Input, Button, Select, AutoComplete, AutoCompleteProps } from "antd";
import TextArea from "antd/es/input/TextArea";
import { endTimeDisplayDecode, endTimeDisplayEncode } from "../lib/utils";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { fetchUserList } from "../lib/data/api";
const { Item, List } = Form;
const { Option } = Select;
export default function RecurringReservationForm({ onPressSubmit, formValues }
    : {
        onPressSubmit: (formValues: ReccuringReservationData) => void,
        formValues: ReccuringReservationData
    }
) {
    const [options, setOptions] = useState<AutoCompleteProps['options']>([]);
    const [form] = Form.useForm();

    useEffect(() => {
        const dayInWeek = (formValues.dayInWeek === "Saturday" || formValues.dayInWeek === "Sunday") ? "" : formValues.dayInWeek
        form.setFieldsValue({
            room: formValues.room,
            userName: formValues.userName,
            dayInWeek: dayInWeek,
            startTime: formValues.startTime,
            endTime: endTimeDisplayEncode(formValues.endTime),
        });
    }, [formValues, form])

    function onFinish(formValues: ReccuringReservationData) {
        onPressSubmit({
            ...formValues,
            endTime: endTimeDisplayDecode(formValues.endTime)
        })
    }

    async function onSearchParticipant(partialName: string) {
            const users = await fetchUserList();
            if(!users) return;
            setOptions(
                users
                    .filter((user) => user.name.includes(partialName))
                    .map((user) => { return { value: user.name } })
                    .slice(0, 4)
            )
        }
    

    return (
        <Form
            form={form}
            name="reservation-form"
            wrapperCol={{ span: 16 }}
            labelCol={{ span: 8 }}
            style={{ maxWidth: 600 }}
            onFinish={onFinish}>
            <Item label="choose day" name="dayInWeek">
                <Select style={{ width: 120 }}>
                    <Option value="Monday">Monday</Option>
                    <Option value="Tuesday">Tuesday</Option>
                    <Option value="Wednesday">Wednesday</Option>
                    <Option value="Thursday">Thursday</Option>
                    <Option value="Friday">Friday</Option>
                </Select>
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
            <Item label="participants" name="participants">
                <List name="participants">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map((field, index) => (
                                <div key={index} className="flex items-center mb-3">
                                    <Item
                                        className="flex-1"
                                        style={{ marginBottom: 0 }}
                                        {...field}
                                        validateTrigger={['onChange', 'onBlur']}
                                        rules={[
                                            {
                                                required: true,
                                                whitespace: true,
                                                message: "Please input participant's name or delete this field.",
                                            },
                                        ]}
                                    >
                                        <AutoComplete placeholder="participant name" options={options} onSearch={onSearchParticipant} />
                                    </Item>
                                    {
                                        (fields.length > 0)
                                            ?
                                            (<div className="w-7 flex justify-center">
                                                <MinusCircleOutlined
                                                    className="dynamic-delete-button"
                                                    onClick={() => remove(field.name)} />
                                            </div>)
                                            : null
                                    }
                                </div>
                            ))}
                            <Item key={"button"}>
                                <Button
                                    type="dashed"
                                    onClick={() => add()}
                                    className="w-full"
                                    icon={<PlusOutlined />}
                                >
                                    Add field
                                </Button>
                            </Item>
                        </>
                    )}
                </List>
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
