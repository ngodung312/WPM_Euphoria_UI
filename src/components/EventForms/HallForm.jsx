import { Button, Card, Col, ConfigProvider, Form, Image, Input, List, Menu, Row, Select, Space } from 'antd'
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context/authContext';

export const HallForm = ({ userRole, isViewMode, hallForm, halls, maps, contextHolder, isHidden, onFinish }) => {
    const { Option } = Select;

    const { currentUser } = useContext(AuthContext);
    const folderUrl = `${currentUser.data.bucketUrl}`;
    const defaultImg = "data:image/png;base64,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";

    const [hallMaps, setHallMaps] = useState([]);
    const [currHall, setCurrHall] = useState([]);
    const [currMap, setCurrMap] = useState([]);
    const [hallImg, setHallImg] = useState(defaultImg);
    const [mapImg, setMapImg] = useState(defaultImg);
    const [currMenuImg, setCurrMenuImg] = useState('hall');

    useEffect(() => {
        const hallId = hallForm.getFieldValue('hallId');
        const hallData = halls.filter(item => item.id === hallId)[0] || {};
        setHallMaps(maps.filter(item => item.hallId === hallId));
        setCurrHall([
            {
                key: 'Maximum No. Tables',
                value: hallData.numTables || 0
            },
            {
                key: 'Description',
                value: hallData.hallDesc || 'N.A'
            },
        ]);
        setHallImg(hallData.hallUrl ? `${folderUrl}/halls/${hallData.hallUrl}` : defaultImg);

        const mapId = hallForm.getFieldValue('mapId');
        const mapData = maps.filter(item => item.id === mapId)[0] || {};
        setCurrMap([
            {
                key: 'Description',
                value: mapData.mapDesc || 'N.A'
            },
        ]);
        setMapImg(mapData.mapUrl ? `${folderUrl}/maps/${mapData.mapUrl}` : defaultImg);
    }, [maps, halls, hallForm, folderUrl]);

    const handleHallChange = (hallId) => {
        const data = halls.filter(item => item.id === hallId)[0];
        setCurrHall([
            {
                key: 'Maximum No. Tables',
                value: data.numTables
            },
            {
                key: 'Description',
                value: data.hallDesc || 'N.A'
            },
        ]);
        setHallImg(data.hallUrl ? `${folderUrl}/halls/${data.hallUrl}` : defaultImg);

        const newHallMaps = maps.filter(item => item.hallId === hallId);
        setHallMaps(newHallMaps);
        const newMapId = newHallMaps.length > 0 ? newHallMaps[0].id : null;
        hallForm.setFieldValue("mapId", newMapId);
        handleMapChange(newMapId);
    }

    const handleMapChange = (mapId) => {
        const data = maps.filter(item => item.id === mapId)[0] || {};
        setCurrMap([
            {
                key: 'Description',
                value: data.mapDesc || 'N.A'
            },
        ]);
        setMapImg(data.mapUrl ? `${folderUrl}/maps/${data.mapUrl}` : defaultImg);
    }

    const InfoCard = ({ data }) => {
        return (
            <Card bodyStyle={{ padding: '2vb 3vb' }}>
                <List
                    size="small"
                    dataSource={data}
                    renderItem={(item) => item.key === "Description" & item.value !== 'N.A' ?
                        (
                            <List.Item
                                style={{ padding: '1vb 0' }}
                            >
                                <Space direction="vertical">
                                    <span style={{ fontWeight: '500' }}>{item.key}:</span>
                                    <span>{item.value}</span>
                                </Space>
                            </List.Item>
                        ) : (
                            <List.Item
                                style={{ padding: '1vb 0' }}
                            >
                                <Col span={10} style={{ fontWeight: '500' }}>{item.key}:</Col>
                                {/* <Divider type="vertical" style={{ content: ':' }} /> */}
                                <Col span={13}>{item.value}</Col>
                            </List.Item>
                        )
                    }
                />
            </Card>
        )
    }
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
                    name="hall"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    form={hallForm}
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

                    <Row justify="space-around">
                        <Col span={8}>
                            <Form.Item
                                name="hallId"
                                label="Wedding Hall"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please select hall!',
                                    },
                                ]}
                            >
                                <Select size='large' onChange={handleHallChange} disabled={userRole < 3 || isViewMode} >
                                    {halls.map(item => (
                                        <Option key={item.id} value={item.value} label={item.label}>
                                            <Row>
                                                <Col span={16}>{item.hallTitle}</Col>
                                                <Col span={6} style={{ color: 'grey' }}>No. Tables: {item.numTables}</Col>
                                            </Row>
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <InfoCard data={currHall} />

                            <Form.Item
                                name="mapId"
                                label="Table Layout"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please select table layout!',
                                    },
                                ]}
                                style={{ marginTop: '3vb' }}
                            >
                                <Select options={hallMaps} size='large' onChange={handleMapChange} disabled={isViewMode} />
                            </Form.Item>

                            <InfoCard data={currMap} />
                        </Col>
                        <Col span={14}>
                            <Menu
                                className='mb-3'
                                onClick={(e) => { setCurrMenuImg(e.key) }}
                                selectedKeys={[currMenuImg]}
                                mode="horizontal"
                                items={[
                                    {
                                        label: 'Hall Image',
                                        key: 'hall',
                                    },
                                    {
                                        label: 'Table Layout',
                                        key: 'map',
                                    },
                                ]} />
                            <Image
                                src={currMenuImg === 'hall' ? hallImg : mapImg}
                                width='100%' />
                        </Col>
                    </Row>
                </Form>
            </ConfigProvider>
        </div>
    )
}
