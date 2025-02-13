import { TableProps } from "antd";
import { TableReservationData } from "./type";
// 시간표 데이터 (10분 단위, 10:00 ~ 11:00)
const startHour = 10;
const endHour = 18;
const timeSlots = Array.from({ length: (endHour-startHour)*6 }, (_, i) => ({
    key: i,
    time: `${Math.floor(startHour + (i / 6))}:${(i % 6) !== 0 ? (i % 6) * 10 : '00'}`, // 10:00 ~ 11:50
}));

const rooms = ["room1", "room2", "room3"];

type TableCell = {
    text: string,
    colSpan: number,
}

type TableRow = {
    key: string,
    room: string,
    [time: string]: TableCell
     | string // key나 room이 string이므로 필요함
}


const convertToDatasource = (reservations: TableReservationData[]) => {
    const data: TableRow[] = rooms.map((room) => {
        const row: TableRow = {
            'key': room,
            'room': room,
        };

        // 각 시간 슬롯에 대한 예약 확인
        timeSlots.forEach((slot, index) => {
            const reservation = reservations.find(
                (r) => r.room === room && r.start === slot.time
            );

            if (reservation) {
                // 예약 시작 시간인 경우
                const colSpan = reservation.duration / 10;
                row[slot.time] = {
                    text: `예약 (${reservation.duration}분)`,
                    colSpan: colSpan,
                };
            } else if (
                reservations.some(
                    (r) =>
                        r.room === room &&
                        timeSlots.findIndex((s) => s.time === r.start) < index &&
                        index <
                        timeSlots.findIndex((s) => s.time === r.start) + r.duration / 10
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

const getTableColumns = (CellComponent: React.ElementType) => {
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
                <CellComponent reserved={(record[slot.time] as TableCell).colSpan === 1 ? false : true} time={slot.time} room={`room${index+1}`}>{value.text}</CellComponent>
            ),
            onCell: (record: TableRow, _: any) => {
                return { colSpan: (record[slot.time] as TableCell).colSpan }
            },
        })),
    ];

    return columns;
}


export {convertToDatasource, getTableColumns};