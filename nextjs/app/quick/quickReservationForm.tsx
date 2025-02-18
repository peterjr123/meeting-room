'use client'

import { Card, Divider } from "antd";
import { ReservationFormData, ReservationRequestData } from "../lib/data/type";
import ReservationForm from "../form/reservationForm";

export default function QuickReservationForm({reservationData, onSubmit}: 
    {reservationData:ReservationRequestData, onSubmit: (data: ReservationRequestData) => void}
) {
    console.log(reservationData)
    const onPressSubmit = (values: ReservationFormData) => {
        onSubmit({
            ...values,
            userId: reservationData.userId
        } as ReservationRequestData)
    } 
    return (
        <Card title="Quick Reservation">
            <p>
                빠른 예약에서는 시간 정보를 변경할 수 없습니다. (1시간 예약)
            </p>
            <p>
                특정 시간대에 예약하시려면 대시보드의 예약 시스템을 사용해 주세요.
            </p>
            <Divider />
            <ReservationForm onPressSubmit={onPressSubmit} formValues={reservationData}></ReservationForm>
        </Card>
    );
}
