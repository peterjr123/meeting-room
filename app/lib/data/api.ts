'use server'

import { currentUser } from "@clerk/nextjs/server";
import { ReservationRequestData, ReservedData } from "./type";
import { Dayjs } from "dayjs";
import { convertDayjsToDateString, roundDownDayjsToNearestTenMinutes, convertDayjsToTimeString } from "../utils";

const API_BASE_URL = process.env.API_BASE_URL; // FastAPI 서버 주소
const O_AUTH_CLIENT_ID = process.env.O_AUTH_CLIENT_ID;
const O_AUTH_SECRET = process.env.O_AUTH_SECRET;
const O_AUTH_REDIRECT_URL = process.env.O_AUTH_REDIRECT_URL;


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
  const response = await fetch(`${API_BASE_URL}/reservations/${reservationId}`, { method: 'DELETE' });
  console.log(response)
  if (!response.ok) {
    return undefined;
  }
  return response.json();
}


export async function getCurrentUserInfo(): Promise<{ userId: string, userName: string } | undefined> {
  const user = await currentUser();
  if (!user) return undefined;

  return {
    userId: user.id,
    userName: user.fullName as string,
  }
}



// oauth 인증

export async function getAccessToken(code: string) {
  if(!(O_AUTH_CLIENT_ID && O_AUTH_SECRET && O_AUTH_REDIRECT_URL)) {
    throw Error("env are undefined")
  }

  const response = await fetch("https://adapted-hound-15.clerk.accounts.dev/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: O_AUTH_CLIENT_ID,
      client_secret: O_AUTH_SECRET,
      redirect_uri: O_AUTH_REDIRECT_URL,
      code: code,
    })
  });
  if (!response.ok) {
    console.log(await response.text());
    return undefined

  }
  const result = await response.json();
  console.log(result);
  return result["access_token"];
}

export async function validateAccessToken(accessToken: string) {
  console.log(accessToken);
  const response = await fetch("https://adapted-hound-15.clerk.accounts.dev/oauth/token_info", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": "Basic " + Buffer.from(`${O_AUTH_CLIENT_ID}:${O_AUTH_SECRET}`).toString("base64"),
    },
    body: new URLSearchParams({
      token: accessToken
    })
  });

  if(!response.ok) {
    console.log(response);
    console.log(await response.text());
  }
  const result = await response.json();
  console.log(result);
  return result;
}