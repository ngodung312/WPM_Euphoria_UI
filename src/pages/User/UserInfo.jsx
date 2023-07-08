// import { UserOutlined, MailOutlined, InfoOutlined, PhoneOutlined } from '@ant-design/icons';
import { Button, Col, Form, Image, Input, Row, Select, message, theme } from 'antd';
import { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import defaultAvatar from '../../assets/images/default-avatar.png';

import { axiosInstance } from '../../context/axiosConfig';
import { AuthContext } from '../../context/authContext';

const roleChoices = [
    { key: '1', value: '1', label: "Guest" },
    { key: '2', value: '2', label: "Event Host" },
    { key: '3', value: '3', label: "Manager" },
    { key: '4', value: '4', label: "Admin" },
]

export const UserInfo = () => {
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const { currentUser } = useContext(AuthContext);
    const folderUrl = `${currentUser.data.bucketUrl}/users`;

    const location = useLocation();
    const userId = location.pathname.split('/').pop();

    const [userForm] = Form.useForm();

    const [messageApi, contextHolder] = message.useMessage();
    const [user, setUser] = useState([])

    useEffect(() => {
        const fetchUser = () => {
            axiosInstance
                .get(`/v1/auth/users/${userId}`, {
                    params: {
                        "access_token": currentUser.data.token,
                    },
                })
                .then((res) => {
                    setUser(res.data.data);
                    userForm.setFieldsValue(res.data.data);
                })
                .catch((err) => {
                    messageApi.error(err.response.data.message);
                });
        }
        fetchUser()
    }, [userId, messageApi, currentUser, userForm]);

    const onFinish = (values) => {
        values["access_token"] = currentUser.data.token;
        axiosInstance
            .put(`/v1/auth/users/${userId}`, values)
            .then((res) => {
                messageApi.success(res ? res.data.result : 'ok');
            })
            .catch((err) => {
                messageApi.error(err.response ? err.response.data : 'err');
            });
    };

    return (
        <div style={{
            backgroundColor: colorBgContainer,
            padding: "2vb",
        }}
        >
            <Form
                name="user"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                form={userForm}
                initialValues={user}
                onFinish={onFinish}
            >
                {contextHolder}
                <Row justify='space-around'>
                    <Col span={9}>
                        <Image
                            id='avatar'
                            src={user.avatar ? `${folderUrl}/${user.avatar}` : defaultAvatar}
                            width='100%'
                            height='62.5vb'
                            style={{
                                borderRadius: '50%',
                                objectFit: 'cover',
                            }}
                        />
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="username"
                            label="Username"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your Username!',
                                },
                            ]}
                        >
                            <Input placeholder="Username" size="large" />
                        </Form.Item>

                        <Form.Item
                            name="fullName"
                            label="Full Name"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your Full Name!',
                                },
                            ]}
                        >
                            <Input
                                type="text"
                                placeholder="Full Name"
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your Email!',
                                },
                            ]}
                        >
                            <Input
                                type="email"
                                placeholder="Email"
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item
                            name="phoneNumber"
                            label="Phone Number"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your Phone Number!',
                                },
                            ]}
                        >
                            <Input
                                type="number"
                                placeholder="Phone Number"
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item
                            name="userRole"
                            label="User Role"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please select user role!',
                                },
                            ]}
                        >
                            <Select
                                size='large'
                            >
                                {roleChoices.map(item => (
                                    <Select.Option key={item.key} value={item.value}>{item.label}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item className='d-flex justify-content-end'>
                            <Button type="primary" htmlType="submit" size="large">
                                Update
                            </Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </div>
    )
}
