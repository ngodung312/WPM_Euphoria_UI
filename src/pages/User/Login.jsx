import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Typography, Button, Form, Input, Card, message, Image } from 'antd';
import { useContext } from 'react';
import { Link } from 'react-router-dom';

import { AuthContext } from '../../context/authContext';

import '../../assets/scss/Login.scss';
import fullIcon from '../../assets/images/logo.png';

export const Login = () => {
    const { login } = useContext(AuthContext);
    const { Title } = Typography;

    const [messageApi, contextHolder] = message.useMessage();

    const onFinish = (values) => {
        try {
            login(values).then((res) => {
                if (res.status !== 200) {
                    messageApi.error(res.response.data.message);
                }
            });
        } catch (err) {
            messageApi.error("An error occurred while attempting to log in!");
        }
    };

    return (
        <div className='login'>
            <Card className='card' bordered={false}>
                <Card.Grid className='card-grid card-cover' hoverable={false}>
                    <Image src={fullIcon} width='80%' className='pb-3' preview={false}></Image>
                    {/* <Title className='title'>WEDDING PARTY ORGANIZER</Title> */}
                    <p>Creating unforgettable wedding experiences. We are a premier wedding party organizer dedicated to making your special day filled with joy, elegance, and euphoria.</p>
                    <p>Need an account?</p>
                    <Link to="/register">
                        <Button size='large'>Register</Button>
                    </Link>
                </Card.Grid>
                <Card.Grid className='card-grid card-form' hoverable={false}>
                    <Title className='title'>Login</Title>
                    <Form
                        name="normal_login"
                        className="login-form"
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
                            <Input
                                prefix={<UserOutlined className="site-form-item-icon" />}
                                placeholder="Username"
                                size="large" />
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

                        <Form.Item>
                            <Button type="primary" size="large" htmlType="submit" className="login-form-button">
                                Log in
                            </Button>
                        </Form.Item>
                    </Form>
                </Card.Grid>
            </Card>
        </div>
    )
}