// import { UserOutlined, MailOutlined, InfoOutlined, PhoneOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, theme } from 'antd';
import { axiosInstance } from '../../context/axiosConfig';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/authContext';

export const AddMenuItem = () => {
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const { currentUser } = useContext(AuthContext);

    const navigate = useNavigate()

    const [messageApi, contextHolder] = message.useMessage();

    const onFinish = (values) => {
        values["access_token"] = currentUser.data.token;
        axiosInstance
            .post(`/v1/auth/menu-items`, values)
            .then((res) => {
                navigate("/menu-items");
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
                    name="dishId"
                    label="Dish ID"
                    rules={[
                        {
                            required: true,
                            message: 'Please input dish id!',
                        },
                    ]}
                >
                    <Input type="number" placeholder="Dish ID" size="large" />
                </Form.Item>

                <Form.Item
                    name="dishType"
                    label="Dish Type"
                    rules={[
                        {
                            required: true,
                            message: 'Please input dish type!',
                        },
                    ]}
                >
                    <Input type="text" placeholder="Dish Type" size="large" />
                </Form.Item>

                <Form.Item
                    name="menuId"
                    label="Menu ID"
                    rules={[
                        {
                            required: true,
                            message: 'Please input menu id!',
                        },
                    ]}
                >
                    <Input type="number" placeholder="Menu ID" size="large" />
                </Form.Item>

                <Form.Item
                    wrapperCol={{
                        offset: 8,
                        span: 16,
                    }}
                >
                    <Button type="primary" htmlType="submit" size="large" >
                        Create
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}
