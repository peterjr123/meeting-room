import { Select } from "antd";
const { Option } = Select;

export default function DaySelector({value}: {value?: string | undefined}) {
    return (
        <Select style={{ width: 120 }} value={value}>
            <Option value="Monday">Monday</Option>
            <Option value="Tuesday">Tuesday</Option>
            <Option value="Wednesday">Wednesday</Option>
            <Option value="Thursday">Thursday</Option>
            <Option value="Friday">Friday</Option>
        </Select>
    );
}