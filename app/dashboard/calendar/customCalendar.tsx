import { Calendar, CalendarProps } from "antd";
import dayjs, { Dayjs } from "dayjs";
import type { BadgeProps, CalendarMode } from 'antd';
import { Badge } from 'antd';
import CustomCalendarHeader from "./customCalendarHeader";
import { useState } from "react";
import { CalendarNotificationData } from "@/app/lib/data/reservationData";

  
  

export default function Reservation({reservedData, onChangeDate} 
    : {reservedData: CalendarNotificationData[], onChangeDate: (date: Dayjs) => void}) {
    const [displayMode, setDisplayMode] = useState<string>("week");
    const [selectedDate, setSelectedDate] = useState<Dayjs>();

    const onChangeMode = (mode: string) => {
        if(displayMode !== mode) {
            setDisplayMode(mode)
            
            if(mode === "week") {
                // 다시 이번주를 출력하도록 변경
                onChangeSelectedDate(dayjs());
            }
        }
    }
    const onChangeSelectedDate = (date: Dayjs) => {
        setSelectedDate(date);
        onChangeDate(date);
    }
    const getListData = (value: Dayjs) => {
        // 현재 날짜를 YYYY-MM-DD 형식의 문자열로 변환
        const dateString = value.format("YYYY-MM-DD");
      
        // 해당 날짜와 일치하는 데이터를 필터링하여 리스트 구성
        const listData = reservedData
          .filter((item) => item.date === dateString)
          .map((item) => ({
            type: 'warning', // 기본 타입을 warning으로 설정
            content: item.text,
          }));
          
        return listData;
      };

    const fullCellRender: CalendarProps<Dayjs>['fullCellRender'] = (current, info) => {
        const listData = getListData(current);
        return (
            ((displayMode === "month") || (current.week() === info.today.week()) 
            ? 
            <div className={`${isSameDay(current, info.today) ? "ant-picker-calendar-date-today " : ""}ant-picker-cell-inner ant-picker-calendar-date`}>
                <div className="ant-picker-calendar-date-value text-left">
                    {current.date()}
                </div>
                <div className="ant-picker-calendar-date-content" style={{ scrollbarWidth: 'thin', scrollbarColor: '#eaeaea transparent'}}>
                    <ul className="events">
                        {listData.map((item) => (
                          <li key={item.content}>
                            <Badge status={item.type as BadgeProps['status']} text={item.content} />
                          </li>
                        ))}
                    </ul>
                </div>
            </div> 
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

const isSameDay = (day1: Dayjs, day2: Dayjs) => {
    return (day1.date() === day2.date() && day1.month() === day2.month() && day1.year() === day2.year());
}
