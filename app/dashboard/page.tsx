import { auth } from "@clerk/nextjs/server";
import Reservation from "./reservation";
import { fetchReservationData, createReservationData } from "../lib/data/api";
import { ReservationRequestData } from "../lib/data/type";
import { redirect } from "next/navigation";

export default async function dashboard() {
    const reservations = await fetchReservationData();

    async function createReservation(data: ReservationRequestData) {
        'use server'
        const result = await createReservationData(data);
        if (!result) {
            // validation failed
            redirect(`/quick/result?type=failed`)
        }
        else {
            // success
            redirect(`/quick/result?type=success&${toPathParams(data)}`)
        }

    }


    return (
        <div className="h-full">
            <Reservation createReservationAction={createReservation} reservedData={reservations}></Reservation>
        </div>
    );
}


function toPathParams(reservationData: ReservationRequestData) {
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