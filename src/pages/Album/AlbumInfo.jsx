// import { UserOutlined, MailOutlined, InfoOutlined, PhoneOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, theme } from 'antd';
import { axiosInstance } from '../../context/axiosConfig';
import { useContext, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/authContext';

export const AlbumInfo = () => {
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const { TextArea } = Input;

    const { currentUser } = useContext(AuthContext);

    const navigate = useNavigate()
    const location = useLocation()
    const form = useRef()

    const [messageApi, contextHolder] = message.useMessage();
    const [album, setAlbum] = useState([])
    const albumId = location.pathname.split('/').pop();

    useEffect(() => {
        const fetchAlbum = () => {
            axiosInstance
                .get(`/v1/auth/albums/${albumId}`, {
                    params: {
                        "access_token": currentUser.data.token,
                    },
                })
                .then((res) => {
                    setAlbum(res.data.data);
                    form.current.resetFields();
                })
                .catch((err) => {
                    messageApi.error(err.response.data.message);
                });
        }
        fetchAlbum()
    }, [albumId, messageApi, currentUser]);

    const onFinish = (values) => {
        values["access_token"] = currentUser.data.token;
        axiosInstance
            .put(`/v1/auth/albums/${albumId}`, values)
            .then((res) => {
                navigate("/albums");
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
                initialValues={album}
                onFinish={onFinish}
            >
                {contextHolder}
                <Form.Item
                    name="albumTitle"
                    label="Album Title"
                    rules={[
                        {
                            required: true,
                            message: 'Please input album title!',
                        },
                    ]}
                >
                    <Input type="text" placeholder="Album Title" size="large" />
                </Form.Item>

                <Form.Item
                    name="albumDesc"
                    label="Album Description"
                >
                    <TextArea rows={4} placeholder="Album Description" size="large" />
                </Form.Item>

                <Form.Item
                    name="albumSize"
                    label="Album Size"
                    rules={[
                        {
                            required: true,
                            message: 'Please input album Size!',
                        },
                    ]}
                >
                    <Input type="text" placeholder="Album Size" size="large" />
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
                    <Button type="primary" htmlType="submit" size="large" >
                        Update
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}
