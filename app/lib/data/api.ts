'use server'

import { currentUser } from "@clerk/nextjs/server";
import { ReservationRequestData, ReservedData } from "./type";
import { Dayjs } from "dayjs";
import { convertDayjsToDateString, roundDownDayjsToNearestTenMinutes, convertDayjsToTimeString } from "../utils";

const API_BASE_URL = process.env.API_BASE_URL; // FastAPI 서버 주소

// 모든 예약 조회
export async function fetchReservationData(): Promise<ReservedData[]> {
  const response = await fetch(`${API_BASE_URL}/reservations/`);
  if (!response.ok) {
    console.log(response);
    throw new Error("Failed to fetch reservations");
  }
  return response.json();
}

export async function fetchFollowingReservationData(dayjs: Dayjs) {
  const date = convertDayjsToDateString(dayjs);
  const time = roundDownDayjsToNearestTenMinutes(dayjs);

  const response = await fetch(`${API_BASE_URL}/reservations/upcoming?base_time=${time}&base_date=${date}`);
  if (!response.ok) {
    console.log(response);
    throw new Error("Failed to fetch reservations");
  }
  return response.json();
}

// 새로운 예약 생성
export async function createReservationData(reservation: ReservationRequestData) {
  console.log(reservation)
  const response = await fetch(`${API_BASE_URL}/reservations/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
        date: reservation.date,
        userName: reservation.userName,
        userId: reservation.userId,
        purpose: reservation.purpose,
        details: reservation.details,
        startTime: reservation.startTime,
        endTime: reservation.endTime,
        room: reservation.room,
    }),
  });
  if (!response.ok) {
    console.log(response);
    return undefined;
  }
  return response.json();
}

export async function deleteReservationData(reservationId: number) {
  const response = await fetch(`${API_BASE_URL}/reservations/${reservationId}`, { method: 'DELETE'});
  console.log(response)
  if(!response.ok) {
    return undefined;
  }
  return response.json();
}


export async function getCurrentUserInfo(): Promise<{userId: string, userName: string} | undefined>{
  const user = await currentUser();
  if(!user) return undefined;

  return {
    userId: user.id,
    userName: user.fullName as string,
  }
}