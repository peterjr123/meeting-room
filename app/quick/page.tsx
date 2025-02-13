import dayjs from "dayjs";
import { createReservationData, fetchReservationData } from "../lib/data/api";
import { ReservationRequestData, ReservedData } from "../lib/data/type";
import { convertDayjsToDateString, convertDayjsToTimeString } from "../lib/utils";
import { Alert } from "antd";
import QuickReservationForm from "./quickReservationForm";
import { redirect } from "next/navigation";

export default async function QuickPage() {
    const reservations = await fetchReservationData();
    const possibilities = possibleRerservationData(reservations);
    // const possibilities = []

    async function createReservation(reservationData: ReservationRequestData) {
        'use server'
        const result = await createReservationData(reservationData);
        if (!result) {
            // validation failed
            redirect(`/quick/result?type=failed`)
        }
        else {
            // success
            redirect(`/quick/result?type=success&${toPathParams(reservationData)}`)
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

function possibleRerservationData(reservationData: ReservedData[]): ReservationRequestData[] {
    const now = dayjs();
    const rooms = ["room1", "room2", "room3"]
    const currentMinutes = Math.floor(now.minute() / 10) * 10;
    const startTime = now.minute(currentMinutes).second(0);
    // 먼저 템플릿 생성
    const possibilities: ReservationRequestData[] = rooms.map((room) => {
        // 현재 시간부터 1시간 뒤까지 각 room에 대한 ReservationData 생성
        return {
            date: convertDayjsToDateString(now),
            user: 'user',
            startTime: convertDayjsToTimeString(startTime),
            endTime: convertDayjsToTimeString(startTime.add(1, "hour")),
            room: room,
            text: "",
        }
    })
    return possibilities.filter((possibility) => {
        // 겹치는게 없으면 true를 반환
        return !reservationData.some(
            (reservation) =>
                reservation.room === possibility.room &&
                !(reservation.endTime < possibility.startTime || reservation.startTime > possibility.endTime)
        );
    });
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