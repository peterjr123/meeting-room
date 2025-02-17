'use client'

import { Card, Flex } from "antd";
import CustomTable from './table/customTable'
import dayjs, { Dayjs } from "dayjs";
import CustomCalendar from "./calendar/customCalendar"
import {  useMemo, useState } from "react";
import { convertDayjsToDateString, converToDuration } from "../lib/utils";
import { ReservedData, CalendarReservedData, TableReservedData, ReservationFormData, ReservationFormPlaceholder, SelectedTableData } from "../lib/data/type";
import ReservationForm from "../form/reservationForm";

// 사용자가 등록할 reservation 정보 type

const initialValue: ReservationFormPlaceholder = {
    startTime: "please select on table",
    endTime: "please select on table",
    room: "please select on table",
}

export default function Reservation({ userName, createReservationAction, reservedData}
    : { userName:string, createReservationAction:(requestData: ReservationFormData) => void, reservedData: ReservedData[]}
) {
    const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
    const [reservationInfo, setReservationInfo] = useState<ReservationFormData>({
        ...initialValue,
        date: convertDayjsToDateString(selectedDate),
        userName: userName,
        purpose: "",
        details: "",
    });

    // table data는 calendar가 날짜를 선택할 때마다 변경된다.
    const tableData: TableReservedData[] = useMemo(() => {
        return tableDataAdaptor(reservedData, selectedDate);
    }, [selectedDate, reservedData])

    function onChangeDate (selectedDate: Dayjs) {
        setSelectedDate(selectedDate);
    }

    function onSubmitReservation (value: ReservationFormData) {
        createReservationAction(value)
    }

    function onSelectTableData(data: SelectedTableData) {
        setReservationInfo({
            ...reservationInfo,
            startTime: (data.startTime ? data.startTime : initialValue.startTime),
            endTime: (data.endTime ? data.endTime : initialValue.endTime),
            room: (data.room ? data.room : initialValue.room),
        })
    }

    return (
        <Flex className="h-full bg-white p-5" vertical gap='middle' >
            <Card title="select date">
                <CustomCalendar reservedData={calendarDataAdaptor(reservedData)} onChangeDate={onChangeDate}></CustomCalendar>
            </Card>
            <Card title="select time">
                <CustomTable key={selectedDate.date()} onSelectReservation={onSelectTableData} reservedData={tableData}></CustomTable>
            </Card>

            <Card title="check information details">
                <ReservationForm formValues={reservationInfo} onPressSubmit={onSubmitReservation}></ReservationForm>
            </Card>
        </Flex>
    );
}

// utility functions below
const calendarDataAdaptor = (fetchedData: ReservedData[]): CalendarReservedData[] => {
    return fetchedData.map((data) => {
        return {
            id: data.id,
            date: data.date,
            purpose: data.purpose,
        }
    })
}
const tableDataAdaptor = (fetchedData: ReservedData[], selectedDate: Dayjs): TableReservedData[] => {
    return fetchedData
        .filter((data) => {
            return data.date === convertDayjsToDateString(selectedDate);
        })
        .map((data) => {
            return {
                id: data.id,
                userName: data.userName,
                room: data.room,
                startTime: data.startTime,
                duration: converToDuration(data.startTime, data.endTime),
            }
        })
}

