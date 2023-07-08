import React from 'react'
import { useLocation, Link } from "react-router-dom";
import { PieChartOutlined, UserOutlined, RestOutlined, GroupOutlined, CalendarOutlined, 
    ProfileOutlined, ContainerOutlined } from '@ant-design/icons';
import { Breadcrumb } from 'antd';


export const NavBreadcrumb = () => {
    const breadcrumbNameMap = {
        '/users': (<span><UserOutlined /> Users</span>),
        '/users/:id': 'User Detail',
        '/my-profile': (<span><UserOutlined /> My Profile</span>),
        '/dishes': (<span><RestOutlined /> Dishes</span>),
        '/dishes/:id': 'Dish Detail',
        '/dishes/add': 'Add Dish ',
        '/menus': (<span><ProfileOutlined /> Menus</span>),
        '/menus/:id': 'Menu Detail',
        '/halls': (<span><GroupOutlined /> Halls</span>),
        '/halls/:id': 'Hall Detail',
        '/events': (<span><CalendarOutlined /> Events</span>),
        '/events/:id': 'Event Detail',
        '/restaurant-infos': (<span><ContainerOutlined /> Restaurant Information</span>),
    };

    const location = useLocation();
    let pathSnippets = location.pathname.split('/').filter((i) => i);

    const extraBreadcrumbItems = pathSnippets.map((_, index) => {
        const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
        let key = !isNaN(url.split('/').pop()) ? url.replace(/[0-9]+/g, ':id') : url
        return (
            <Breadcrumb.Item key={url}>
                <Link to={url}>{breadcrumbNameMap[key]}</Link>
            </Breadcrumb.Item>
        );
    });

    const breadcrumbItems = [
        <Breadcrumb.Item key="dashboard" >
            <Link to="/"><PieChartOutlined /> Dashboard</Link>
        </Breadcrumb.Item>,
    ].concat(extraBreadcrumbItems);

    return (
        <Breadcrumb style={{ margin: '3vb 0' }}>
            {breadcrumbItems}
        </Breadcrumb>
    )
}