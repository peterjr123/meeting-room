import { TableProps } from "antd";
import { ReservationRequestData, TableReservedData, TimeSlot, TimeString } from "./type";



// 시간표 데이터 (10분 단위, 10:00 ~ 11:00)
const timeSlots: TimeSlot[] = createTimeSlots(8, 18);

type TableCell = {
    text: string,
    colSpan: number,
}

type TableRow = {
    key: string,
    room: string,
    [time: TimeString]: TableCell
}


export function convertToDatasource (reservedData: TableReservedData[], meetingRooms: string[]) {
    const data: TableRow[] = meetingRooms.map((room) => {
        const row: TableRow = {
            'key': room,
            'room': room,
        };

        // 각 시간 슬롯에 대한 예약 확인
        timeSlots.forEach((slot, index) => {
            const reserved = reservedData.find(
                (r) => r.room === room && r.startTime === slot.time
            );

            if (reserved) {
                console.log(reserved)
                // 예약 시작 시간인 경우
                const colSpan = reserved.duration / 10;
                row[slot.time] = {
                    text: reserved.userName,
                    colSpan: colSpan,
                };
            } else if (
                reservedData.some(
                    (r) =>
                        r.room === room &&
                        timeSlots.findIndex((s) => s.time === r.startTime) < index &&
                        index <
                        timeSlots.findIndex((s) => s.time === r.startTime) + r.duration / 10
                )
            ) {
                // 예약 중간 시간인 경우
                row[slot.time] = {
                    text: "",
                    colSpan: 0, // 병합된 셀 숨김
                };
            } else {
                // 예약이 없는 경우
                row[slot.time] = {
                    text: "",
                    colSpan: 1,
                };
            }
        });

        return row;
    });
    return data;
}

export function getTableColumns (CellComponent: React.ElementType, meetingRooms: string[]) {
    // 테이블 컬럼 정의
    const columns: TableProps<TableRow>['columns'] = [
        {
            title: "Room",
            dataIndex: "room",
            key: "room",
            fixed: "left", // 방 열 고정
        },
        ...timeSlots.map((slot) => ({
            title: slot.time,
            dataIndex: slot.time,
            key: slot.time,
            render: (value: TableCell, record: TableRow, index: number) => (
                // TODO: 현재 예약된 시간을 확인하기 위해 colSpan이 1인지 검사 -> 10분 예약은 불가능
                // 더 나은 판별 방법을 사용할 필요가 있음
                <CellComponent reserved={(record[slot.time] as TableCell).colSpan === 1 ? false : true} time={slot.time} room={meetingRooms[index]}>{value.text}</CellComponent>
            ),
            onCell: (record: TableRow, _: any) => {
                return { colSpan: (record[slot.time] as TableCell).colSpan }
            },
        })),
    ];

    return columns;
}


function createTimeSlots(startHour:number, endHour: number): TimeSlot[] {
    return Array.from({ length: (endHour-startHour)*6 }, (_, i) => {
        const hour = Math.floor(startHour + (i / 6)).toString().padStart(2, '0');
        const minute = ((i % 6) * 10).toString().padStart(2, '0');
        return {
            key: i,
            time: `${hour}:${minute}`
        }
    })
}

export function toPathParams(reservationData: ReservationRequestData) {
    const params = {
        date: reservationData.date,
        startTime: reservationData.startTime,
        endTime: reservationData.endTime
    };

    return Object.keys(params)
        .map((key) => {
            return `${key}=${params[key as keyof typeof params]}`
        })
        .join('&');
}
