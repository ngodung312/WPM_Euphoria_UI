// import { UserOutlined, MailOutlined, InfoOutlined, PhoneOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, theme } from 'antd';
import { axiosInstance } from '../../context/axiosConfig';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/authContext';

export const AddQRCode = () => {
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const { currentUser } = useContext(AuthContext);

    const navigate = useNavigate()

    const [messageApi, contextHolder] = message.useMessage();

    const onFinish = (values) => {
        values["access_token"] = currentUser.data.token;
        axiosInstance
            .post(`/v1/auth/qrcodes`, values)
            .then((res) => {
                navigate("/qrcodes");
            })
            .catch((err) => {
                messageApi.error(err.response.data);
            });
    };

    return (
        <div style={{
            backgroundColor: colorBgContainer,
            padding: "2vb",
        }}
        >
            <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600 }}
                onFinish={onFinish}
            >
                {contextHolder}
                <Form.Item
                    name="codeUrl"
                    label="Code URL"
                    rules={[
                        {
                            required: true,
                            message: 'Please input code URL!',
                        },
                    ]}
                >
                    <Input type="text" placeholder="Code URL" size="large" />
                </Form.Item>

                <Form.Item
                    name="eventUrl"
                    label="Event URL"
                    rules={[
                        {
                            required: true,
                            message: 'Please input event URL!',
                        },
                    ]}
                >
                    <Input type="text" placeholder="Event URL" size="large" />
                </Form.Item>

                <Form.Item
                    name="eventId"
                    label="Event ID"
                    rules={[
                        {
                            required: true,
                            message: 'Please input event id!',
                        },
                    ]}
                >
                    <Input type="number" placeholder="Event ID" size="large" />
                </Form.Item>

                <Form.Item
                    wrapperCol={{
                        offset: 8,
                        span: 16,
                    }}
                >
                    <Button type="primary" htmlType="submit" size="large">
                        Create
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}
