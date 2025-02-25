'use client'

import React, { useEffect, useState } from 'react';
import { List, Card } from 'antd';
import { fetchUserList } from '../lib/data/api';

interface Datatype {
    username: string
}

export default function UserListPage() {
    const [data, setData] = useState<Datatype[]>([]);

    const loadMoreData = () => {
        fetchUserList()
            .then((body) => {
                const newData: Datatype[] = body.map((user) => {
                    return { username: user.username as string }
                })
                setData([...newData]);
            })
            .catch(() => {
            });
    };

    useEffect(() => {
        loadMoreData();
    }, []);

    return (
        <Card title="사용자 목록">
            <div id="scrollableDiv"
                style={{
                    height: 400,
                    overflow: 'auto',
                }}>
                <List
                    dataSource={data}
                    renderItem={(item) => (
                        <List.Item key={item.username}>
                            <List.Item.Meta
                                title={item.username}
                                description="placeholder for email"
                            />
                        </List.Item>
                    )}
                />
            </div>
        </Card>
    );
};