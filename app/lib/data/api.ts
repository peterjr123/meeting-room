'use server'

import { DepartmentData, ReccuringReservationData, ReservationRequestData, ReservedData, RoomData, TimeString, UserData } from "./type";
import dayjs, { Dayjs } from "dayjs";
import { convertDayjsToDateString, roundDownDayjsToNearestTenMinutes } from "../utils";
import { notFound } from "next/navigation";
import { getUser } from "../session/api";
import { cache } from "react";

const API_BASE_URL = process.env.API_BASE_URL; // FastAPI 서버 주소
const O_AUTH_CLIENT_ID = process.env.O_AUTH_CLIENT_ID;
const O_AUTH_SECRET = process.env.O_AUTH_SECRET;
const O_AUTH_REDIRECT_URL = process.env.O_AUTH_REDIRECT_URL;


// 모든 예약 조회
export async function fetchReservationData() {
  try {
    const response = await fetch(`${API_BASE_URL}/reservations/`, { cache: 'no-store' });
    if (!response.ok) {
      console.log(response);
      return undefined;
    }
    return response.json();
  }
  catch (error) {
    console.log(error)
    return undefined;
  }
}

export async function fetchFollowingReservationData(dayjs: Dayjs) {
  const date = convertDayjsToDateString(dayjs);
  const time = roundDownDayjsToNearestTenMinutes(dayjs);

  try {
    const response = await fetch(`${API_BASE_URL}/reservations/upcoming?base_time=${time}&base_date=${date}`, { cache: 'no-store' });
    if (!response.ok) {
      console.log(response);
      return undefined;
    }
    return response.json();
  }
  catch (error) {
    console.log(error)
    return undefined
  }
}

// 새로운 예약 생성
export async function createReservationData(reservation: ReservationRequestData) {
  console.log(reservation)

  try {
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
        participants: reservation.participants
      }),
    });
    if (!response.ok) {
      console.log(await response.json());
      return undefined;
    }
    return response.json();
  }
  catch (error) {
    console.log(error);
    return undefined;
  }

}

export async function deleteReservationData(reservationId: number) {
  try {
    const response = await fetch(`${API_BASE_URL}/reservations/${reservationId}`, { method: 'DELETE' });
    if (!response.ok) {
      return undefined;
    }
    return response.json();
  }
  catch (error) {
    console.log(error);
    return undefined;
  }

}


export const getCurrentUserInfo = cache(async (): Promise<UserData | undefined>  => {
  const user = await getUser();
  if (!user) return undefined;

  return {
    id: user.id,
    name: user.name as string,
    password: "not allowed",
    department: user.department
  }
});

// 부서 API
export async function fetchDepartmentList(): Promise<DepartmentData[] | undefined> {
  try {
    const response = await fetch(`${API_BASE_URL}/departments/`, { cache: 'no-store' });
    if (!response.ok) {
      console.log(response);
      return undefined;
    }
    return response.json();
  }
  catch (error) {
    console.log(error)
    return undefined;
  }
}

export async function deleteDepartmentData(departmentId: number) {
  try {
    const response = await fetch(`${API_BASE_URL}/departments/${departmentId}`, { method: "DELETE" });
    if (!response.ok) {
      console.log(response);
      return undefined;
    }
    return response.json();
  }
  catch (error) {
    console.log(error)
    return undefined;
  }
}

export async function createDepartmentData(departmentName: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/departments/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: departmentName,
      }),
    });
    if (!response.ok) {
      console.log("[createDepartmentData] ", await response.text())
      return undefined;
    }
    return response.json();
  }
  catch (error) {
    console.log(error);
    return undefined;
  }
}


// 회의실 API

// 모든 예약 조회
export async function fetchRoomData(): Promise<RoomData[] | undefined> {
  try {
    const response = await fetch(`${API_BASE_URL}/rooms/`, { cache: 'no-store' });
    if (!response.ok) {
      console.log(response);
      return undefined;
    }
    return response.json();
  }
  catch (error) {
    console.log(error)
    return undefined;
  }
}

// 새로운 회의실 생성
export async function createRoomData(data: RoomData) {
  console.log(data)

  try {
    const response = await fetch(`${API_BASE_URL}/rooms/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: data.name,
        position: data.position,
        details: data.details
      }),
    });
    if (!response.ok) {
      console.log(response);
      return undefined;
    }
    return response.json();
  }
  catch (error) {
    console.log(error);
    return undefined;
  }
}

// 회의실 정보 수정
export async function updateRoomData(data: RoomData) {
  try {
    const response = await fetch(`${API_BASE_URL}/rooms/${data.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: data.name,
        position: data.position,
        details: data.details
      }),
    });
    if (!response.ok) {
      console.log(response);
      return undefined;
    }
    return response.json();
  }
  catch (error) {
    console.log(error);
    return undefined;
  }
}

// 회의실 정보 삭제
export async function deleteRoomData(roomId: number) {
  try {
    const response = await fetch(`${API_BASE_URL}/rooms/${roomId}`, { method: 'DELETE' });
    if (!response.ok) {
      return undefined;
    }
    return response.json();
  }
  catch (error) {
    console.log(error);
    return undefined;
  }

}


// 정기 예약 API

// 모든 정기 예약 조회
export async function fetchRecurringReservationData(): Promise<ReccuringReservationData[] | undefined> {
  try {
    const response = await fetch(`${API_BASE_URL}/reservations/recur/`, { cache: 'no-store' });
    if (!response.ok) {
      console.log(response);
      return undefined;
    }
    return response.json();
  }
  catch (error) {
    console.log(error)
    return undefined;
  }
}

// 새로운 정기 예약 생성
export async function createRecurringReservationData(reservation: ReccuringReservationData) {
  console.log(reservation)

  try {
    const response = await fetch(`${API_BASE_URL}/reservations/recur/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dayInWeek: reservation.dayInWeek,
        userName: reservation.userName,
        userId: reservation.userId,
        startTime: reservation.startTime,
        endTime: reservation.endTime,
        purpose: reservation.purpose,
        details: reservation.details,
        room: reservation.room,
        participants: reservation.participants
      }),
    });
    if (!response.ok) {
      console.log(await response.text());
      return undefined;
    }
    return response.json();
  }
  catch (error) {
    console.log(error);
    return undefined;
  }
}

// 정기 예약 삭제
export async function deleteRecurringReservationData(reservationId: number) {
  try {
    const response = await fetch(`${API_BASE_URL}/reservations/recur/${reservationId}`, { method: 'DELETE' });
    if (!response.ok) {
      return undefined;
    }
    return response.json();
  }
  catch (error) {
    console.log(error);
    return undefined;
  }
}


// date 기준 전후 1개월씩의 reserved data를 fetch (client component가 사용)
export async function onRequestReservedData(dateString: string): Promise<ReservedData[]> {
  const date = dayjs(dateString)
  // 1. 1개월 이전의 date로 부터 followup reservation 구하기
  const oneTimeReservations = await fetchFollowingReservationData(date.subtract(1, "month"));
  if (!oneTimeReservations) notFound();

  const recurringReservations = await fetchRecurringReservationData();
  if (!recurringReservations) notFound();

  const convertedReservations = recurringReservations.flatMap((reservation) => {
    return convertRecurringToOnetime(reservation, date.subtract(1, "month"), date.add(1, "month"));
  })

  return [...oneTimeReservations, ...convertedReservations];
  // return [...oneTimeReservations];
}


// User CRUD

export async function createUserData(user: UserData) {
  console.log(user)

  try {
    const response = await fetch(`${API_BASE_URL}/users/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: user.name,
        password: user.password,
        department: user.department
      }),
    });
    if (!response.ok) {
      console.log(await response.text());
      return undefined;
    }
    return response.json();
  }
  catch (error) {
    console.log(error);
    return undefined;
  }
}

export async function fetchUserData(userId: number) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/`, { cache: 'no-store' });
    if (!response.ok) {
      // console.log("[fetchUserData]: ", await response.text());
      return undefined;
    }
    return response.json();
  }
  catch (error) {
    console.log(error)
    return undefined;
  }
}

export async function fetchUserList(): Promise<UserData[] | undefined> {
  try {
    const response = await fetch(`${API_BASE_URL}/users/`, { cache: 'no-store' });
    if (!response.ok) {
      console.log(response);
      return undefined;
    }
    return response.json();
  }
  catch (error) {
    console.log(error)
    return undefined;
  }
}


// admin authorization
export async function isAuthorizedAdmin() {
  const user = await getUser()
  if (user && user.name === "admin")
    return true;
  return false;
}



// oauth 인증

export async function getAccessToken(code: string) {
  if (!(O_AUTH_CLIENT_ID && O_AUTH_SECRET && O_AUTH_REDIRECT_URL)) {
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
    }),
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

  if (!response.ok) {
    console.log(response);
    console.log(await response.text());
  }
  const result = await response.json();
  console.log(result);
  return result;
}





function convertRecurringToOnetime(data: ReccuringReservationData, startDate: Dayjs, endDate: Dayjs): ReservedData[] {
  // startDate부터 가장 빠른 다음 요일을 찾고, endDate 이전까지의 해당 요일의 모든 Dayjs 객체 반환.
  let looplock = 0;
  let currentDate = startDate;
  while(currentDate.format("dddd") !== data.dayInWeek && looplock++ < 10) {
      console.log(currentDate.format("dddd"), data.dayInWeek)
      currentDate = currentDate.add(1, "day");
  }

  const result = [];
  while(currentDate.isBefore(endDate) && looplock++ < 10) {
      console.log(currentDate.date(), endDate.date());
      result.push({
          id: data.id,
          date: convertDayjsToDateString(currentDate),
          startTime: data.startTime as TimeString,
          endTime: data.endTime as TimeString,
          purpose: data.purpose,
          details: data.details,
          userId: data.userId,
          userName: data.userName,
          room: data.room,
          participants: data.participants,
      });
      currentDate = currentDate.add(1, "week");
  }
  
  return result;
  // return result;
}