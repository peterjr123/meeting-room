import { fetchRoomData } from "@/app/lib/data/api";
import { Select } from "antd";
import { useEffect, useState } from "react";
const { Option } = Select;

export default function RoomSelector({value}: {value?: string | undefined}) {
    const [rooms, setRooms] = useState<String[] | undefined>(undefined);
    const [selected, setSelected] = useState<String | undefined>();
    const [prevValue, setPrevValue] = useState<String | undefined>();
    useEffect(() => {
        const initRooms = async() => {
            const data = await fetchRoomData();
            if(data)
                setRooms([...data.map(room => room.name)])
        }

        initRooms()
    }, [])

    if(prevValue !== value) {
        setSelected(value)
        setPrevValue(value)
    }
        

    return (
        <Select value={selected} onSelect={setSelected}>
            {rooms?.map((room, index) => {
                return <Option key={index} value={room}>{room}</Option>
            })}
        </Select>
    );
}