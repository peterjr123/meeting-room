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
            span: 2,
        },
        {
            key: '2',
            label: 'Start Time',
            children: reservedData.startTime,
        },
        {
            key: '3',
            label: 'End Time',
            children: endTimeDisplayEncode(reservedData.endTime),
        },
        {
            key: '5',
            label: 'details',
            children: reservedData.details,
            span: 2,
        },
    ]
    return (
        <div className="flex flex-col max-w-screen-lg ">
            <Descriptions
                title={reservedData.purpose}
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