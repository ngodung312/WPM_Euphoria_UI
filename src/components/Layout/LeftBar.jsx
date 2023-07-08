import { useContext, useState } from "react";
import { ConfigProvider, Image, Layout, Menu } from "antd";
import {
    PieChartOutlined, UserOutlined, RestOutlined, HomeOutlined, GroupOutlined,
    CalendarOutlined, ProfileOutlined, ContainerOutlined
} from '@ant-design/icons';
import { Link, useLocation } from "react-router-dom";

import fullIcon from '../../assets/images/logo.png';
import shortIcon from '../../assets/images/short-logo.png';

import { AuthContext } from "../../context/authContext";

export const LeftBar = () => {
    const { Sider } = Layout;

    const { currentUser } = useContext(AuthContext);

    const location = useLocation();
    const currentNav = location.pathname.split('/')[1] ? location.pathname.split('/')[1] : 'dashboard';

    const [collapsed, setCollapsed] = useState(false);
    const [current, setCurrent] = useState(currentNav);

    if (currentNav !== current) {
        setCurrent(currentNav);
    }

    const handleClick = (e) => {
        setCurrent(e.key);
    };

    function getItem(label, key, icon, children) {
        if ((currentUser.data.userRole < 4 & key === 'users')
            || (currentUser.data.userRole < 3 & key === 'restaurant')) {
            return null;
        }
        return { key, icon, children, label };
    }

    const items = [
        getItem((<Link to='/'>Dashboard</Link>), 'dashboard', <PieChartOutlined />),
        getItem((<Link to="/users">Users</Link>), 'users', <UserOutlined />),
        getItem((<Link to="/events">Events</Link>), 'events', <CalendarOutlined />),
        getItem('Restaurant', 'restaurant', <HomeOutlined />, [
            getItem((<Link to="/restaurant-infos">Information</Link>), 'restaurant-infos', <ContainerOutlined />),
            getItem((<Link to="/dishes">Dishes</Link>), 'dishes', <RestOutlined />),
            getItem((<Link to="/menus">Menus</Link>), 'menus', <ProfileOutlined />),
            getItem((<Link to="/halls">Halls</Link>), 'halls', <GroupOutlined />),
        ]),
    ];

    return (
        <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={(value) => setCollapsed(value)}
            style={{
                background: '#614D44',
            }}
        >
            <div
                style={{
                    height: 50,
                    margin: 16,
                    display: 'flex',
                    justifyContent: 'center'
                }}
            >
                <Image src={collapsed ? shortIcon : fullIcon} height='100%' preview={false} />
            </div>
            <ConfigProvider theme={{
                token: {
                    colorBgContainer: '#614D44',
                    colorBgElevated: '#614D44',
                    colorText: '#E5E4E1',
                    controlItemBgActive: '#BCA79B',
                    colorPrimary: '#3E2C20',
                },
            }}>
                <Menu
                    selectedKeys={[current]}
                    defaultOpenKeys={['restaurant']}
                    mode="inline"
                    items={items}
                    onClick={handleClick}
                    style={{
                        border: 'none',
                    }}
                />
            </ConfigProvider>
        </Sider>
    )
}
