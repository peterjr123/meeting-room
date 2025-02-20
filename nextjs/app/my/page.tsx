import { Card, Divider } from "antd"
import { deleteRecurringReservationData, deleteReservationData, fetchFollowingReservationData, fetchRecurringReservationData, getCurrentUserInfo } from "../lib/data/api";
import { ReccuringReservationData, ReservedData } from "../lib/data/type";
import { notFound, redirect } from "next/navigation";
import ReservationInfo from "./reservationInfo";
import dayjs from "dayjs";
import RecurringReservationInfo from "./recurringReservationInfo";

export default async function MyReservationPage() {
    const reservedData = await fetchFollowingReservationData(dayjs());
    const recurringResevedData = await fetchRecurringReservationData();
    if(!reservedData || !recurringResevedData) notFound();

    const user = await getCurrentUserInfo();
    if (!user) redirect("/");

    console.log(reservedData)
    const filteredData = filterMyReservedData(reservedData, user.userId);
    const filteredRecurringData = filterMyRecurringData(recurringResevedData, user.userId);

    async function onDeleteReserved(reservedData: ReservedData) {
        'use server'
        const result = await deleteReservationData(reservedData.id);
        if (result)
            redirect(`/result/delete?type=success&${result.purpose}`)
        else
            redirect(`/result/delete?type=failed`)
    } 
    async function onDeleteRecurringReserved(reservedData: ReccuringReservationData) {
        'use server'
        const result = await deleteRecurringReservationData(reservedData.id);
        if (result)
            redirect(`/result/delete?type=success&${result.purpose}`)
        else
            redirect(`/result/delete?type=failed`)
    }
    return (
        <Card title="예약 현황">
            <ul>
                {
                    filteredData.map((data, index) => {
                        return (
                            <li key={index}>
                                <ReservationInfo reservedData={data} onDeleteReserved={onDeleteReserved} />
                                <Divider />
                            </li>
                        ) 
                    })
                }
            </ul>
            <ul>
                {
                    filteredRecurringData.map((data, index) => {
                        return (
                            <li key={index}>
                                <RecurringReservationInfo reservedData={data} onDeleteReserved={onDeleteRecurringReserved} />
                                <Divider />
                            </li>
                        ) 
                    })
                }
            </ul>
        </Card>
    )
}



function filterMyReservedData(reservedData: ReservedData[], userId: string) {
    return reservedData.filter((data) => data.userId === userId);
}  

function filterMyRecurringData(reservedData: ReccuringReservationData[], userId: string) {
    return reservedData.filter((data) => data.userId === userId);
}