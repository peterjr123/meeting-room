import { ReservationData } from "./type";

async function fetchReservationDataByDate (date: string):Promise<ReservationData[]> {
    return testData.filter((data) => {
        return data.date === date;
    })
}


const testData: ReservationData[] = [
    { id: 1, date: "2025-02-25", user: "joon", text: "reserved", startTime: "10:00", endTime: "11:40", room: "room1"},
    { id: 2, date: "2025-02-10", user: "joon", text: "meeting1", startTime: "10:00", endTime: "11:40", room: "room1"},
    { id: 3, date: "2025-02-10", user: "joon", text: "meeting2", startTime: "10:00", endTime: "11:40", room: "room2"},
    { id: 4, date: "2025-02-10", user: "joon", text: "meeting3", startTime: "10:00", endTime: "11:40", room: "room3"},
    { id: 5, date: "2025-02-15", user: "joon", text: "meeting4", startTime: "10:00", endTime: "11:40", room: "room1"},
    { id: 6, date: "2025-02-15", user: "joon", text: "meeting5", startTime: "11:50", endTime: "12:40", room: "room1"},
    { id: 7, date: "2025-02-15", user: "joon", text: "meeting6", startTime: "13:00", endTime: "15:40", room: "room1"},
    { id: 8, date: "2025-02-12", user: "joon", text: "meeting7", startTime: "13:00", endTime: "15:40", room: "room1"},
  ];




export {testData, fetchReservationDataByDate}