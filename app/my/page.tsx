import { Flex, Card, Divider, Button, Modal, Popconfirm } from "antd"
import { Badge, Descriptions } from 'antd';
import type { DescriptionsProps } from 'antd';
import { fetchReservationData } from "../lib/data/api";
import { ReservedData } from "../lib/data/type";

export default async function MyReservationPage() {
    const reservedData = await fetchReservationData();
    const filteredData = filterMyReservedData(reservedData);

    async function onDeleteReserved () {
        'use server'
        console.log('delete')
    }
    return (
        <Card title="예약 현황">
            <ul>
                {
                    filteredData.map((data, index) => {
                        return (
                            <li key={index}>
                                <ReservationInfo reservedData={data} onDeleteReserved={onDeleteReserved}/>
                                <Divider />
                            </li>
                        )
                    })
                }
            </ul>
        </Card>
    )
}

function ReservationInfo({ reservedData, onDeleteReserved }
    : { reservedData: ReservedData, onDeleteReserved: () => void }) {
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
            label: 'Purpose',
            children: reservedData.text,
            span: 2,
        },
    ]
    return (
        <div className="flex flex-col max-w-screen-lg ">
            <Descriptions
                title="Title"
                bordered
                items={items}
                column={2}
            />
            <Popconfirm className="w-auto self-end mt-4" 
            title="예약 취소" 
            description="정말로 예약을 취소하시겠습니까?"
            onConfirm={onDeleteReserved}
            >
                <Button  type="primary">
                    cancel
                </Button>
            </Popconfirm>

        </div>

    );
}

function filterMyReservedData(reservedData: ReservedData[]) {
    // TODO: filter datas
    return reservedData;
}