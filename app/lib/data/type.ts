export type DateString = `${number}${number}${number}${number}-${number}${number}-${number}${number}`; // ex: 2025-01-01
export type TimeString = `${number}${number}:${number}${number}` | `${string}:${string}`; // ex: 09:00

export const MEETING_ROOMS = ["room1", "room2", "room3"];
export type MeetingRoom = typeof MEETING_ROOMS[number]; // room1 | room2 | room3


// 서버에서 받아오는 이미 예약된 데이터에 대한 타입
export type ReservedData = {
    id: number
} & ReservationRequestData

// 예약 요청 데이터에 대한 타입
export type ReservationRequestData = {
    date: DateString,
    user: string,
    text: string,
    startTime: TimeString,
    endTime: TimeString,
    room: MeetingRoom
}

// Calendar에서 사용하는 데이터 타입
export type CalendarReservedData = {
    id: number,
    date: DateString,
    text: string,
}

// Table에서 사용하는 데이터 타입
export type TableReservedData = {
    id: number,
    room: MeetingRoom,
    startTime: TimeString,
    duration: number,
}



export type ReservationFormPlaceholder = {
    startTime: string,
    endTime: string,
    room: string,
}
export type SelectedTableData = {
    startTime: TimeString | undefined,
    endTime: TimeString | undefined,
    room: MeetingRoom | undefined,
}
export type ReservationFormData = {
    date: DateString,
    user: string,
    text: string,
    startTime: TimeString | ReservationFormPlaceholder["startTime"],
    endTime: TimeString | ReservationFormPlaceholder["endTime"],
    room: MeetingRoom | ReservationFormPlaceholder["room"],
}


// utils
export type TimeSlot = {
    key: number,
    time: TimeString,
}