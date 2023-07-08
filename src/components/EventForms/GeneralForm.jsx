import { Button, Card, Col, ConfigProvider, DatePicker, Form, Image, Input, List, Row, Select } from 'antd';
import React from 'react'

import defaultAvatar from '../../assets/images/default-avatar.png';

export const GeneralForm = ({
    userRole, isViewMode, generalForm, event, userOptions, hostInfo, onHostChange,
    managerInfo, onManagerChange, contextHolder, isHidden, onFinish
}) => {
    const { Option } = Select;

    const hostAvatar = hostInfo.filter(item => item.key === 'Avatar').map(item => item.value);
    const managerAvatar = managerInfo.filter(item => item.key === 'Avatar').map(item => item.value);

    return (
        <div>
            <ConfigProvider
                theme={{
                    token: {
                        colorText: '#373425',
                        colorTextHeading: '#373425',
                        colorTextDisabled: '#373425',
                    },
                }}
            >
                <Form
                    name="general"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    form={generalForm}
                    initialValues={event}
                    onFinish={onFinish}
                    hidden={isHidden}
                >
                    {contextHolder}
                    <Form.Item name="formName" hidden>
                        <Input type="text" />
                    </Form.Item>

                    <Row justify='space-around' hidden={isViewMode}>
                        <Col span={23}>
                            <Form.Item style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Button type="primary" htmlType="submit" size="large">Update</Button>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row justify='space-around'>
                        <Col span={23}>
                            <Form.Item
                                name="eventTitle"
                                label="Event Title"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input event title!',
                                    },
                                ]}
                            >
                                <Input type="text" placeholder="Event Title" size="large" disabled={isViewMode} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row justify='space-around'>
                        <Col span={11}>
                            <Form.Item
                                name="eventDate"
                                label="Event Date"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input event date!',
                                    },
                                ]}
                            >
                                <DatePicker size="large" placeholder="Event Date" style={{ width: '100%' }} disabled={userRole < 3 || isViewMode} />
                            </Form.Item>
                        </Col>

                        <Col span={11}>
                            <Form.Item
                                name="numTables"
                                label="Number of Tables"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input number of tables!',
                                    },
                                ]}
                            >
                                <Input type="number" placeholder="Number of Tables" size="large" disabled={userRole < 3 || isViewMode} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row justify='space-around'>
                        <Col span={11}>
                            <Form.Item
                                name="numEstGuests"
                                label="Number of Estimated Guests"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input number of estimated guests!',
                                    },
                                ]}
                            >
                                <Input type="number" placeholder="Number of Estimated Guests" size="large" disabled={userRole < 3 || isViewMode} />
                            </Form.Item>
                        </Col>

                        <Col span={11}>
                            <Form.Item
                                name="numActGuests"
                                label="Number of Actual Guests"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input number of actual guests!',
                                    },
                                ]}
                            >
                                <Input type="number" placeholder="Number of Actual Guests" size="large" disabled={userRole < 3 || isViewMode} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row justify='space-around'>
                        <Col span={11}>
                            <Form.Item
                                name="hostId"
                                label="Host"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input host!',
                                    },
                                ]}
                            >
                                <Select
                                    size='large'
                                    disabled={userRole < 3 || isViewMode}
                                    onChange={onHostChange}
                                >
                                    {userOptions.filter(user => user.role === '2').map(item => (
                                        <Option key={item.key} value={item.value}>{item.label}</Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Card>
                                <Row justify='space-between'>
                                    <Col span={6}>
                                        <Image src={hostAvatar.length > 0 ? hostAvatar[0] : defaultAvatar}
                                            width='16vb' height='16vb' style={{ objectFit: 'cover' }} />
                                    </Col>
                                    <Col span={17}>
                                        <List
                                            size="small"
                                            dataSource={hostInfo}
                                            renderItem={(item) => item.key !== 'Avatar' ? (
                                                <List.Item>
                                                    <Col span={10} style={{ textTransform: 'capitalize' }}>{item.key}</Col>
                                                    <Col span={14}>{item.value}</Col>
                                                </List.Item>
                                            ) : null}
                                        />
                                    </Col>
                                </Row>
                            </Card>
                        </Col>

                        <Col span={11}>
                            <Form.Item
                                name="managerId"
                                label="Manager"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input manager id!',
                                    },
                                ]}
                            >
                                <Select
                                    size='large'
                                    disabled={userRole < 3 || isViewMode}
                                    onChange={onManagerChange}
                                >
                                    {userOptions.filter(user => user.role === '3').map(item => (
                                        <Option key={item.key} value={item.value}>{item.label}</Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Card>
                                <Row justify='space-between'>
                                    <Col span={6}>
                                        <Image src={managerAvatar.length > 0 ? managerAvatar[0] : defaultAvatar}
                                            width='16vb' height='16vb' style={{ objectFit: 'cover' }} />
                                    </Col>
                                    <Col span={17}>
                                        <List
                                            size="small"
                                            dataSource={managerInfo}
                                            renderItem={(item) => item.key !== 'Avatar' ? (
                                                <List.Item>
                                                    <Col span={10} style={{ textTransform: 'capitalize' }}>{item.key}</Col>
                                                    <Col span={14}>{item.value}</Col>
                                                </List.Item>
                                            ) : null}
                                        />
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    </Row>

                    {/* <Form.Item
                    name="mapId"
                    label="Map ID"
                    rules={[
                        {
                            required: true,
                            message: 'Please input map id!',
                        },
                    ]}
                >
                    <Input type="number" placeholder="Map ID" size="large" />
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
                </Form.Item> */}
                </Form>
            </ConfigProvider>
        </div>
    )
}
