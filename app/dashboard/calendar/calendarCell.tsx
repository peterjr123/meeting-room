import dayjs, { Dayjs } from "dayjs";
import type { BadgeProps, CalendarMode } from 'antd';
import { Badge } from 'antd';
type NotificationData = {
    type: string,
    content: string,
}


export default function CalendarCell({current, today, notificationData}
    : {current: Dayjs, today: Dayjs, notificationData: NotificationData[]}) {
    
    return (
        <div className={`${isSameDay(current, today) ? "ant-picker-calendar-date-today " : ""}ant-picker-cell-inner ant-picker-calendar-date`}>
            <div className="ant-picker-calendar-date-value text-left">
                {current.date()}
            </div>
            <div className="ant-picker-calendar-date-content" style={{ scrollbarWidth: 'thin', scrollbarColor: '#eaeaea transparent'}}>
                <ul className="events">
                    {notificationData.map((item, index) => (
                      <li key={index}>
                        <Badge status={item.type as BadgeProps['status']} text={item.content} />
                      </li>
                    ))}
                </ul>
            </div>
        </div> 
    );   
}

// util functions
const isSameDay = (day1: Dayjs, day2: Dayjs) => {
    return (day1.date() === day2.date() && day1.month() === day2.month() && day1.year() === day2.year());
}

