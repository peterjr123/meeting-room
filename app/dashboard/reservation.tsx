'use client'

import { Card, Flex } from "antd";
import CustomTable from './table/customTable'
import dayjs, { Dayjs } from "dayjs";
import CustomCalendar from "./calendar/customCalendar"
import {  useEffect, useMemo, useState } from "react";
import { convertDayjsToDateString, converToDuration } from "../lib/utils";
import { ReservedData, CalendarReservedData, TableReservedData, ReservationFormData, ReservationFormPlaceholder, SelectedTableData, ReccuringReservationData } from "../lib/data/type";
import ReservationForm from "../form/reservationForm";
import FormCard from "./form/formCard";
import { createRecurringReservationData, onRequestReservedData } from "../lib/data/api";

// 사용자가 등록할 reservation 정보 type

const initialValue: ReservationFormPlaceholder = {
    startTime: "please select on table",
    endTime: "please select on table",
    room: "please select on table",
}

export default function Reservation({ userName, createReservationAction, meetingRooms, initialReservedData }
    : { userName:string, 
        createReservationAction:(requestData: ReservationFormData | ReccuringReservationData, type: "onetime" | "recur") => void, 
        meetingRooms: string[],
        initialReservedData: ReservedData[],
    }
) {
    const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
    const [reservedData, setReservedData] = useState<ReservedData[]>(initialReservedData)
    const [reservationInfo, setReservationInfo] = useState<ReservationFormData>({
        ...initialValue,
        date: convertDayjsToDateString(selectedDate),
        userName: userName,
        purpose: "",
        details: "",
        participants: [],
    });

    // table data는 calendar가 날짜를 선택할 때마다 변경된다.
    const tableData: TableReservedData[] = useMemo(() => {
        return tableDataAdaptor(reservedData, selectedDate);
    }, [selectedDate, reservedData])

    async function onChangeDate (selectedDate: Dayjs) {
        setSelectedDate(selectedDate);
        setReservationInfo({
            ...reservationInfo,
            date: convertDayjsToDateString(selectedDate)
        })
        const newReservedData = await onRequestReservedData(convertDayjsToDateString(selectedDate));
        setReservedData([...newReservedData]);
    }

    function onSubmitReservation (value: ReservationFormData | ReccuringReservationData, type: "onetime" | "recur") {
        createReservationAction(value, type)
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
        <Flex className="h-full bg-white p-5 max-w-[1200px]" vertical gap='middle' >
            <Card title="select date">
                <CustomCalendar reservedData={calendarDataAdaptor(reservedData)} onChangeDate={onChangeDate}></CustomCalendar>
            </Card>
            <Card title="select time">
                <CustomTable key={selectedDate.date()} onSelectReservation={onSelectTableData} reservedData={tableData} meetingRooms={meetingRooms}></CustomTable>
            </Card>
            <FormCard reservationInfo={reservationInfo} onSubmitReservation={onSubmitReservation} selectedDate={selectedDate}></FormCard>
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

