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


const testData: ReservationData[] = [
    { id: 1, date: "2025-02-25", user: "joon", text: "reserved", startTime: "10:00", endTime: "11:40", room: "room1"},
    { id: 2, date: "2025-02-10", user: "joon", text: "meeting1", startTime: "10:00", endTime: "11:40", room: "room1"},
    { id: 3, date: "2025-02-10", user: "joon", text: "meeting2", startTime: "10:00", endTime: "11:40", room: "room2"},
    { id: 4, date: "2025-02-10", user: "joon", text: "meeting3", startTime: "10:00", endTime: "11:40", room: "room3"},
    { id: 5, date: "2025-02-15", user: "joon", text: "meeting4", startTime: "10:00", endTime: "11:40", room: "room1"},
    { id: 6, date: "2025-02-15", user: "joon", text: "meeting5", startTime: "11:50", endTime: "12:40", room: "room1"},
    { id: 7, date: "2025-02-15", user: "joon", text: "meeting6", startTime: "13:00", endTime: "15:40", room: "room1"},
  ];

export {testData}