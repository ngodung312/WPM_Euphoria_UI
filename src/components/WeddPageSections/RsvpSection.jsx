import React, { useState } from 'react'
import { Button, ConfigProvider, Divider, Form, Image, Input, Select, Space, message } from 'antd'
import { UserOutlined, MailOutlined, SmileOutlined, FrownOutlined } from '@ant-design/icons';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import divIcon from '../../assets/images/logo-icon.png';
import { axiosInstance } from '../../context/axiosConfig';

export const RsvpSection = ({ 
    isEditing, eventId, weddInfo, setWeddInfo 
}) => {
    const [rsvpForm] = Form.useForm();

    const [messageApi, contextHolder] = message.useMessage();

    const [submitLoading, setSubmitLoading] = useState(false);
    const [isAttended, setIsAttended] = useState(false);

    const handleRsvpForm = (newData) => {
        if (isEditing) {
            messageApi.info('RSVP can only be submitted in Guest View!');
            return;
        }
        setSubmitLoading(true);
        if (isAttended) {
            newData.numGuests = newData.numGuests ? parseInt(newData.numGuests) : 1;
        } else {
            newData.numGuests = 0;
        }
        newData.eventId = eventId;
        // console.log(newData);

        axiosInstance.post("/rsvp-guests", newData)
            .then((res) => {
                messageApi.success(res ? res.data.result : 'ok');
                rsvpForm.resetFields();
                setSubmitLoading(false);
            }).catch((err) => {
                messageApi.error(err.response ? err.response.data.message : 'err');
                setSubmitLoading(false);
            });
    }

    return (
        <Container fluid id='rsvp' className='section'>
            <Row className='align-items-center justify-content-center'>
                <Col md={7} className='rsvp-form'>
                    <Form
                        form={rsvpForm}
                        onFinish={handleRsvpForm}
                    >
                        {contextHolder}
                        <Row className='rsvp-title align-items-center justify-content-center'>
                            <Col md={7} sm={10} xs={10}>
                                <ConfigProvider theme={{
                                    token: {
                                        lineWidth: 3,
                                        colorSplit: '#BFB3A7',
                                    },
                                }}>
                                    <Divider style={{ padding: '0 8vb' }} className='divider'>
                                        <Image src={divIcon} preview={false} width='14vb' className='div-icon' />
                                    </Divider>
                                </ConfigProvider>
                                <h2 className='text-center'>Are you attending?</h2>
                            </Col>
                        </Row>

                        <Row className='rsvp-content align-items-center justify-content-center'>
                            <Col md={6} sm={9} xs={9}>
                                <Form.Item
                                    name="guestName"
                                    className='rsvp-item'
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your name!',
                                        },
                                    ]}
                                >
                                    <Input
                                        size='large'
                                        prefix={<UserOutlined className="site-form-item-icon px-1" />}
                                        placeholder="Your Name"
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="guestEmail"
                                    className='rsvp-item'
                                    rules={[
                                        {
                                            type: 'email',
                                            required: true,
                                            message: 'Please input your email!',
                                        },
                                    ]}
                                >
                                    <Input
                                        size='large'
                                        prefix={<MailOutlined className="site-form-item-icon px-1" />}
                                        placeholder="Your Email"
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="numGuests"
                                    className='rsvp-item'
                                >
                                    <Select
                                        size='large'
                                        prefix={<UserOutlined className="site-form-item-icon px-1" />}
                                        placeholder="Number Of Guests"
                                    >
                                        <Select.Option value="default">Number Of Guests</Select.Option>
                                        <Select.Option value="1">1</Select.Option>
                                        <Select.Option value="2">2</Select.Option>
                                        <Select.Option value="3">3</Select.Option>
                                        <Select.Option value="4">4</Select.Option>
                                        <Select.Option value="5">5</Select.Option>
                                    </Select>
                                </Form.Item>

                                <Space className='rsvp-item rsvp-btn' style={{ textAlign: 'center' }}>
                                    <Button
                                        size='large'
                                        type="primary"
                                        className='attend-btn yes-btn'
                                        loading={submitLoading}
                                        onClick={() => {
                                            setIsAttended(true);
                                            rsvpForm.submit();
                                        }}
                                    >
                                        <SmileOutlined /> Yes, I will be there
                                    </Button>
                                    <Button
                                        size='large'
                                        className='attend-btn no-btn'
                                        loading={submitLoading}
                                        onClick={() => {
                                            setIsAttended(false);
                                            rsvpForm.submit();
                                        }}
                                    >
                                        <FrownOutlined /> Sorry, I can’t come
                                    </Button>
                                </Space>
                            </Col>
                        </Row>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}
