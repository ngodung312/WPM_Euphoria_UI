import React, { useContext } from 'react'
import { AuthContext } from '../../context/authContext';
import { Header } from 'antd/es/layout/layout'
import { useNavigate } from 'react-router-dom';
import { theme, Avatar, Dropdown } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';

const userRoles = { 1: "Guest", 2: "Event Host", 3: "Manager", 4: "Admin" }

export const NavBar = () => {
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const { currentUser, logout } = useContext(AuthContext);
    const avatarImg = currentUser.data.avatar ? `${currentUser.data.bucketUrl}/users/${currentUser.data.avatar}` : '';

    const avatarProps = avatarImg ? {
        src: avatarImg,
    } : {
        icon: <UserOutlined />,
    };

    const navigate = useNavigate();


    const handleLogout = () => {
        try {
            logout();
            navigate('/login');
        } catch (err) {
            console.log(err);
        }
    }

    const onClick = ({ key }) => {
        if (key === 'logout') {
            handleLogout()
        } else {
            navigate('/my-profile');
        }
    };

    const items = [
        {
            key: 'profile',
            label: 'My Profile',
            icon: (<UserOutlined />),
        },
        {
            key: 'logout',
            label: 'Logout',
            icon: (<LogoutOutlined />),
        },
    ];
    return (
        <Header
            style={{
                padding: "0 4vb",
                background: colorBgContainer,
            }}
        >
            <div className='d-flex flex-row justify-content-end align-items-center' 
                style={{
                    height: 'inherit',
                    lineHeight: '1.25rem',
                }}>
                <div className='d-flex flex-column justify-content-center align-items-end px-2'>
                    <h6 className='m-0'>{currentUser.data.fullName}</h6>
                    <p className='m-0' style={{ fontSize: 13, }}>{userRoles[currentUser.data.userRole]}</p>
                </div>
                <Dropdown menu={{ items, onClick }} placement="bottomRight">
                    <Avatar {...avatarProps} size='large' />
                </Dropdown>
            </div>
        </Header>
    )
}
