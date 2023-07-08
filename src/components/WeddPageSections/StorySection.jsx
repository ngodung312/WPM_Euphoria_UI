import React, { useEffect, useState } from 'react'
import { Button, ConfigProvider, Divider, Form, Image, Input, Modal, Tooltip } from 'antd';
import { CaretRightOutlined, EditOutlined } from '@ant-design/icons';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import divIcon from '../../assets/images/logo-icon.png';
import defaultImg from '../../assets/images/wedd-story.jpg';

export const StorySection = ({
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

    const [editForm] = Form.useForm();
    editForm.setFieldsValue(weddInfo);

    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
    const [storyImg, setStoryImg] = useState(false);

    useEffect(() => {
        const setImgSource = (imgId, defaultImg) => {
            const imageUrl = images.filter(item => item.id === parseInt(imgId)).map(item => item.imageUrl);
            return imageUrl.length > 0 ? imageUrl[0] : defaultImg;
        };

        setStoryImg(setImgSource(weddInfo.storyImg, defaultImg));
    }, [weddInfo, images, setStoryImg]);

    const getVideoId = (url) => {
        var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        var match = url.match(regExp);

        if (match && match[2].length === 11) {
            return match[2];
        } else {
            return url;
        }
    }

    const handleEdit = (newData) => {
        newData.storyVideoUrl = `https://www.youtube.com/embed/${getVideoId(newData.storyVideoUrl)}`;
        submitForm(newData);
    };

    const EditForm = ({ form, onFinish }) => {
        return (
            <Form
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                form={form}
                onFinish={onFinish}
            >
                <Form.Item
                    name='storyVideoUrl'
                >
                    <Input
                        type="text"
                        placeholder='Link to the story video'
                        size="large"
                        addonBefore="Video Link"
                    />
                </Form.Item>
            </Form>
        )
    };

    return (
        <Container fluid id='story' className='section'>
            <Row className='story-title align-items-center justify-content-center'>
                <ConfigProvider theme={{
                    token: {
                        lineWidth: 3,
                        colorSplit: '#BFB3A7',
                    },
                }}>
                    <Divider style={{ padding: '0 85vb' }}>
                        <Image src={divIcon} preview={false} width='14vb' className='div-icon' />
                    </Divider>
                </ConfigProvider>
                <h2 className='text-center'>Our Sweet Story</h2>
            </Row>

            <Row className='story-video align-items-center justify-content-center'
                style={{
                    backgroundImage: `linear-gradient(
                            rgba(55, 52, 37, 0.5),
                            rgba(55, 52, 37, 0.5)
                        ),
                        url("${storyImg}")`,
                }}>
                {isEditing ? (
                    <Button onClick={() => { handleShowImgModal('storyImg') }}
                        className='edit-carousel-btn'><EditOutlined /> Edit Image</Button>
                ) : <></>}

                <div className='story-frame'>
                    <Tooltip
                        title={<><EditOutlined /> Edit Story Video</>}
                        {...tooltipProps}>
                        <Button
                            className='play-btn'
                            shape='circle'
                            type='primary'
                            onClick={() => { setIsVideoModalOpen(true) }}
                            icon={<CaretRightOutlined style={{ fontSize: '5vb' }} />} />
                    </Tooltip>

                    <Modal
                        open={isVideoModalOpen}
                        onCancel={() => { setIsVideoModalOpen(false) }}
                        centered
                        width='50vw'
                        bodyStyle={{
                            paddingTop: '4vb',
                        }}
                        footer={isEditing ? [
                            <Button key="back" onClick={() => { setIsVideoModalOpen(false) }}>
                                Return
                            </Button>,

                            <Button key="submit" type="primary" loading={submitLoading}
                                onClick={() => editForm.submit()}>
                                Update
                            </Button>
                        ] : false}
                    >
                        {isEditing ? (
                            <EditForm form={editForm} onFinish={handleEdit} />
                        ) : <></>}

                        <iframe
                            width="100%"
                            height="420"
                            src={`https://www.youtube.com/embed/${getVideoId(weddInfo.storyVideoUrl)}`}
                            title="Youtube Video Preview"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen>
                        </iframe>
                    </Modal>
                </div>
            </Row>
        </Container>
    )
}
