'use client'

import { Calendar, CalendarProps, Card, Divider, Flex, Table, TableProps } from "antd";
import CustomTable from './table/customTable'
import { Dayjs } from "dayjs";
import CustomCalendar from "./calendar/customCalendar"
import ReservationInfoForm from "./table/reservationInfoForm";
import TestCalendar from "@/app/dashboard/calendar/testCalendar"
import { useState } from "react";

type ReservationInfo = {
    startTime: string,
    endTime: string,
    room: string,
}
const initialValue: ReservationInfo = {
    startTime: "please select on table",
    endTime: "please select on table",
    room: "please select on table"
}

export default function Reservation() {
    const [reservationInfo, setReservationInfo] = useState(initialValue);
    
    return (
        <Flex className="h-full bg-white p-5" vertical gap='middle' >
            <Card title="select date">
                <CustomCalendar></CustomCalendar>
                {/* <TestCalendar></TestCalendar> */}
            </Card>
            <Card title="select time">
                <CustomTable setReservationInfo={setReservationInfo}></CustomTable>
            </Card>
            {/* <Table<dataType> pagination={{pageSize: 64}} className="h-full" columns={convertedColums} dataSource={dataSource} bordered/> */}
            
            <Card title="check information details">
                <ReservationInfoForm formValues={reservationInfo}></ReservationInfoForm>
            </Card>
        </Flex>
    );
}