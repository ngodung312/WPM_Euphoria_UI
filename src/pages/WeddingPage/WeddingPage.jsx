import { Button, ConfigProvider, Dropdown, FloatButton, Form, Image, Input, Layout, Menu, Space, message } from 'antd'
import {
    FacebookFilled, TwitterOutlined, InstagramFilled, YoutubeFilled, MailOutlined, MailFilled,
    PhoneFilled, EnvironmentFilled, LoginOutlined, MenuOutlined, HomeOutlined, TeamOutlined,
    VideoCameraOutlined, PictureOutlined, FieldTimeOutlined
} from '@ant-design/icons';
import { Content, Footer, Header } from 'antd/es/layout/layout'
import React, { useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import dayjs from 'dayjs';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import '../../assets/scss/WeddingPage.scss';
import fullIcon from '../../assets/images/logo-white.png';

import { axiosInstance } from '../../context/axiosConfig';
import { AuthContext } from '../../context/authContext';

import { HomeSection } from '../../components/WeddPageSections/HomeSection';
import { CoupleSection } from '../../components/WeddPageSections/CoupleSection';
import { StorySection } from '../../components/WeddPageSections/StorySection';
import { GallerySection } from '../../components/WeddPageSections/GallerySection';
import { EventSection } from '../../components/WeddPageSections/EventSection';
import { RsvpSection } from '../../components/WeddPageSections/RsvpSection';
import { ImageModal } from '../../components/WeddPageSections/ImageModal';

const initWeddInfo = {
    weddTitle: 'Bride & Groom',
    groomName: 'Groom Name',
    groomDesc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam id dicta est magni nam ut magnam praesentium non omnis blanditiis.',
    brideName: 'Bride Name',
    brideDesc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam id dicta est magni nam ut magnam praesentium non omnis blanditiis.',
    eventDate: new Date('2023-12-03'),
    eventStart: new Date('2023-12-03'),
    eventEnd: new Date('2023-12-03'),
    storyVideoUrl: 'https://www.youtube.com/embed/kH7wlLOQMNM',
    carouselImgs: Array(4).fill(null),
    galleryImgs: Array(9).fill(null),
    organizerDesc: 'Creating unforgettable wedding experiences. We are a premier wedding party organizer dedicated to making your special day filled with joy, elegance, and euphoria.',
    defaultSocial: window.location.pathname.split('/editing')[0],
}

const items = [
    {
        label: (<a href={`${window.location.pathname}#`} className='text-uppercase text-decoration-none'>home</a>),
        key: 'home',
        icon: <HomeOutlined />,
    },
    {
        label: (<a href="#couple" className='text-uppercase text-decoration-none'>couple</a>),
        key: 'couple',
        icon: <TeamOutlined />,
    },
    {
        label: (<a href="#story" className='text-uppercase text-decoration-none'>story</a>),
        key: 'story',
        icon: <VideoCameraOutlined />,
    },
    {
        label: (<a href="#gallery" className='text-uppercase text-decoration-none'>gallery</a>),
        key: 'gallery',
        icon: <PictureOutlined />,
    },
    {
        label: (<a href="#event" className='text-uppercase text-decoration-none'>event</a>),
        key: 'event',
        icon: <FieldTimeOutlined />,
    },
    {
        label: (<a href="#rsvp" className='text-uppercase text-decoration-none'>rsvp</a>),
        key: 'rsvp',
        icon: <MailOutlined />,
    },
];

export const WeddingPage = ({ isEditing = false }) => {
    const { currentUser } = useContext(AuthContext);

    const location = useLocation();
    const eventId = location.pathname.split('/editing')[0].split('/').pop();

    const [messageApi, contextHolder] = message.useMessage();

    const [imageForm] = Form.useForm();

    const [currNav, setCurrNav] = useState('home');
    const [weddInfo, setWeddInfo] = useState(initWeddInfo);
    const [weddItems, setWeddItems] = useState([]);
    const [restaurant, setRestaurant] = useState({});
    const [images, setImages] = useState([]);
    const [albumOptions, setAlbumOptions] = useState();
    const [submitLoading, setSubmitLoading] = useState(false);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [editingImg, setEditingImg] = useState({});

    useEffect(() => {
        const handleScroll = () => {
            const scrollPos = window.scrollY; // Get the current scroll position

            // Determine the active section based on the scroll position
            const sections = document.querySelectorAll('.section');

            sections.forEach((section) => {
                const sectionTop = section.offsetTop - 40;
                const sectionHeight = section.offsetHeight - 40;

                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    setCurrNav(section.getAttribute('id'));
                }
            });

        };

        // Add the event listener when the component mounts
        window.addEventListener('scroll', handleScroll);

        return () => {
            // Remove the event listener when the component unmounts
            window.removeEventListener('scroll', handleScroll);
        };
    }, [currNav]);

    useEffect(() => {
        Promise
            .all([
                axiosInstance.get("/wedding-pages", {
                    params: {
                        "access_token": currentUser.data.token,
                        "eventId": eventId,
                    },
                }),

                axiosInstance.get("/v1/auth/albums", {
                    params: {
                        "access_token": currentUser.data.token,
                        "eventId": eventId,
                    },
                }),

                axiosInstance.get("/restaurant-infos", {
                    params: {
                        "access_token": currentUser.data.token,
                        "eventId": eventId,
                    },
                }),
            ])
            .then(([
                weddPageRes, albumRes, restaurantRes,
            ]) => {
                const weddPageData = weddPageRes.data.rows;
                let newWeddInfo = {}
                for (let i = 0; i < weddPageData.length; i++) {
                    const currData = weddPageData[i];
                    switch (currData.infoLabel) {
                        case 'eventDate':
                            newWeddInfo[currData.infoLabel] = dayjs(currData.infoValue, 'YYYY-MM-DD');
                            break;
                        case 'eventStart':
                        case 'eventEnd':
                            newWeddInfo[currData.infoLabel] = dayjs(currData.infoValue, 'HH:mm:ss');
                            break;
                        case 'carouselImgs':
                        case 'galleryImgs':
                            newWeddInfo[currData.infoLabel] = currData.infoValue.split(',');
                            break;
                        default:
                            newWeddInfo[currData.infoLabel] = currData.infoValue;
                    }
                }

                const albumData = albumRes.data.rows;
                let albumOptData = [];
                for (let i = 0; i < albumData.length; i++) {
                    albumOptData.push({
                        key: albumData[i].id,
                        value: albumData[i].id,
                        label: albumData[i].albumTitle,
                    })
                }

                const restaurantData = restaurantRes.data.rows;
                let restaurantInfo = {};
                for (let i = 0; i < restaurantData.length; i++) {
                    const currItem = restaurantData[i];
                    restaurantInfo[currItem.infoLabel] = currItem.infoValue;
                }
                setRestaurant(restaurantInfo);

                setAlbumOptions(albumOptData);
                setWeddItems(weddPageData);
                setWeddInfo({
                    ...initWeddInfo,
                    ...newWeddInfo
                });
            })
            .catch(err => {
                messageApi.error(err.response.data.message);
            });
    }, [currentUser, eventId, messageApi]);

    const onClick = (e) => {
        setCurrNav(e.key);
    };

    const submitForm = (newData) => {
        setSubmitLoading(true);

        let newItems = [];
        for (let key in newData) {
            const updatedItem = weddItems.filter(item => item.infoLabel === key);
            let value = newData[key] ? newData[key] : '';
            if (key === 'galleryImgs' || key === 'carouselImgs') {
                let imgData = weddInfo[key];
                imgData[value[0]] = value[1];
                newData[key] = imgData;
                value = newData[key].join(',');
            }
            if (updatedItem.length > 0) {
                updatedItem[0].infoValue = value;
            } else {
                newItems.push({
                    infoLabel: key,
                    infoValue: value,
                    eventId: eventId
                })
            }
        }
        newItems = [...weddItems, ...newItems];
        // console.log("NEW DATA", newItems);
        setWeddItems(newItems);
        setWeddInfo({ ...weddInfo, ...newData });

        axiosInstance.post(`/v1/auth/wedding-pages`, {
            "access_token": currentUser.data.token,
            "createType": "bulk",
            "data": newItems,
        }).then((res) => {
            setWeddItems(res.data.data);
            messageApi.success(res ? res.data.result : 'ok');
            setSubmitLoading(false);
        }).catch(err => {
            messageApi.error(err.response ? err.response.data : 'err');
            setSubmitLoading(false);
        });
    };

    const handleImageForm = (newData) => {
        if (editingImg.infoLabel) {
            if (editingImg.infoLabel === 'galleryImgs' || editingImg.infoLabel === 'carouselImgs') {
                newData[editingImg.infoLabel] = [editingImg.infoIndex, editingImg.infoValue];
            } else {
                newData[editingImg.infoLabel] = editingImg.infoValue;
            }
            delete newData.albumId;
            submitForm(newData);
        }
        setIsImageModalOpen(false);
    }

    const handleShowImgModal = (label, index = null) => {
        let value = weddInfo.hasOwnProperty(label) ? weddInfo[label] : null;
        setEditingImg({
            ...editingImg,
            infoLabel: label,
            infoValue: index !== null ? value[index] : value,
            infoIndex: index !== null ? index : null,
        });
        setIsImageModalOpen(true);
    }

    const sectionProps = {
        isEditing: isEditing,
        eventId: eventId,
        weddInfo: weddInfo,
        images: images,
        restaurant: restaurant,
        submitForm: submitForm,
        submitLoading: submitLoading,
        handleShowImgModal: handleShowImgModal,
    }

    return (
        <div>
            <ConfigProvider theme={{
                token: {
                    colorPrimary: '#94755A',
                },
            }}>
                {contextHolder}
                <FloatButton.Group
                    shape="circle"
                    style={{
                        right: 20,
                        bottom: 20,
                    }}
                >
                    {isEditing ? (
                        <FloatButton type='primary' icon={<TeamOutlined />} tooltip="Guest View"
                            onClick={() => window.open(window.location.pathname.split('/editing')[0], '_blank')} />
                    ) : <></>}
                    <FloatButton.BackTop visibilityHeight={0} />
                </FloatButton.Group>

                <Layout>
                    <Header
                        style={{
                            backgroundColor: 'white',
                            position: 'sticky',
                            top: 0,
                            zIndex: 2,
                            width: '100%',
                            height: '70px',
                            boxShadow: 'rgba(0, 0, 0, 0.2) 0px 2px 4px 2px',
                        }}
                    >
                        <Row style={{ height: '100%' }} className='header-content'>
                            <Col xs={{ span: 8 }} md={{ span: 2, order: 'first' }} className='logo'>
                                <Image src={fullIcon} width='120px' preview={false} />
                            </Col>
                            <Col xs={{ span: 2, order: 'first' }} md= {{ span: 8 }} className='menu'>
                                <ConfigProvider theme={{
                                    token: {
                                        lineWidthBold: 3,
                                    },
                                }}>
                                    {window.innerWidth <= 576 ? (
                                        <Dropdown
                                            menu={{
                                                items,
                                            }}
                                            placement="bottomLeft"
                                        >
                                            <Button size='large'><MenuOutlined /></Button>
                                        </Dropdown>
                                    ) : (
                                        <Menu
                                            className='align-items-center justify-content-center'
                                            onClick={onClick}
                                            selectedKeys={[currNav]}
                                            mode="horizontal"
                                            items={items}
                                            style={{ height: '100%', fontSize: '2.15vb', fontWeight: '550' }} />
                                    )}

                                </ConfigProvider>

                            </Col>
                            <Col xs={{ span: 2, order: 'last' }} md={{ span: 2, order: 'last' }} className='attend-btn d-flex align-items-center justify-content-end'>
                                <a href='#rsvp' style={{ textDecoration: 'none' }}>
                                    <Button size='large' type='primary'>{window.innerWidth <= 576 ? <LoginOutlined /> : "Attend Now"}</Button>
                                </a>
                            </Col>
                        </Row>
                    </Header>
                    <Content>
                        <ImageModal
                            editingImg={editingImg}
                            setEditingImg={setEditingImg}
                            imageForm={imageForm}
                            handleImageForm={handleImageForm}
                            albumOptions={albumOptions}
                            images={images}
                            setImages={setImages}
                            submitLoading={submitLoading}
                            isOpen={isImageModalOpen}
                            setIsOpen={setIsImageModalOpen}
                            currentUser={currentUser}
                            messageApi={messageApi}
                        />
                        <HomeSection {...sectionProps} />
                        <CoupleSection {...sectionProps} />
                        <StorySection {...sectionProps} />
                        <GallerySection {...sectionProps} />
                        <EventSection {...sectionProps} />
                        <RsvpSection {...sectionProps} />
                    </Content>
                    <Footer id='footer'>
                        <Container fluid className='footer-detail'>
                            <Row className='align-items-start justify-content-around'>
                                <Col md={1} sm={0} xs={0}></Col>
                                <Col md={3} sm={11} xs={11} className='organizer-info'>
                                    <Image src={fullIcon} width='60%' className='pb-3' preview={false}></Image>
                                    <p>{restaurant.description || initWeddInfo.organizerDesc}</p>
                                    <Space size='middle' className='social'>
                                        <Button onClick={() => window.open(restaurant.accFacebook || initWeddInfo.defaultSocial, '_blank')}
                                            size='large' shape='circle' icon={<FacebookFilled />} />
                                        <Button onClick={() => window.open(restaurant.accTwitter || initWeddInfo.defaultSocial, '_blank')}
                                            size='large' shape='circle' icon={<TwitterOutlined />} />
                                        <Button onClick={() => window.open(restaurant.accInstagram || initWeddInfo.defaultSocial, '_blank')}
                                            size='large' shape='circle' icon={<InstagramFilled />} />
                                        <Button onClick={() => window.open(restaurant.accYoutube || initWeddInfo.defaultSocial, '_blank')}
                                            size='large' shape='circle' icon={<YoutubeFilled />} />
                                    </Space>
                                </Col>
                                <Col md={3} sm={11} xs={11} className='contact'>
                                    <h3>Contact</h3>
                                    <p>Would you need any additional information or have any concerns. Please feel free to contact us:</p>
                                    <ul>
                                        <li>
                                            <span><MailFilled /></span>
                                            <span>{restaurant.email || 'N.A'}</span>
                                        </li>
                                        <li>
                                            <span><PhoneFilled /></span>
                                            <span>{restaurant.phoneNumber || 'N.A'}</span>
                                        </li>
                                        <li>
                                            <span><EnvironmentFilled /></span>
                                            <span>{restaurant.address || 'N.A'}</span>
                                        </li>
                                    </ul>
                                </Col>
                                <Col md={3} sm={11} xs={11} className='question'>
                                    <h3>Have Any Question?</h3>
                                    <p>We understand that readers can be easily distracted by the content on a page.</p>
                                    <Form>
                                        <Form.Item
                                            name="name"
                                            className='rsvp-item'
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Please input your name!',
                                                },
                                            ]}
                                        >
                                            <Input
                                                placeholder="Name"
                                            />
                                        </Form.Item>

                                        <Form.Item
                                            name="email"
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
                                                placeholder="Email"
                                            />
                                        </Form.Item>

                                        <Form.Item
                                            name="message"
                                            className='rsvp-item'
                                            rules={[
                                                {
                                                    type: 'message',
                                                    required: true,
                                                    message: 'Please input your message!',
                                                },
                                            ]}
                                        >
                                            <Input.TextArea
                                                placeholder="Message"
                                                rows={5}
                                            />
                                        </Form.Item>

                                        <Form.Item style={{ textAlign: 'start' }} className='mb-0'>
                                            <Button type="primary" htmlType="submit">
                                                Send Message
                                            </Button>
                                        </Form.Item>

                                    </Form>
                                </Col>
                                <Col md={1} sm={0} xs={0}></Col>
                            </Row>
                        </Container>
                        <div className='copyright text-center'>Copyright © 2023 Euphoria. Created by Ngo Le Hanh Dung. All Rights Reserved.</div>
                    </Footer>
                </Layout>
            </ConfigProvider>
        </div>
    )
}
