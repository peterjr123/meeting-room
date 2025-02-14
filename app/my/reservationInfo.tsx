'use client'

import { Badge, Descriptions } from 'antd';
import { Flex, Card, Divider, Button, Modal } from "antd"
import { Popconfirm } from "@/app/third-party-wrapper"
import type { DescriptionsProps } from 'antd';
import { ReservedData } from '../lib/data/type';

export default function ReservationInfo({ reservedData, onDeleteReserved }
    : { reservedData: ReservedData, onDeleteReserved: (data: ReservedData) => void }) {
    const onConfirm = () => {
        onDeleteReserved(reservedData);
    }
    const items: DescriptionsProps['items'] = [
        {
            key: '1',
            label: 'Date',
            children: reservedData.date,
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
            children: reservedData.endTime,
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