// import { UserOutlined, MailOutlined, InfoOutlined, PhoneOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, theme, TimePicker } from 'antd';
import { axiosInstance } from '../../context/axiosConfig';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/authContext';

export const AddEvtItem = () => {
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const { TextArea } = Input;

    const { currentUser } = useContext(AuthContext);

    const navigate = useNavigate()

    const [messageApi, contextHolder] = message.useMessage();

    const onFinish = (values) => {
        values["access_token"] = currentUser.data.token;
        axiosInstance
            .post(`/v1/auth/evt-items`, values)
            .then((res) => {
                navigate("/evt-items");
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
                    name="itemTitle"
                    label="Event Item Title"
                    rules={[
                        {
                            required: true,
                            message: 'Please input event item title!',
                        },
                    ]}
                >
                    <Input type="text" placeholder="Event Item Title" size="large" />
                </Form.Item>

                <Form.Item
                    name="itemDesc"
                    label="Event Item Description"
                >
                    <TextArea rows={4} placeholder="Event Item Description" size="large" />
                </Form.Item>

                <Form.Item
                    name="startTime"
                    label="Start Time"
                    rules={[
                        {
                            required: true,
                            message: 'Please input start time!',
                        },
                    ]}
                >
                    <TimePicker format={'HH:mm'} size="large" />
                </Form.Item>

                <Form.Item
                    name="endTime"
                    label="End Time"
                    rules={[
                        {
                            required: true,
                            message: 'Please input end time!',
                        },
                    ]}
                >
                    <TimePicker format={'HH:mm'} size="large" />
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
