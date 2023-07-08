// import { UserOutlined, MailOutlined, InfoOutlined, PhoneOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, theme } from 'antd';
import { axiosInstance } from '../../context/axiosConfig';
import { useContext, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/authContext';

export const EvtExpenseInfo = () => {
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const { currentUser } = useContext(AuthContext);

    const navigate = useNavigate()
    const location = useLocation()
    const form = useRef()

    const [messageApi, contextHolder] = message.useMessage();
    const [evtExpense, setEvtExpense] = useState([])
    const evtExpenseId = location.pathname.split('/').pop();

    useEffect(() => {
        const fetchEvtExpense = () => {
            axiosInstance
                .get(`/v1/auth/evt-expenses/${evtExpenseId}`, {
                    params: {
                        "access_token": currentUser.data.token,
                    },
                })
                .then((res) => {
                    setEvtExpense(res.data.data);
                    form.current.resetFields();
                })
                .catch((err) => {
                    messageApi.error(err.response.data.message);
                });
        }
        fetchEvtExpense()
    }, [evtExpenseId, messageApi, currentUser]);

    const onFinish = (values) => {
        values["access_token"] = currentUser.data.token;
        axiosInstance
            .put(`/v1/auth/evt-expenses/${evtExpenseId}`, values)
            .then((res) => {
                navigate("/evt-expenses");
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
                initialValues={evtExpense}
                onFinish={onFinish}
            >
                {contextHolder}
                <Form.Item
                    name="expenseCode"
                    label="Expense Code"
                    rules={[
                        {
                            required: true,
                            message: 'Please input expense code title!',
                        },
                    ]}
                >
                    <Input type="text" placeholder="Expense Code" size="large" />
                </Form.Item>

                <Form.Item
                    name="amount"
                    label="Amount ($)"
                    rules={[
                        {
                            required: true,
                            message: 'Please input amount!',
                        },
                    ]}
                >
                    <Input type="number" placeholder="Amount" size="large" />
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
