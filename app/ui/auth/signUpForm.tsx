import { Button, Form, Input, Select } from "antd"

const { Item } = Form;
const { Option } = Select;
const { Password } = Input;

type FormData = {
    name: string,
    password: string,
    department: string
}

export default function SignUpForm({onFinish, departments}
    : {onFinish: (formData: FormData) => void, departments: string[]}
) {
    return (
        <Form
            name="signup-form"
            wrapperCol={{ span: 16 }}
            labelCol={{ span: 8 }}
            style={{ maxWidth: 600 }}
            onFinish={onFinish}>
            <Item label="이름" name="name" validateTrigger="onBlur" hasFeedback rules={[{ required: true }]}>
                <Input placeholder="username..." />
            </Item>
            <Item label="password" name="password" hasFeedback rules={[{ required: true }]}>
                <Password placeholder="password..." />
            </Item>
            <Item label="department" name="department" hasFeedback rules={[{ required: true }]}>
                <Select>
                    {departments.map((department) => {
                        return (<Option key={department} value={department}>{department}</Option>)
                    })}
                </Select>
            </Item>
            <Item className="float-end" label={null}>
                <Button type="primary" htmlType="submit">등록</Button>
            </Item>
        </Form>
    )
}