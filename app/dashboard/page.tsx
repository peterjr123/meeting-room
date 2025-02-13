import { auth } from "@clerk/nextjs/server";
import Reservation from "./reservation";
import { fetchReservationData, createReservationData } from "../lib/data/api";
import { ReservationData } from "../lib/data/type";
import { redirect } from "next/navigation";

export default async function dashboard() {
    const { userId, redirectToSignIn } = await auth();
    if (!userId) return redirectToSignIn();

    const reservations = await fetchReservationData();
    // const possibilities = []

    async function createReservation(reservationData: ReservationData) {
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
        <div className="h-full">
            <Reservation createReservationAction={createReservation} reservedData={reservations}></Reservation>
        </div>
    );
}


function toPathParams(reservationData: ReservationData) {
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