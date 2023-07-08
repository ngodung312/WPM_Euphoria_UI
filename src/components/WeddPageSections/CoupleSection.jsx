import React, { useEffect, useState } from 'react'
import { Button, Form, Image, Input, Modal, Space, Tooltip } from 'antd';
import { FacebookFilled, TwitterOutlined, InstagramFilled, YoutubeFilled, EditOutlined } from '@ant-design/icons';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import brideDefImg from '../../assets/images/wedd-bride.jpg';
import groomDefImg from '../../assets/images/wedd-groom.jpg';
import brideFrameImg from '../../assets/images/couple-bride-frame.png';
import groomFrameImg from '../../assets/images/couple-groom-frame.png';
import TextArea from 'antd/es/input/TextArea';

const sampleText = {
    brideName: 'Jenny Wilson',
    brideDesc: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Suscipit ratione corrupti non qui, laborum fugiat sunt architecto veritatis eius! Fugit voluptate ullam quas dolores quod dolor cumque sit tenetur ea totam perspiciatis ipsam quis officia, modi nam ducimus rerum sint?',
    groomName: 'Leslie Alexander',
    groomDesc: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Suscipit ratione corrupti non qui, laborum fugiat sunt architecto veritatis eius! Fugit voluptate ullam quas dolores quod dolor cumque sit tenetur ea totam perspiciatis ipsam quis officia, modi nam ducimus rerum sint?',
    defaultSocial: window.location.pathname.split('/editing')[0],
}

export const CoupleSection = ({
    isEditing, weddInfo, images, submitForm, submitLoading, handleShowImgModal
}) => {
    const tooltipProps = isEditing ? {
        placement: 'top',
        className: 'edit-block',
        color: '#3e2c20',
    } : {
        title: '',
        onClick: false,
    };

    const [editForm] = Form.useForm();
    editForm.setFieldsValue(weddInfo);

    const [isGroom, setIsGroom] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [brideImg, setBrideImg] = useState('');
    const [groomImg, setGroomImg] = useState('');

    useEffect(() => {
        const setImgSource = (imgId, defaultImg) => {
            const imageUrl = images.filter(item => item.id === parseInt(imgId)).map(item => item.imageUrl);
            return imageUrl.length > 0 ? imageUrl[0] : defaultImg;
        };

        setBrideImg(setImgSource(weddInfo.brideImg, brideDefImg));
        setGroomImg(setImgSource(weddInfo.groomImg, groomDefImg));
    }, [weddInfo, images, setBrideImg, setGroomImg]);

    const showEditModal = (type) => {
        setIsModalOpen(true);
        setIsGroom(type === 'groom');
    }

    const handleModalCancel = () => {
        setIsModalOpen(false);
    };

    const handleEdit = (newData) => {
        submitForm(newData);
        setIsModalOpen(false);
    }

    const EditForm = ({ form, onFinish }) => {
        return (
            <Form
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                form={form}
                onFinish={onFinish}
            >
                <Row>
                    <Col md={6}>
                        {/* BRIDE INFORMATION */}
                        <Form.Item
                            name='brideName'
                            label='Full Name'
                            hidden={isGroom}
                            rules={[
                                {
                                    required: true,
                                    message: `Please input bride name!`,
                                },
                            ]}
                        >
                            <Input type="text" placeholder='Bride Name' size="large" />
                        </Form.Item>

                        <Form.Item
                            name='brideDesc'
                            label='Brief Introduction'
                            hidden={isGroom}
                            rules={[
                                {
                                    required: true,
                                    message: `Please input bride introduction!`,
                                },
                            ]}
                        >
                            <TextArea rows={6} placeholder='Some details about the bride' size="large" />
                        </Form.Item>

                        {/* GROOM INFORMATION */}
                        <Form.Item
                            name='groomName'
                            label='Full Name'
                            hidden={!isGroom}
                            rules={[
                                {
                                    required: true,
                                    message: `Please input groom name!`,
                                },
                            ]}
                        >
                            <Input type="text" placeholder='Groom Name' size="large" />
                        </Form.Item>

                        <Form.Item
                            name='groomDesc'
                            label='Brief Introduction'
                            hidden={!isGroom}
                            rules={[
                                {
                                    required: true,
                                    message: `Please input brief introduction!`,
                                },
                            ]}
                        >
                            <TextArea rows={6} placeholder='Some details about the groom' size="large" />
                        </Form.Item>
                    </Col>

                    <Col md={6}>
                        {/* BRIDE SOCIAL ACCOUNTS */}
                        <Form.Item
                            name='brideFacebook'
                            label='Facebook'
                            hidden={isGroom}
                        >
                            <Input type="text" placeholder='Facebook account link' size="large" />
                        </Form.Item>

                        <Form.Item
                            name='brideTwitter'
                            label='Twitter'
                            hidden={isGroom}
                        >
                            <Input type="text" placeholder='Twitter account link' size="large" />
                        </Form.Item>

                        <Form.Item
                            name='brideInstagram'
                            label='Instagram'
                            hidden={isGroom}
                        >
                            <Input type="text" placeholder='Instagram account link' size="large" />
                        </Form.Item>

                        <Form.Item
                            name='brideYoutube'
                            label='Youtube'
                            hidden={isGroom}
                        >
                            <Input type="text" placeholder='Youtube account link' size="large" />
                        </Form.Item>

                        {/* GROOM SOCIAL ACCOUNTS */}
                        <Form.Item
                            name='groomFacebook'
                            label='Facebook'
                            hidden={!isGroom}
                        >
                            <Input type="text" placeholder='Facebook account link' size="large" />
                        </Form.Item>

                        <Form.Item
                            name='groomTwitter'
                            label='Twitter'
                            hidden={!isGroom}
                        >
                            <Input type="text" placeholder='Twitter account link' size="large" />
                        </Form.Item>

                        <Form.Item
                            name='groomInstagram'
                            label='Instagram'
                            hidden={!isGroom}
                        >
                            <Input type="text" placeholder='Instagram account link' size="large" />
                        </Form.Item>

                        <Form.Item
                            name='groomYoutube'
                            label='Youtube'
                            hidden={!isGroom}
                        >
                            <Input type="text" placeholder='Youtube account link' size="large" />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        )
    };

    return (
        <Container fluid id='couple' className='section'>
            <Row className='align-items-center justify-content-center'>
                <Col lg={11} className='couple-area'>
                    <Row className='couple-item justify-content-start pb-5'>
                        <Tooltip onClick={() => handleShowImgModal(`brideImg`)}
                            title={<><EditOutlined /> Edit Bride Avatar</>}
                            {...tooltipProps}
                        >
                            <Col xl={4} md={5} sm={11} xs={11} className='couple-img'>
                                <Image className='image' preview={false} src={brideImg} width='46vb' height='46vb' />
                                <img className='frame bride' alt="bride-frame" src={brideFrameImg} />
                            </Col>
                        </Tooltip>

                        <Tooltip onClick={() => showEditModal('bride')}
                            title={<><EditOutlined /> Edit Bride Information</>}
                            {...tooltipProps}
                        >
                            <Col xl={7} md={6} sm={11} xs={11} className='couple-text text-start'>
                                <h2>{weddInfo.brideName || sampleText.brideName}</h2>
                                <p>{weddInfo.brideDesc || sampleText.brideDesc}</p>
                                <div className='social'>
                                    <Space size='middle'>
                                        <Button onClick={() => window.open(weddInfo.brideFacebook || sampleText.defaultSocial, '_blank')}
                                            size='large' shape='circle' icon={<FacebookFilled />} />
                                        <Button onClick={() => window.open(weddInfo.brideTwitter || sampleText.defaultSocial, '_blank')}
                                            size='large' shape='circle' icon={<TwitterOutlined />} />
                                        <Button onClick={() => window.open(weddInfo.brideInstagram || sampleText.defaultSocial, '_blank')}
                                            size='large' shape='circle' icon={<InstagramFilled />} />
                                        <Button onClick={() => window.open(weddInfo.brideYoutube || sampleText.defaultSocial, '_blank')}
                                            size='large' shape='circle' icon={<YoutubeFilled />} />
                                    </Space>
                                </div>
                            </Col>
                        </Tooltip>
                    </Row>

                    <Row className='couple-item justify-content-end mt-5 pt-2'>
                        <Tooltip onClick={() => showEditModal('groom')}
                            title={<><EditOutlined /> Edit Groom Information</>}
                            {...tooltipProps}
                        >
                            <Col
                                xl={{ span: 7, order: 'first' }}
                                md={{ span: 6, order: 'first' }}
                                sm={{ span: 11, order: 'last' }}
                                xs={{ span: 11, order: 'last' }}
                                className='couple-text text-end'
                            >
                                <h2>{weddInfo.groomName || sampleText.groomName}</h2>
                                <p>{weddInfo.groomDesc || sampleText.groomDesc}</p>
                                <div className='social'>
                                    <Space size='middle'>
                                        <Button onClick={() => window.open(weddInfo.groomFacebook || sampleText.defaultSocial, '_blank')}
                                            size='large' shape='circle' icon={<FacebookFilled />} />
                                        <Button onClick={() => window.open(weddInfo.groomTwitter || sampleText.defaultSocial, '_blank')}
                                            size='large' shape='circle' icon={<TwitterOutlined />} />
                                        <Button onClick={() => window.open(weddInfo.groomInstagram || sampleText.defaultSocial, '_blank')}
                                            size='large' shape='circle' icon={<InstagramFilled />} />
                                        <Button onClick={() => window.open(weddInfo.groomYoutube || sampleText.defaultSocial, '_blank')}
                                            size='large' shape='circle' icon={<YoutubeFilled />} />
                                    </Space>
                                </div>
                            </Col>
                        </Tooltip>

                        <Tooltip onClick={() => handleShowImgModal(`groomImg`)}
                            title={<><EditOutlined /> Edit Groom Avatar</>}
                            {...tooltipProps}
                        >
                            <Col xl={4} md={5} sm={11} xs={11} className='couple-img'>
                                <Image className='image' preview={false} src={groomImg} width='46vb' height='46vb' />
                                <img className='frame groom' alt="groom-frame" src={groomFrameImg} />
                            </Col>
                        </Tooltip>
                    </Row>
                </Col>
            </Row>

            <Modal
                title={isGroom ? 'Groom Information' : 'Bride Information'}
                centered
                open={isModalOpen}
                width='60vw'
                onCancel={handleModalCancel}
                footer={[
                    <Button key="back" onClick={handleModalCancel}>
                        Return
                    </Button>,

                    <Button key="submit" type="primary" loading={submitLoading} onClick={() => editForm.submit()}>
                        Update
                    </Button>
                ]}
            >
                <EditForm form={editForm} onFinish={handleEdit} />
            </Modal>
        </Container>
    )
}
