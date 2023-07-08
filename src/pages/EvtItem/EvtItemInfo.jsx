// import { UserOutlined, MailOutlined, InfoOutlined, PhoneOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, theme } from 'antd';
import { axiosInstance } from '../../context/axiosConfig';
import { useContext, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/authContext';

export const EvtItemInfo = () => {
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const { TextArea } = Input;

    const { currentUser } = useContext(AuthContext);

    const navigate = useNavigate()
    const location = useLocation()
    const form = useRef()

    const [messageApi, contextHolder] = message.useMessage();
    const [evtItem, setEvtItem] = useState([])
    const evtItemId = location.pathname.split('/').pop();

    useEffect(() => {
        const fetchEvtItem = () => {
            axiosInstance
                .get(`/v1/auth/evt-items/${evtItemId}`, {
                    params: {
                        "access_token": currentUser.data.token,
                    },
                })
                .then((res) => {
                    setEvtItem(res.data.data);
                    form.current.resetFields();
                })
                .catch((err) => {
                    messageApi.error(err.response.data.message);
                });
        }
        fetchEvtItem()
    }, [evtItemId, messageApi, currentUser]);

    const onFinish = (values) => {
        values["access_token"] = currentUser.data.token;
        axiosInstance
            .put(`/v1/auth/evt-items/${evtItemId}`, values)
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
                ref={form}
                initialValues={evtItem}
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
                    <Input type="text" placeholder="End Time" size="large" />
                    {/* <TimePicker format={'HH:mm'} /> */}
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
                    <Input type="text" placeholder="End Time" size="large" />
                    {/* <TimePicker format={'HH:mm'} /> */}
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
                        Update
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}
