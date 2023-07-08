import { LockOutlined, UserOutlined, MailOutlined, InfoOutlined, PhoneOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Card, Typography, Image } from 'antd';
import { useContext } from 'react';
import { Link } from 'react-router-dom'

import { AuthContext } from '../../context/authContext';

import '../../assets/scss/Login.scss';
import fullIcon from '../../assets/images/logo.png';

export const Register = () => {
    const { register } = useContext(AuthContext);
    const { Title } = Typography;

    const [messageApi, contextHolder] = message.useMessage();

    const onFinish = (values) => {
        try {
            register(values).then((res) => {
                if (res.status !== 200) {
                    messageApi.error(res.response.data.message);
                }
            });
        } catch (err) {
            messageApi.error("An error occurred while attempting to register!");
        }
    };

    return (
        <div className='register'>
            <Card className='card' bordered={false}>
                <Card.Grid className='card-grid card-form' hoverable={false}>
                    <Title className='title'>Register</Title>
                    <Form
                        name="normal_login"
                        className="register-form"
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={onFinish}
                    >
                        {contextHolder}
                        <Form.Item
                            name="username"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your Username!',
                                },
                            ]}
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" size="large" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your Password!',
                                },
                            ]}
                        >
                            <Input
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                type="password"
                                placeholder="Password"
                                size="large"
                            />
                        </Form.Item>
                        <Form.Item
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your Email!',
                                },
                            ]}
                        >
                            <Input
                                prefix={<MailOutlined className="site-form-item-icon" />}
                                type="email"
                                placeholder="Email"
                                size="large"
                            />
                        </Form.Item>
                        <Form.Item
                            name="fullName"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your Full Name!',
                                },
                            ]}
                        >
                            <Input
                                prefix={<InfoOutlined className="site-form-item-icon" />}
                                type="text"
                                placeholder="Full Name"
                                size="large"
                            />
                        </Form.Item>
                        <Form.Item
                            name="phoneNumber"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your Phone Number!',
                                },
                            ]}
                        >
                            <Input
                                prefix={<PhoneOutlined className="site-form-item-icon" />}
                                type="number"
                                placeholder="Phone Number"
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" size="large" htmlType="submit" className="register-form-button">
                                Register
                            </Button>
                        </Form.Item>
                    </Form>
                </Card.Grid>
                <Card.Grid className='card-grid card-cover' hoverable={false}>
                    <Image src={fullIcon} width='80%' className='pb-3' preview={false}></Image>
                    {/* <Title className='title'>WEDDING PARTY ORGANIZER</Title> */}
                    <p>Creating unforgettable wedding experiences. We are a premier wedding party organizer dedicated to making your special day filled with joy, elegance, and euphoria.</p>
                    <p>Already a user?</p>
                    <Link to="/login">
                        <Button size='large'>Login</Button>
                    </Link>
                </Card.Grid>

            </Card>
        </div>
    )
}
