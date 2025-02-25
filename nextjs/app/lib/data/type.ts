export type DateString = `${number}${number}${number}${number}-${number}${number}-${number}${number}`; // ex: 2025-01-01
export type TimeString = `${number}${number}:${number}${number}` | `${string}:${string}`; // ex: 09:00


// 서버에서 받아오는 이미 예약된 데이터에 대한 타입
export type ReservedData = {
    id: number
} & ReservationRequestData

// 예약 요청 데이터에 대한 타입
export type ReservationRequestData = {
    date: DateString,
    userId: string,
    userName: string,
    purpose: string,
    details: string,
    startTime: TimeString,
    endTime: TimeString,
    room: string,
    participants: string[]
}

// Calendar에서 사용하는 데이터 타입
export type CalendarReservedData = {
    id: number,
    date: DateString,
    purpose: string,
}

// Table에서 사용하는 데이터 타입
export type TableReservedData = {
    id: number,
    userName: string,
    room: string,
    startTime: TimeString,
    duration: number,
}

export type RoomData = {
    id: number,
    name: string,
    position: string,
    details: string,
}

export type ReservationFormPlaceholder = {
    startTime: string,
    endTime: string,
    room: string,
}
export type SelectedTableData = {
    startTime: TimeString | undefined,
    endTime: TimeString | undefined,
    room: string | undefined,
}
export type ReservationFormData = {
    date: DateString,
    userName: string,
    purpose: string,
    details: string,
    startTime: TimeString | ReservationFormPlaceholder["startTime"],
    endTime: TimeString | ReservationFormPlaceholder["endTime"],
    room: string | ReservationFormPlaceholder["room"],
    participants: string[]
}

// 정기 예약
export type ReccuringReservationData = {
    id: number,
    dayInWeek: string,
    userName: string,
    userId: string,
    purpose: string,
    details: string,
    startTime: TimeString | ReservationFormPlaceholder["startTime"],
    endTime: TimeString | ReservationFormPlaceholder["endTime"],
    room: string,
    participants: string[]
}

// utils
export type TimeSlot = {
    key: number,
    time: TimeString,
}