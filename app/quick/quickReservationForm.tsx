'use client'

import { Button, Card, Checkbox, Divider, Form, Input } from "antd";
import { ReservationData } from "../lib/data/type";
import TextArea from "antd/es/input/TextArea";
const { Item } = Form;

export default function QuickReservationForm({reservationData, onSubmit}: 
    {reservationData:ReservationData, onSubmit: Function}
) {
    const onPressSubmit = (values: any) => {
        onSubmit(values)
    } 
    return (
        <Card title="Quick Reservation">
            <p>
                빠른 예약에서는 시간 정보를 변경할 수 없습니다.
            </p>
            <p>
                특정 시간대에 예약하시려면 대시보드의 예약 시스템을 사용해 주세요.
            </p>
            <Divider />
            <Form
                name="quick-form"
                wrapperCol={{ span: 16 }}
                labelCol={{ span: 8 }}
                style={{ maxWidth: 600 }} 
                onFinish={onPressSubmit}
                initialValues={reservationData}>
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
                <Item label="user" name="user">
                    <Input readOnly />
                </Item>
                <Item label="purpose" name="text">
                    <TextArea placeholder="enter the text..." style={{resize: 'none', height: 120}}/>
                </Item>
                <Item className="float-end" label={null}>
                    <Button type="primary" htmlType="submit">예약하기</Button>
                </Item>
            </Form>
        </Card>
    );
}
