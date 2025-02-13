import { Flex, Card, Divider, Button, Modal, Popconfirm } from "antd"

import { deleteReservationData, fetchReservationData, getCurrentUserInfo } from "../lib/data/api";
import { ReservedData } from "../lib/data/type";
import { redirect } from "next/navigation";
import { ReservationInfo } from "./reservationInfo";

export default async function MyReservationPage() {
    const reservedData = await fetchReservationData();
    const user = await getCurrentUserInfo();
    if (!user) redirect("/");
    const filteredData = filterMyReservedData(reservedData, user.userId);

    async function onDeleteReserved(reservedData: ReservedData) {
        'use server'
        const result = await deleteReservationData(reservedData.id);
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
        </Card>
    )
}



function filterMyReservedData(reservedData: ReservedData[], userId: string) {
    return reservedData.filter((data) => data.userId === userId)
    // TODO: filter datas
}