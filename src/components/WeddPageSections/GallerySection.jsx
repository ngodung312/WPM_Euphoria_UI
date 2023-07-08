import React, { useEffect, useState } from 'react'
import { ConfigProvider, Divider, Image, Tooltip } from 'antd';
import { EditOutlined } from '@ant-design/icons';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import divIcon from '../../assets/images/logo-icon.png';
import galleryImg1 from '../../assets/images/wedd-gallery-1.jpg';
import galleryImg2 from '../../assets/images/wedd-gallery-2.jpg';
import galleryImg3 from '../../assets/images/wedd-gallery-3.jpg';
import galleryImg4 from '../../assets/images/wedd-gallery-4.jpg';
import galleryImg5 from '../../assets/images/wedd-gallery-5.jpg';
import galleryImg6 from '../../assets/images/wedd-gallery-6.jpg';
import galleryImg7 from '../../assets/images/wedd-gallery-7.jpg';
import galleryImg8 from '../../assets/images/wedd-gallery-8.jpg';
import galleryImg9 from '../../assets/images/wedd-gallery-9.jpg';

const defaultImg = [
    galleryImg1,
    galleryImg2,
    galleryImg3,
    galleryImg4,
    galleryImg5,
    galleryImg6,
    galleryImg7,
    galleryImg8,
    galleryImg9,
]

export const GallerySection = ({ 
    isEditing, weddInfo, images, handleShowImgModal,
}) => {
    const tooltipProps = isEditing ? {
        placement: 'top',
        className: 'edit-block',
        color: '#3e2c20',
    } : {
        title: '',
        onClick: false,
    };

    const [galleryImgs, setGalleryImgs] = useState([]);

    useEffect(() => {
        const setImgSource = (imgId, defaultImg) => {
            const imageUrl = images.filter(item => item.id === parseInt(imgId)).map(item => item.imageUrl);
            return imageUrl.length > 0 ? imageUrl[0] : defaultImg;
        };

        const galleryImgData = weddInfo.galleryImgs ? weddInfo.galleryImgs : Array(9).fill(null);
        let imageSrcs = [];
        for (let i = 0; i < galleryImgData.length; i++) {
            imageSrcs.push(setImgSource(galleryImgData[i], defaultImg[i]));
        }
        setGalleryImgs(imageSrcs);
    }, [weddInfo, images, setGalleryImgs]);

    const TooltipImage = ({ index, width, height }) => {
        return (
            <>
                <Tooltip
                    onClick={() => handleShowImgModal('galleryImgs', index)}
                    title={<><EditOutlined /> Edit Image</>}
                    {...tooltipProps}>
                    <Image 
                        className='image' 
                        src={galleryImgs[index]} preview={!isEditing} width={width} height={height} />
                </Tooltip>
            </>
        )
    }

    return (
        <Container fluid id='gallery' className='section'>
            <Row className='gallery-title align-items-center justify-content-center'>
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
                <h2 className='text-center'>Sweet Captured Moments</h2>
            </Row>

            <Row className='gallery-row align-items-center justify-content-center pb-4'>
                <Col lg={4} sm={11} xs={12} className='gallery-item'>
                    <TooltipImage index={0} width='100%' height='65vb' />
                </Col>
                <Col lg={4} sm={11} xs={12} className='gallery-item'>
                    <TooltipImage index={1} width='100%' height='65vb' />
                </Col>
                <Col lg={4} sm={11} xs={12} className='gallery-item'>
                    <TooltipImage index={2} width='100%' height='65vb' />
                </Col>
            </Row>

            <Row className='gallery-row align-items-center justify-content-center pb-4'>
                <Col lg={5} sm={11} xs={12} className='gallery-item'>
                    <TooltipImage index={3} width='100%' height='50vb' />
                </Col>
                <Col lg={7} sm={11} xs={12} className='gallery-item'>
                    <TooltipImage index={4} width='100%' height='50vb' />
                </Col>
            </Row>

            <Row className='gallery-row align-items-center justify-content-center pb-4'>
                <Col lg={8} sm={11} xs={12} className='gallery-item'>
                    <TooltipImage index={5} width='100%' height='65vb' />
                </Col>
                <Col lg={4} sm={11} xs={12} className='gallery-item'>
                    <TooltipImage index={6} width='100%' height='65vb' />
                </Col>
            </Row>

            <Row className='gallery-row align-items-center justify-content-center pb-4'>
                <Col lg={6} sm={11} xs={12} className='gallery-item'>
                    <TooltipImage index={7} width='100%' height='45vb' />
                </Col>
                <Col lg={6} sm={11} xs={12} className='gallery-item'>
                    <TooltipImage index={8} width='100%' height='45vb' />
                </Col>
            </Row>
        </Container>
    )
}
