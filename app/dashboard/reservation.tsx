'use client'

import { Calendar, CalendarProps, Card, Divider, Flex, Table, TableProps } from "antd";
import CustomTable from './table/customTable'
import dayjs, { Dayjs } from "dayjs";
import CustomCalendar from "./calendar/customCalendar"
import ReservationInfoForm from "./table/reservationInfoForm";
import { useEffect, useMemo, useState } from "react";
import { testData as fetchedReservationData, ReservationData as FetchedReservationData, ReservedData } from "../lib/data/reservationData";
import { CalendarNotificationData, TableReservationData } from "../lib/data/reservationData";

// 사용자가 등록할 reservation 정보 type
export type ReservationInfo = {
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
    const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
    const [reservationInfo, setReservationInfo] = useState(initialValue);
    // set db fetched data to state (just for initial rendering)
    const [calendarNotificationData, setCalendarNotificationData]
        = useState<CalendarNotificationData[]>(calendarDataAdaptor(fetchedReservationData));

    const tableData: TableReservationData[] = useMemo(() => {
        return tableDataAdaptor(fetchedReservationData, selectedDate);
    }, [selectedDate])
    
    function onChangeDate (selectedDate: Dayjs) {
        setSelectedDate(selectedDate);
    }

    return (
        <Flex className="h-full bg-white p-5" vertical gap='middle' >
            <Card title="select date">
                <CustomCalendar reservedData={calendarNotificationData} onChangeDate={onChangeDate}></CustomCalendar>
            </Card>
            <Card title="select time">
                <CustomTable setReservationInfo={setReservationInfo} reservedData={tableData}></CustomTable>
            </Card>

            <Card title="check information details">
                <ReservationInfoForm formValues={reservationInfo}></ReservationInfoForm>
            </Card>
        </Flex>
    );
}

// utility functions below
const calendarDataAdaptor = (fetchedData: FetchedReservationData[]): CalendarNotificationData[] => {
    return fetchedData.map((data) => {
        return {
            id: data.id,
            date: data.date,
            text: data.text,
        }
    })
}
const tableDataAdaptor = (fetchedData: FetchedReservationData[], selectedDate: Dayjs): TableReservationData[] => {
    return fetchedData
        .filter((data) => {
            return data.date === selectedDate.format("YYYY-MM-DD");
        })
        .map((data) => {
            return {
                id: data.id,
                room: data.room,
                start: data.startTime,
                duration: converToDuration(data.startTime, data.endTime),
            }
        })
}

const converToDuration = (startTime: string, endTime: string) => {
    const parseTime = (time: string): number => {
        const [hours, minutes] = time.split(":").map(Number);
        return hours * 60 + minutes; // 총 분(minute)으로 변환
    };

    const minutes1 = parseTime(startTime);
    const minutes2 = parseTime(endTime);

    return minutes2 - minutes1;
}