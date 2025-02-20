'use client'

import { Calendar, CalendarProps } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";
import { CalendarReservedData } from "@/app/lib/data/type";
import CalendarCell from "./calendarCell";
import CalendarHeader from "./calendarHeader";
  

export default function Reservation({reservedData, onChangeDate} 
    : {reservedData: CalendarReservedData[], onChangeDate: (date: Dayjs) => void}) {
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
        headerRender={({ value, onChange }) => {
            return CalendarHeader({value, onChange, onChangeMode, displayMode});
        }}/>
    );
}

const filterByDate = (date: Dayjs, dataList: CalendarReservedData[]): CalendarReservedData[] => {
    const dateString = date.format("YYYY-MM-DD");
    return dataList.filter((item) => item.date === dateString);
}

const converToNotificationFormat = (dataList: CalendarReservedData[]) => {
    return dataList.map((item) => ({
        type: 'warning',
        content: item.purpose,
    }));
}

