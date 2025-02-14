import { auth } from "@clerk/nextjs/server";
import Reservation from "./reservation";
import { fetchReservationData, createReservationData, getCurrentUserInfo } from "../lib/data/api";
import { ReservationFormData, ReservationRequestData, TimeString } from "../lib/data/type";
import { redirect } from "next/navigation";

export default async function dashboard() {
    const reservations = await fetchReservationData();
    const user = await getCurrentUserInfo();
    if(!user) redirect("/");

    async function createReservation(data: ReservationFormData) {
        'use server'
        if(!user) redirect(`/quick/result?type=failed`)
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
            redirect(`/result/create?type=success&${toPathParams(data)}`)
        }

    }
    return (
        <div className="h-full">
            <Reservation userName={user.userName} createReservationAction={createReservation} reservedData={reservations}></Reservation>
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