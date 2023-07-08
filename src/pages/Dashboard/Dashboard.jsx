import { Carousel, Image } from 'antd';
import React, { useContext } from 'react'
import { AuthContext } from '../../context/authContext';

import '../../assets/scss/Dashboard.scss';
import defaultImg1 from '../../assets/images/carousel-1.jpg';
import defaultImg2 from '../../assets/images/carousel-2.jpg';
import defaultImg3 from '../../assets/images/carousel-3.jpg';
import defaultImg4 from '../../assets/images/carousel-4.jpg';

export const Dashboard = () => {
    const { currentUser } = useContext(AuthContext);

    return (
        <div id='carousel'>
            <Carousel
                autoplay
                className='image-carousel'
            >
                <div className='carousel-slide'>
                    <Image className='image' preview={false} src={defaultImg1} width='100%' height='calc(100vh - 70px)' />
                </div>
                <div className='carousel-slide'>
                    <Image className='image' preview={false} src={defaultImg2} width='100%' height='calc(100vh - 70px)' />
                </div>
                <div className='carousel-slide'>
                    <Image className='image' preview={false} src={defaultImg3} width='100%' height='calc(100vh - 70px)' />
                </div>
                <div className='carousel-slide'>
                    <Image className='image' preview={false} src={defaultImg4} width='100%' height='calc(100vh - 70px)' />
                </div>
            </Carousel>

            <div className='title-carousel'>
                <h1>Welcome, {currentUser.data.fullName} !</h1>
                {/* <Space size='large' className='btn-group'>
                    <Button>View Your Wedding Details</Button>
                </Space> */}
            </div>
        </div>
    )
}
