'use client'

import { Calendar, CalendarProps } from "antd";
import dayjs, { Dayjs } from "dayjs";
import CustomCalendarHeader from "./customCalendarHeader";
import { useState } from "react";
import { CalendarNotificationData } from "@/app/lib/data/reservationData";
import CalendarCell from "./customCalendarCell";
  

export default function Reservation({reservedData, onChangeDate} 
    : {reservedData: CalendarNotificationData[], onChangeDate: (date: Dayjs) => void}) {
    const [displayMode, setDisplayMode] = useState<string>("week");
    const [selectedDate, setSelectedDate] = useState<Dayjs>();

    const onChangeMode = (mode: string) => {
        if(displayMode !== mode) {
            setDisplayMode(mode)
            
            if(mode === "week") {
                // 선택된 날짜의 week가 아닌, 항상 today's week를 출력
                onChangeSelectedDate(dayjs());
            }
        }
    }
    const onChangeSelectedDate = (date: Dayjs) => {
        setSelectedDate(date);
        onChangeDate(date);
    }

    const fullCellRender: CalendarProps<Dayjs>['fullCellRender'] = (current, info) => {
        const todayReservedData = filterByDate(current, reservedData);
        const todayNotificationData = converToNotificationFormat(todayReservedData);
        
        return (
            ((displayMode === "month") || (current.week() === info.today.week()) 
            ? 
                <CalendarCell current={current} today={info.today} notificationData={todayNotificationData} />
            : 
            <div></div>)
        )
    }

    
    return (
        <Calendar className="pb-4" fullscreen={true} showWeek={false} fullCellRender={fullCellRender} 
        onChange={onChangeSelectedDate}
        value={selectedDate}
        headerRender={({ value, type, onChange, onTypeChange }) => {
            return CustomCalendarHeader({value, type, onChange, onTypeChange, onChangeMode, displayMode});
        }}/>
    );
}

const filterByDate = (date: Dayjs, dataList: CalendarNotificationData[]): CalendarNotificationData[] => {
    const dateString = date.format("YYYY-MM-DD");
    return dataList.filter((item) => item.date === dateString);
}

const converToNotificationFormat = (dataList: CalendarNotificationData[]) => {
    return dataList.map((item) => ({
        type: 'warning',
        content: item.text,
    }));
}

