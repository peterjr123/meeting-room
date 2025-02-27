import { forbidden, notFound, redirect } from "next/navigation";
import RoomInfo from "./roomInfo";
import { createRoomData, deleteRoomData, fetchFollowingReservationData, fetchRoomData, isAuthorizedAdmin, updateRoomData } from "../lib/data/api";
import { Button, Card, Divider } from "antd";
import { RoomData } from "../lib/data/type";
import RoomCreateForm from "../form/roomCreateForm";

export default async function ConfigPage() {
    const roomData = await fetchRoomData();
    if (!roomData) notFound();
    // TODO: add authorization
    const isAdmin: boolean = await isAuthorizedAdmin();

    async function onCreateRoom(roomData: RoomData) {
        'use server'
        const result = await createRoomData(roomData);
        if (result)
            redirect(`/config`)
        else
            redirect(`/result/room?type=create`)
    }

    async function onDeleteRoom(roomData: RoomData) {
        'use server'
        const result = await deleteRoomData(roomData.id);
        if (result)
            redirect(`/config`)
        else
            redirect(`/result/room?type=delete`)
    }

    async function onModifyRoom(newRoom: RoomData, originalName: string) {
        'use server'
        const roomData = await fetchRoomData();
        if (!roomData) notFound();

        // 기존 이름이 아닌 다른 이름과 겹치는 경우
        if ((newRoom.name !== originalName) && (roomData.find((value) => (value.name === newRoom.name)) !== undefined)) {
            redirect(`/result/room?type=update&status=400`)
        }

        const result = await updateRoomData(newRoom);
        if (result)
            redirect(`/config`);
        else
            redirect(`/result/room?type=update&status=500`)
    }

    return (
        <div>
            <Card title="회의실 정보">
                <ul>
                    {
                        roomData.map((data: RoomData, index: number) => {
                            return (
                                <li key={`${data.name}:${data.position}:${data.details}`}>
                                    <RoomInfo roomData={data} onDeleteRoom={onDeleteRoom} readOnly={!isAdmin} onModifyRoom={onModifyRoom} />
                                    <Divider />
                                </li>
                            )
                        })
                    }
                </ul>
            </Card>
            {(isAdmin
                ?
                <Card style={{ marginTop: "3rem" }} title="회의실 추가">
                    <RoomCreateForm key={roomData.length} onPressSubmit={onCreateRoom} existingRooms={roomData} />
                </Card>
                :
                <></>
            )}
        </div>
    )
}