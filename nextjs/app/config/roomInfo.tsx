'use client'

import { Descriptions, Form, Input, Modal } from 'antd';
import { Button } from "antd"
import { Popconfirm } from "@/app/third-party-wrapper"
import type { DescriptionsProps } from 'antd';
import { ReservedData, RoomData } from '../lib/data/type';
import { useState } from 'react';

export default function RoomInfo({ roomData, onDeleteRoom, onModifyRoom, readOnly }
    : {
        roomData: RoomData,
        onDeleteRoom: (data: RoomData) => void,
        onModifyRoom: (data: RoomData, originalName: string) => void,
        readOnly: boolean
    }) {

    const [mode, setMode] = useState("show");
    const [modifyData, setModifyData] = useState<RoomData>(roomData);
    function onDelete() {
        onDeleteRoom(roomData);
    }
    function onModify() {
        onModifyRoom({
            id: roomData.id,
            name: modifyData.name,
            position: modifyData.position,
            details: modifyData.details,
        }, roomData.name)
    }
    function onChangeMode() {
        if (mode === "show")
            setMode("modify")
        else
            setMode("show")
    }


    const footer = ((mode === "show")
        ?
        <>
            <Button className='mr-3' onClick={onChangeMode}>
                modify
            </Button>
            <Popconfirm
                title="회의실 삭제"
                description="정말로 회의실을 삭제하시겠습니까?"
                onConfirm={onDelete}
            >
                <Button type="primary">
                    delete
                </Button>
            </Popconfirm>
        </>
        :
        <>
            <Button className='mr-3' onClick={onChangeMode}>
                cancel
            </Button>
            <Button type="primary" onClick={onModify}>
                confirm
            </Button>
        </>
    )



    const items: DescriptionsProps['items'] = [
        {
            key: 'name',
            label: '이름',
            children: (mode === "show" ? roomData.name : <Input defaultValue={roomData.name} onChange={(e) => setModifyData({ ...modifyData, name: e.target.value })} />),
        },
        {
            key: 'position',
            label: '위치',
            children: (mode === "show" ? roomData.position : <Input defaultValue={roomData.position} onChange={(e) => setModifyData({ ...modifyData, position: e.target.value })} />),
        },
        {
            key: 'details',
            label: '비고',
            children: (mode === "show" ? roomData.details : <Input defaultValue={roomData.details} onChange={(e) => setModifyData({ ...modifyData, details: e.target.value })} />),
            span: 2,
        },
    ]
    return (
        <div className="flex flex-col max-w-screen-lg ">
            <Descriptions
                bordered
                items={items}
                column={2}
            />
            {(readOnly
                ?
                <></>
                :
                <div className="w-auto self-end mt-4">
                    {footer}
                </div>
            )}

        </div>
    );
}