import { Button, Form, Input } from "antd"

const { Item } = Form;
const { Password } = Input;

type FormData = {
    username: string,
    password: string
}

export default function LoginForm({ onFinish }
    : { onFinish: (formData: FormData) => void }) {
    return (
        <Form
            name="reservation-form"
            wrapperCol={{ span: 16 }}
            labelCol={{ span: 8 }}
            style={{ maxWidth: 600 }}
            onFinish={onFinish}>
            <Item label="이름" name="username" validateTrigger="onBlur" hasFeedback rules={[{ required: true }]}>
                <Input placeholder="username..." />
            </Item>
            <Item label="password" name="password" hasFeedback rules={[{ required: true }]}>
                <Password placeholder="password..." />
            </Item>
            <Item className="float-end" label={null}>
                <Button type="primary" htmlType="submit">로그인</Button>
            </Item>
        </Form>
    );
}