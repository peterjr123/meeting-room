import { ReservationData } from "./type";

const API_BASE_URL = process.env.API_BASE_URL; // FastAPI 서버 주소

// 모든 예약 조회
export async function fetchReservationData(): Promise<ReservationData[]> {
  const response = await fetch(`${API_BASE_URL}/reservations/`);
  if (!response.ok) {
    throw new Error("Failed to fetch reservations");
  }
  return response.json();
}

// 새로운 예약 생성
export async function createReservationData(reservation: ReservationData) {
  const response = await fetch(`${API_BASE_URL}/reservations/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
        date: reservation.date,
        user: reservation.user,
        text: reservation.text,
        startTime: reservation.startTime,
        endTime: reservation.endTime,
        room: reservation.room,
    }),
  });
  if (!response.ok) {
    return undefined;
  }
  return response.json();
}
