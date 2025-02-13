export type ReservationData = {
    id: number
    date: string,
    user: string,
    text: string,
    startTime: string,
    endTime: string,
    room: string,
}

// DB에서 Fetch한 Reservation 정보에 대한 type
export type ReservedData = {
    calendarNotificationData: CalendarNotificationData[]
    tableData: TableReservationData[]
}
export type CalendarNotificationData = {
    id: number,
    date: string,
    text: string,
}
export type TableReservationData = {
    id: number,
    room: string,
    start: string,
    duration: number,
}