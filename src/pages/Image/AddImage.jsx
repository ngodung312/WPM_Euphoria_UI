// import { UserOutlined, MailOutlined, InfoOutlined, PhoneOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, theme } from 'antd';
import { axiosInstance } from '../../context/axiosConfig';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/authContext';

export const AddImage = () => {
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
            .post(`/v1/auth/images`, values)
            .then((res) => {
                navigate("/images");
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
                    name="imageTitle"
                    label="Image Title"
                    rules={[
                        {
                            required: true,
                            message: 'Please input image title!',
                        },
                    ]}
                >
                    <Input type="text" placeholder="Image Title" size="large" />
                </Form.Item>

                <Form.Item
                    name="imageDesc"
                    label="Image Description"
                >
                    <TextArea rows={4} placeholder="Image Description" size="large" />
                </Form.Item>

                <Form.Item
                    name="imageSize"
                    label="Image Size"
                    rules={[
                        {
                            required: true,
                            message: 'Please input image Size!',
                        },
                    ]}
                >
                    <Input type="number" placeholder="Image Size" size="large" />
                </Form.Item>

                <Form.Item
                    name="imageUrl"
                    label="Image URL"
                    rules={[
                        {
                            required: true,
                            message: 'Please input image URL!',
                        },
                    ]}
                >
                    <Input type="text" placeholder="Image URL" size="large" />
                </Form.Item>

                <Form.Item
                    name="albumId"
                    label="Album ID"
                    rules={[
                        {
                            required: true,
                            message: 'Please input album id!',
                        },
                    ]}
                >
                    <Input type="number" placeholder="Album ID" size="large" />
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
