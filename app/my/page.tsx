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
    const filteredData = filterMyReservedData(reservedData, user.name);
    const filteredRecurringData = filterMyRecurringData(recurringResevedData, user.name);

    async function onDeleteReserved(reservedData: ReservedData) {
        'use server'
        const result = await deleteReservationData(reservedData.id);
        if (result)
            redirect(`/result/delete?type=success`)
        else
            redirect(`/result/delete?type=failed`)
    } 
    async function onDeleteRecurringReserved(reservedData: ReccuringReservationData) {
        'use server'
        const result = await deleteRecurringReservationData(reservedData.id);
        if (result)
            redirect(`/result/delete?type=success`)
        else
            redirect(`/result/delete?type=failed`)
    }
    return (
        <Card title="예약 현황" className="min-w-[35rem]">
            <ul>
                {
                    filteredData.map((data, index) => {
                        return (
                            <li key={index}>
                                <ReservationInfo reservedData={data} onDeleteReserved={onDeleteReserved} isOwned={data.userName === user.name}/>
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
                                <RecurringReservationInfo reservedData={data} onDeleteReserved={onDeleteRecurringReserved} isOwned={data.userName === user.name}/>
                                <Divider />
                            </li>
                        ) 
                    })
                }
            </ul>
        </Card>
    )
}



function filterMyReservedData(reservedData: ReservedData[], userName: string) {
    return reservedData.filter((data) => {
        return data.userName === userName || data.participants.includes(userName)
    });
}  

function filterMyRecurringData(reservedData: ReccuringReservationData[], userName: string) {
    return reservedData.filter((data) => {
        return data.userName === userName || data.participants.includes(userName)
    });
}