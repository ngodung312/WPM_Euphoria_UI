// import { UserOutlined, MailOutlined, InfoOutlined, PhoneOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, theme } from 'antd';
import { axiosInstance } from '../../context/axiosConfig';
import { useContext, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/authContext';

export const MenuItemInfo = () => {
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const { currentUser } = useContext(AuthContext);

    const navigate = useNavigate()
    const location = useLocation()
    const form = useRef()

    const [messageApi, contextHolder] = message.useMessage();
    const [menuItem, setMenuInfo] = useState([])
    const menuItemId = location.pathname.split('/').pop();

    useEffect(() => {
        const fetchMenuItem = () => {
            axiosInstance
                .get(`/v1/auth/menu-items/${menuItemId}`, {
                    params: {
                        "access_token": currentUser.data.token,
                    },
                })
                .then((res) => {
                    setMenuInfo(res.data.data);
                    form.current.resetFields();
                })
                .catch((err) => {
                    messageApi.error(err.response.data.message);
                });
        }
        fetchMenuItem()
    }, [menuItemId, messageApi, currentUser]);

    const onFinish = (values) => {
        values["access_token"] = currentUser.data.token;
        axiosInstance
            .put(`/v1/auth/menu-items/${menuItemId}`, values)
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
                ref={form}
                initialValues={menuItem}
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
                    <Button type="primary" htmlType="submit" size="large">
                        Update
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}
