import React, { useEffect, useState } from 'react'
import { Button, Carousel, Form, Image, Input, Modal, Tooltip } from 'antd';
import { EditOutlined, InfoCircleOutlined } from '@ant-design/icons';
import Countdown from "react-countdown";
import dayjs from 'dayjs';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import defaultImg1 from '../../assets/images/carousel-1.jpg';
import defaultImg2 from '../../assets/images/carousel-2.jpg';
import defaultImg3 from '../../assets/images/carousel-3.jpg';
import defaultImg4 from '../../assets/images/carousel-4.jpg';

export const HomeSection = ({
    isEditing, weddInfo, images, submitForm, submitLoading, handleShowImgModal,
}) => {
    const tooltipProps = isEditing ? {
        placement: 'top',
        className: 'edit-block',
        color: '#3e2c20',
    } : {
        title: '',
        onClick: false,
    };

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currCarousel, setCurrCarousel] = useState(0);
    const [carouselImgs, setCarouselImgs] = useState([]);

    useEffect(() => {
        const setImgSource = (imgId, defaultImg) => {
            const imageUrl = images.filter(item => item.id === parseInt(imgId)).map(item => item.imageUrl);
            return imageUrl.length > 0 ? imageUrl[0] : defaultImg;
        };

        setCarouselImgs([
            setImgSource(weddInfo.carouselImgs[0], defaultImg1),
            setImgSource(weddInfo.carouselImgs[1], defaultImg2),
            setImgSource(weddInfo.carouselImgs[2], defaultImg3),
            setImgSource(weddInfo.carouselImgs[3], defaultImg4)
        ]);
    }, [weddInfo, images, setCarouselImgs]);

    const [editForm] = Form.useForm();
    editForm.setFieldsValue(weddInfo);

    const handleEditForm = (newData) => {
        submitForm(newData);
        setIsEditModalOpen(false);
    }

    const EditForm = ({ form, onFinish }) => {
        return (
            <Form
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                form={form}
                onFinish={onFinish}
            >
                <Form.Item
                    name="weddTitle"
                    label="Wedding Title"
                    rules={[
                        {
                            required: true,
                            message: 'Please input wedding title!',
                        },
                    ]}
                >
                    <Input type="text" placeholder="Wedding Title" size="large" />
                </Form.Item>
            </Form>
        )
    };


    return (
        <Container fluid id='home' className='section p-0' style={{ position: 'relative' }}>
            <Carousel
                // autoplay
                className='image-carousel'
                afterChange={(id) => setCurrCarousel(id)}
            >
                <div className='carousel-slide'>
                    <Image className='image' preview={false} src={carouselImgs[0]} width='100%' height='calc(100vh - 70px)' />
                </div>
                <div className='carousel-slide'>
                    <Image className='image' preview={false} src={carouselImgs[1]} width='100%' height='calc(100vh - 70px)' />
                </div>
                <div className='carousel-slide'>
                    <Image className='image' preview={false} src={carouselImgs[2]} width='100%' height='calc(100vh - 70px)' />
                </div>
                <div className='carousel-slide'>
                    <Image className='image' preview={false} src={carouselImgs[3]} width='100%' height='calc(100vh - 70px)' />
                </div>
            </Carousel>

            {isEditing ? (
                <Button onClick={() => handleShowImgModal(`carouselImgs`, currCarousel)} 
                    className='edit-carousel-btn'><EditOutlined /> Edit Image</Button>
            ) : <></>}

            <div className='banner'>
                <Tooltip onClick={() => setIsEditModalOpen(true)}
                    title={<><EditOutlined /> Edit Wedding Title</>}
                    {...tooltipProps}>
                    <h1>{weddInfo.weddTitle}</h1>
                </Tooltip>

                <p>
                    <span>We Are Getting Married </span>
                    <Tooltip title={<><InfoCircleOutlined /> Wedding Date</>} {...tooltipProps}>
                        <span>{dayjs(weddInfo.eventDate).format('MMM D, YYYY').toString()}</span>
                    </Tooltip>
                </p>

                <Countdown date={new Date(weddInfo.eventDate.toString())} renderer={({ days, hours, minutes, seconds }) => {
                    return (
                        <Row className="countdown-container">
                            <Col lg={2} md={3} sm={6} xs={6} className="countdown-element day">
                                <span className='number'>{days}</span>
                                <span className='text'>Days</span>
                            </Col>
                            <Col lg={2} md={3} sm={6} xs={6} className="countdown-element hour">
                                <span className='number'>{hours}</span>
                                <span className='text'>Hours</span>
                            </Col>
                            <Col lg={2} md={3} sm={6} xs={6} className="countdown-element minute">
                                <span className='number'>{minutes}</span>
                                <span className='text'>Minutes</span>
                            </Col>
                            <Col lg={2} md={3} sm={6} xs={6} className="countdown-element second">
                                <span className='number'>{seconds}</span>
                                <span className='text'>Seconds</span>
                            </Col>
                        </Row>
                    );
                }} />
            </div>

            <Modal
                id='editModal'
                centered
                open={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                footer={[
                    <Button key="back" onClick={() => setIsEditModalOpen(false)}>
                        Return
                    </Button>,

                    <Button key="submit" type="primary" loading={submitLoading} onClick={() => editForm.submit()}>
                        Update
                    </Button>
                ]}
            >
                <EditForm form={editForm} onFinish={handleEditForm} />
            </Modal>
        </Container>
    )
}
