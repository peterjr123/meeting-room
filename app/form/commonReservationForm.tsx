import { Form, Input, Button, AutoComplete, AutoCompleteProps, Cascader } from "antd";
import TextArea from "antd/es/input/TextArea";
import ParticipantsCascaderItem from "./participantCascaderItem";
import RoomSelector from "../ui/common/roomSelecter";
import { useEffect } from "react";
const { Item } = Form;

type CommonReservationFormData = {
    startTime: string,
    endTime: string,
    room: string,
    userName: string,
    participants: string[]
    purpose: string,
    details: string,
} & {
    [key: string]: unknown
}

export default function CommonReservationForm({ children, formValues, onFinish }: { children: React.ReactNode, formValues: CommonReservationFormData & {}, onFinish: (formValues: any) => void }) {
    const [form] = Form.useForm();

    useEffect(() => {
        form.setFieldsValue({
            ...formValues,
        });
    }, [formValues, form])

    return (
        <Form
            form={form}
            name="reservation-form"
            wrapperCol={{ span: 16 }}
            labelCol={{ span: 8 }}
            style={{ maxWidth: 600 }}
            onFinish={onFinish}>
            
            {children}
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
                <RoomSelector value={formValues.room} />
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