import React, { useEffect, useState } from 'react'
import { Button, Card, ConfigProvider, Divider, Image, Modal, Tooltip } from 'antd'
import { EditOutlined, InfoCircleOutlined } from '@ant-design/icons';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import divIcon from '../../assets/images/logo-icon.png';
import defaultImg from '../../assets/images/wedd-event.jpg';
import dayjs from 'dayjs';

const defaultMap = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.231240416692!2d106.8004791760895!3d10.870008889284462!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317527587e9ad5bf%3A0xafa66f9c8be3c91!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBDw7RuZyBuZ2jhu4cgVGjDtG5nIHRpbiAtIMSQSFFHIFRQLkhDTQ!5e0!3m2!1svi!2s!4v1687098514057!5m2!1svi!2s";

export const EventSection = ({ 
    isEditing, weddInfo, images, restaurant, handleShowImgModal,
}) => {
    const tooltipProps = isEditing ? {
        placement: 'top',
        className: 'edit-block',
        color: '#3e2c20',
    } : {
        title: '',
        onClick: false,
    };

    const [isMapModalOpen, setIsMapModalOpen] = useState(false);
    const [eventImg, setEventImg] = useState(defaultImg);

    useEffect(() => {
        const setImgSource = (imgId) => {
            const imageUrl = images.filter(item => item.id === parseInt(imgId)).map(item => item.imageUrl);
            return imageUrl.length > 0 ? imageUrl[0] : defaultImg;
        };
        setEventImg(setImgSource(weddInfo.eventImg));
    }, [weddInfo, images, setEventImg]);

    return (
        <Container fluid id='event' className='section'>
            <Row className='event-title align-items-center justify-content-center'>
                <Col md={4}>
                    <ConfigProvider theme={{
                        token: {
                            lineWidth: 3,
                            colorSplit: '#BFB3A7',
                        },
                    }}>
                        <Divider style={{ padding: '0 12vb' }}>
                            <Image src={divIcon} preview={false} width='14vb' className='div-icon' />
                        </Divider>
                    </ConfigProvider>
                    <h2 className='text-center'>When & Where</h2>
                </Col>
            </Row>

            <Row className='event-detail align-items-center justify-content-center'>
                <Col md={9} sm={10} xs={11}>
                    <Card className='card' bordered={false} bodyStyle={{ padding: 0 }} >
                        <Tooltip
                            onClick={() => handleShowImgModal('eventImg')}
                            title={<><EditOutlined /> Edit Image</>}
                            {...tooltipProps}>
                            <Card.Grid className='card-cover' hoverable={false}>
                                <Image className='image' preview={false} src={eventImg} width='100%' height='100%' />
                                <div className="frame"></div>

                            </Card.Grid>
                        </Tooltip>
                        <Card.Grid className='card-text' hoverable={false}>
                            <h3>Wedding Party</h3>
                            <p>
                                <Tooltip
                                    title={<><InfoCircleOutlined /> Wedding Date</>}
                                    {...tooltipProps}>
                                    <span>{dayjs(weddInfo.eventDate).format('dddd, D MMM, YYYY').toString()}</span>
                                </Tooltip>
                                <Tooltip
                                    title={<><InfoCircleOutlined /> Wedding Time</>}
                                    {...tooltipProps}>
                                    <span>{dayjs(weddInfo.eventStart).format('HH:mm').toString()} – {dayjs(weddInfo.eventEnd).format('HH:mm').toString()}</span>
                                </Tooltip>
                                <Tooltip
                                    title={<><InfoCircleOutlined /> Restaurant Address</>}
                                    {...tooltipProps}>
                                    <span className='address'>{restaurant.address || 'N.A'}</span>
                                </Tooltip>
                            </p>
                            <Button
                                size='large'
                                type='text'
                                className='map-btn'
                                onClick={() => { setIsMapModalOpen(true) }}
                            >
                                See Location
                            </Button>
                            <Modal
                                title='Location Map'
                                open={isMapModalOpen}
                                onCancel={() => { setIsMapModalOpen(false) }}
                                footer={false}
                                centered
                                width='60vw'
                            >
                                <iframe
                                    src={restaurant.googleMap || defaultMap}
                                    width="100%"
                                    height="450"
                                    title="Location Map Preview"
                                    loading="lazy"
                                    referrerpolicy="no-referrer-when-downgrade"
                                    allowFullScreen>
                                </iframe>
                            </Modal>
                        </Card.Grid>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}
