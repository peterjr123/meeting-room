import React, { useEffect, useState } from 'react';
import type { CascaderProps } from 'antd';
import { Cascader, Form } from 'antd';
import { fetchUserList } from '../lib/data/api';
import { UserData } from '../lib/data/type';

const { Item } = Form;
const { SHOW_CHILD } = Cascader;

interface Option {
    value: string | number;
    label: string;
    children?: Option[];
}

export default function ParticipantsCascaderItem() {
    const [options, setOptions] = useState<Option[]>([]);

    async function initializeOptions() {
        const users = await fetchUserList();
        if(!users) return;

        const groupedByDepartment = users.reduce((acc: any, user) => {
            const { department } = user;
            if (!acc[department]) {
                acc[department] = [];
            }
            acc[department].push(user);
            return acc;
        }, {});

        const newOptions: Option[] = []
        for(const department in groupedByDepartment) {
            const usersInDepartment = groupedByDepartment[department];
             
            newOptions.push({
                label: department,
                value: department,
                children: usersInDepartment.map((user: UserData) => {
                    return {
                        label: user.name,
                        value: user.name
                    }
                })
            })
        }

        setOptions([...newOptions])
    }

    useEffect(() => {
        initializeOptions();
    }, []) 

    return (
        <Item label="participants" name="participants">
            <Cascader
                options={options}
                multiple
                maxTagCount="responsive"
                showCheckedStrategy={SHOW_CHILD}
            />
        </Item>

    );
};