import dayjs from "dayjs";
import { createReservationData, fetchFollowingReservationData, fetchReservationData, fetchRoomData, getCurrentUserInfo, onRequestReservedData } from "../lib/data/api";
import { ReservationRequestData, ReservedData, TimeString } from "../lib/data/type";
import { compareTime, convertDayjsToDateString, convertDayjsToTimeString } from "../lib/utils";
import { Alert } from "antd";
import QuickReservationForm from "./quickReservationForm";
import { notFound, redirect } from "next/navigation";

export default async function QuickPage() {
    const reservations = await onRequestReservedData(convertDayjsToDateString(dayjs()));
    if(!reservations) notFound();
    const roomData = await fetchRoomData();
        if(!roomData) notFound();
    const user = await getCurrentUserInfo();
    if (!user) redirect("/");

    const possibilities = possibleRerservationData(reservations, roomData.map((data) => data.name));
    if (possibilities.length !== 0) {
        possibilities[0].userId = user.id;
        possibilities[0].userName = user.name;
    }


    async function createReservation(reservationData: ReservationRequestData) {
        'use server'
        const result = await createReservationData(reservationData);
        if (!result) {
            // validation failed
            redirect(`/result/create?type=failed`)
        }
        else {
            // success
            redirect(`/result/create?type=success&reservation=onetime&${toPathParams(reservationData)}`)
        }

        // TODO: do redirect with path params
    }

    return (
        <div>
            {(possibilities.length === 0
                ?
                <Alert
                    message="빠른 예약 사용 불가"
                    description={
                        <div>
                            <p>현재 모든 회의실이 사용 중이므로 빠른 예약을 사용하실 수 없습니다.</p>
                            <p>회의실 예약을 위해서 Dashboard를 사용하실 수 있습니다.</p>
                        </div>
                    }
                    type="warning"
                    showIcon
                />
                :
                <QuickReservationForm reservationData={possibilities[0]} onSubmit={createReservation}></QuickReservationForm>
            )}
        </div>
    );
}

function possibleRerservationData(reservationData: ReservedData[], meetingRooms: string[]): ReservationRequestData[] {
    const now = dayjs();
    const currentMinutes = Math.floor(now.minute() / 10) * 10;
    const startTime = now.minute(currentMinutes).second(0);
    // 먼저 템플릿 생성
    const possibilities: ReservationRequestData[] = meetingRooms.map((room) => {
        // 현재 시간부터 1시간 뒤까지 각 room에 대한 ReservationData 생성
        return {
            date: convertDayjsToDateString(now),
            userId: -1,
            userName: "",
            startTime: convertDayjsToTimeString(startTime),
            endTime: convertDayjsToTimeString(startTime.add(50, "minute")),
            room: room,
            purpose: "",
            details: "",
            participants: [],
        }
    })
    // 겹치지 않는 시간대를 반환
    return possibilities.filter((possibility) => {
        return !reservationData.some( 
            // 아래 코드는 겹치면 true를 반환해야 함.
            (reservation) =>
                reservation.date === possibility.date &&
                reservation.room === possibility.room &&
                isTimeConflict(reservation.startTime, reservation.endTime, possibility.startTime, possibility.endTime)
        );
    });
}

function isTimeConflict(startTime1: TimeString, endTime1: TimeString, startTime2: TimeString, endTime2: TimeString) {
    if ((compareTime(endTime1, startTime2) <= 0)
    || compareTime(startTime1, endTime2) >= 0)
        return false;
    else
        return true;
}

function toPathParams(requestData: ReservationRequestData) {
    const params = {
        date: requestData.date,
        startTime: requestData.startTime,
        endTime: requestData.endTime
    };

    return Object.keys(params)
        .map((key) => {
            return `${key}=${params[key as keyof typeof params]}`
        })
        .join('&');
}