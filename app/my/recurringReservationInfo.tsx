'use client'

import { Descriptions } from 'antd';
import { Button } from "antd"
import { Popconfirm } from "@/app/third-party-wrapper"
import type { DescriptionsProps } from 'antd';
import { ReccuringReservationData, ReservedData } from '../lib/data/type';
import { endTimeDisplayEncode } from '../lib/utils';

export default function RecurringReservationInfo({ reservedData, onDeleteReserved }
    : { reservedData: ReccuringReservationData, onDeleteReserved: (data: ReccuringReservationData) => void }) {
    const onConfirm = () => {
        onDeleteReserved(reservedData);
    }
    const items: DescriptionsProps['items'] = [
        {
            key: '1',
            label: 'Day In Week',
            children: reservedData.dayInWeek,
        },
        {
            key: '2',
            label: 'room',
            children: reservedData.room,
        },
        {
            key: '3',
            label: 'Start Time',
            children: reservedData.startTime,
        },
        {
            key: '4',
            label: 'End Time',
            children: endTimeDisplayEncode(reservedData.endTime),
        },
        {
            key: '5',
            label: 'Participants',
            children: (<div className='flex gap-4'>
                {reservedData.participants.map((participant) => {
                    return <div key={participant}>{participant}</div>
                })}
            </div>),
            span: 2,
        },
        {
            key: '6',
            label: 'details',
            children: reservedData.details,
            span: 2,
        },
    ]
    return (
        <div className="flex flex-col max-w-screen-lg ">
            <Descriptions
                title={`${reservedData.purpose} by ${reservedData.userName}`}
                bordered
                items={items}
                column={2}
            />
            <Popconfirm className="w-auto self-end mt-4"
                title="예약 취소"
                description="정말로 예약을 취소하시겠습니까?"
                onConfirm={onConfirm}
            >
                <Button type="primary">
                    cancel
                </Button>
            </Popconfirm>
        </div>
    );
}