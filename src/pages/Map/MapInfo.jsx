// import { UserOutlined, MailOutlined, InfoOutlined, PhoneOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, theme } from 'antd';
import { axiosInstance } from '../../context/axiosConfig';
import { useContext, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/authContext';

export const MapInfo = () => {
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const { TextArea } = Input;

    const { currentUser } = useContext(AuthContext);

    const navigate = useNavigate()
    const location = useLocation()
    const form = useRef()

    const [messageApi, contextHolder] = message.useMessage();
    const [map, setMap] = useState([])
    const mapId = location.pathname.split('/').pop();

    useEffect(() => {
        const fetchMap = () => {
            axiosInstance
                .get(`/v1/auth/maps/${mapId}`, {
                    params: {
                        "access_token": currentUser.data.token,
                    },
                })
                .then((res) => {
                    setMap(res.data.data);
                    form.current.resetFields();
                })
                .catch((err) => {
                    messageApi.error(err.response.data.message);
                });
        }
        fetchMap()
    }, [mapId, messageApi, currentUser]);

    const onFinish = (values) => {
        values["access_token"] = currentUser.data.token;
        axiosInstance
            .put(`/v1/auth/maps/${mapId}`, values)
            .then((res) => {
                navigate("/maps");
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
                initialValues={map}
                onFinish={onFinish}
            >
                {contextHolder}
                <Form.Item
                    name="mapTitle"
                    label="Map Title"
                    rules={[
                        {
                            required: true,
                            message: 'Please input map title!',
                        },
                    ]}
                >
                    <Input type="text" placeholder="Map Title" size="large" />
                </Form.Item>

                <Form.Item
                    name="mapDesc"
                    label="Map Description"
                >
                    <TextArea rows={4} placeholder="Map Description" size="large" />
                </Form.Item>

                <Form.Item
                    name="mapUrl"
                    label="Map URL"
                    rules={[
                        {
                            required: true,
                            message: 'Please input map URL!',
                        },
                    ]}
                >
                    <Input type="text" placeholder="Map URL" size="large" />
                </Form.Item>

                <Form.Item
                    name="hallId"
                    label="Hall ID"
                    rules={[
                        {
                            required: true,
                            message: 'Please input hall id!',
                        },
                    ]}
                >
                    <Input type="number" placeholder="Hall ID" size="large" />
                </Form.Item>

                <Form.Item
                    wrapperCol={{
                        offset: 8,
                        span: 16,
                    }}
                >
                    <Button type="primary" htmlType="submit" size="large" className="update-map-form-button">
                        Update
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}
