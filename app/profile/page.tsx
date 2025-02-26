import { Card, Descriptions, DescriptionsProps } from "antd";
import { getUser } from "../lib/session/api";

export default async function UserProfilePage() {
    const user = await getUser()
     const items: DescriptionsProps['items'] = [
            {
                key: '1',
                label: 'name',
                children: user.name,
            },
            {
                key: '2',
                label: 'department',
                children: user.department,
            },
        ]
    return (
        <Card title="사용자 정보">
            <Descriptions
                items={items}
                column={1}
            />
        </Card>
    );
}