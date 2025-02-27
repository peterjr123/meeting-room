import { redirect } from "next/dist/server/api-utils";
import { deleteDepartmentData } from "../lib/data/api";
import { DepartmentData } from "../lib/data/type";
import { Button, List } from 'antd'

const { Item } = List;
const { Meta } = Item;

export default function DepartmentList({ departments, onDelete }: { departments: DepartmentData[] | undefined, onDelete: (id: number) => void }) {

    return (
        <List dataSource={departments} renderItem={(department) => {
            return <Item extra={
                (department.name === "ADMIN" ? null : <div className="flex gap-3">
                    <Button>update</Button>
                    <Button type="primary" onClick={() => onDelete(department.id)}>delete</Button>
                </div>)
            }>
                <Meta title={department.name} description="placeholder for description" />
            </Item>
        }
        } />
    );
}