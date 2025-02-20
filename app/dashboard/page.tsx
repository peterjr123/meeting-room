import Reservation from "./reservation";
import { fetchReservationData, createReservationData, getCurrentUserInfo, fetchRoomData, createRecurringReservationData, fetchFollowingReservationData, fetchRecurringReservationData, onRequestReservedData } from "../lib/data/api";
import { ReccuringReservationData, ReservationFormData, ReservedData, TimeString } from "../lib/data/type";
import { notFound, redirect } from "next/navigation";
import dayjs, { Dayjs } from "dayjs";
import { convertDayjsToDateString } from "../lib/utils";

export default async function dashboard() {
    let reservations = await onRequestReservedData(convertDayjsToDateString(dayjs()));
    if (!reservations) notFound();
    const roomData = await fetchRoomData();
    if (!roomData) notFound();
    const user = await getCurrentUserInfo();
    if (!user) redirect("/");
    

    async function createReservation(formData: ReservationFormData | ReccuringReservationData, type: "onetime" | "recur") {
        'use server'
        if (!user) redirect(`/quick/result?type=failed`)

        if (type === "onetime") {
            const data = formData as ReservationFormData
            const result = await createReservationData({
                ...data,
                startTime: data.startTime as TimeString,
                endTime: data.endTime as TimeString,
                userId: user.userId as string,
                userName: user.userName as string,
            });
            if (!result) {
                // validation failed
                redirect(`/result/create?type=failed`)
            }
            else {
                // success
                redirect(`/result/create?type=success&reservation=onetime&${toPathParams(data)}`)
            }
        }
        else {
            const data = formData as ReccuringReservationData
            const result = await createRecurringReservationData({
                ...data,
                userId: user.userId as string,
                userName: user.userName as string,
            })
            if (!result) {
                // validation failed
                redirect(`/result/create?type=failed`)
            }
            else {
                // success
                redirect(`/result/create?type=success&reservation=recur&dayInWeek=${data.dayInWeek}&startTime=${data.startTime}&endTime=${data.endTime}`)
            }
        }
    }

    return (
        <div className="h-full">
            <Reservation userName={user.userName} createReservationAction={createReservation} meetingRooms={roomData.map((data) => data.name)} initialReservedData={reservations}></Reservation>
        </div>
    );
}


function toPathParams(reservationData: ReservationFormData) {
    const params = {
        date: reservationData.date,
        startTime: reservationData.startTime,
        endTime: reservationData.endTime
    };

    return Object.keys(params)
        .map((key) => {
            return `${key}=${params[key as keyof typeof params]}`
        })
        .join('&');
}
