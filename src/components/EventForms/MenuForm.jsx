import { Button, Card, Col, Collapse, Form, Image, Input, List, Modal, Row, Space } from 'antd';
// import { ContainerOutlined } from '@ant-design/icons';
import React, { useContext, useState } from 'react'
import Meta from 'antd/es/card/Meta';

import { MenuTable } from '../Tables/MenuTable';
import { AuthContext } from '../../context/authContext';

export const MenuForm = ({
    isViewMode, menuForm,
    selectedMenu, setSelectedMenu,
    menuDishes, setMenuDishes,
    menus, dishes, menuItems,
    contextHolder, isHidden, onFinish
}) => {
    const { Panel } = Collapse;

    const { currentUser } = useContext(AuthContext);
    const folderUrl = `${currentUser.data.bucketUrl}/dishes`;
    const defaultImg = "data:image/png;base64,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";

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMenu, setModalMenu] = useState([]);
    const [modalDishes, setModalDishes] = useState([]);

    const findMenuDishes = (menuId) => {
        const dishItems = menuItems.filter(item => item.menuId === menuId);
        for (let i = 0; i < dishItems.length; i++) {
            const currDish = dishes.find(item => item.id === dishItems[i].dishId);
            dishItems[i] = {
                dishTitle: currDish.dishTitle,
                dishPrice: currDish.dishPrice,
                dishUrl: currDish.dishUrl ? `${folderUrl}/${currDish.dishUrl}` : defaultImg,
                dishDesc: currDish.dishDesc,
                ...dishItems[i]
            }
        }
        return dishItems;
    }

    const handleShowMenu = (menu) => {
        console.log(menu);
        setIsModalOpen(true);
        setModalMenu([
            {
                key: "Title",
                value: menu.menuTitle
            },
            {
                key: "Price ($)",
                value: menu.menuPrice
            },
            {
                key: "Description",
                value: menu.menuDesc || 'N.A'
            }
        ]);
        const modalDishes = findMenuDishes(menu.id);
        setModalDishes(modalDishes);
    };

    const handelModalCancel = () => {
        setIsModalOpen(false);
    }

    const handleAddDish = (menu) => {
        setSelectedMenu(menu);
        const dishesInfo = findMenuDishes(menu.id);
        setMenuDishes(dishesInfo);
    }

    const DishList = ({ dishItems, type, isDetailed = false }) => {
        const filteredDishes = dishItems.filter((item) => item.dishType === type);
        return <List
            itemLayout="horizontal"
            dataSource={filteredDishes}
            style={{ padding: '0' }}
            renderItem={(item) => isDetailed ? (
                <List.Item>
                    <List.Item.Meta
                        avatar={<Image width='10vb' height='10vb' src={item.dishUrl} style={{ objectFit: 'cover' }} />}
                        title={<span style={{ fontWeight: '400' }}>{item.dishTitle}</span>}
                        description={
                            <Space direction='vertical'>
                                {/* <div>${item.dishPrice}</div> */}
                                <div>{item.dishDesc ? item.dishDesc : 'N.A'}</div>
                            </Space>
                        }
                    />
                </List.Item>
            ) : (
                <List.Item>
                    {item.dishTitle}
                </List.Item>
            )}
        />
    }

    return (
        <div>
            <Form
                name="menu"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                form={menuForm}
                onFinish={onFinish}
                hidden={isHidden}
            >
                {contextHolder}
                <Form.Item name="formName" hidden>
                    <Input type="text" />
                </Form.Item>

                <Row justify='space-around' hidden={isViewMode}>
                    <Col span={11}>
                        {/* <Button size="large" onClick={() => handleShowMenu(selectedMenu)}>
                            <ContainerOutlined /> Show Menu Details
                        </Button> */}
                    </Col>
                    <Col span={11}>
                        <Form.Item style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button type="primary" htmlType="submit" size="large">Update</Button>
                        </Form.Item>
                    </Col>
                </Row>

                <Row justify='space-around'>
                    <Col span={8}>
                        <Card
                            title={
                                <Meta
                                    title={
                                        <Row justify='space-between'>
                                            <Col span={12}>{selectedMenu.menuTitle}</Col>
                                            <Col span={12} style={{ display: 'flex', justifyContent: 'end' }}>
                                                ${selectedMenu.menuPrice} / table
                                            </Col>
                                        </Row>
                                    }
                                    description={selectedMenu.menuDesc}
                                    style={{ padding: '2vb 1vb' }}
                                />
                            }
                        >
                            <Collapse
                                bordered={false}
                                size='small'
                                defaultActiveKey={['1', '2', '3']}
                                style={{ backgroundColor: 'transparent' }}
                            >
                                <Panel header="Appertizer" key="1" style={{ paddingBottom: '1vb' }}>
                                    <DishList dishItems={menuDishes} type='1' isDetailed />
                                </Panel>
                                <Panel header="Main Course" key="2" style={{ padding: '1vb 0' }}>
                                    <DishList dishItems={menuDishes} type='2' isDetailed />
                                </Panel>
                                <Panel header="Dessert" key="3" style={{ paddingTop: '1vb' }}>
                                    <DishList dishItems={menuDishes} type='3' isDetailed />
                                </Panel>
                            </Collapse>
                        </Card>
                    </Col>

                    <Col span={14}>
                        <MenuTable
                            menus={menus}
                            selectedMenu={selectedMenu}
                            handleAddDish={handleAddDish}
                            handleShowMenu={handleShowMenu}
                            isViewMode={isViewMode}
                        />
                        <Modal
                            title="Menu Detail"
                            open={isModalOpen}
                            onCancel={handelModalCancel}
                            footer={null}
                            width='45vw'
                        >
                            <Row justify='space-between'
                                style={{
                                    padding: '2vb'
                                }}
                            >
                                <Col span={10}>
                                    <List
                                        dataSource={modalMenu}
                                        renderItem={(item) => item.key === "Description" & item.value !== 'N.A' ?
                                            (
                                                <List.Item>
                                                    <Space direction="vertical">
                                                        <span style={{ fontWeight: '500' }}>{item.key}:</span>
                                                        <span>{item.value}</span>
                                                    </Space>
                                                </List.Item>
                                            ) : (
                                                <List.Item>
                                                    <Col span={8} style={{ fontWeight: '500' }}>{item.key}:</Col>
                                                    {/* <Divider type="vertical" style={{ content: ':' }} /> */}
                                                    <Col span={16}>{item.value}</Col>
                                                </List.Item>
                                            )
                                        }
                                    />
                                </Col>
                                <Col span={13}>
                                    <Collapse
                                        bordered={false}
                                        size='small'
                                        defaultActiveKey={['1', '2', '3']}
                                        style={{ backgroundColor: 'transparent' }}
                                    >
                                        <Panel header={<span style={{ fontWeight: '500' }}>Appertizer</span>} key="1" style={{ paddingBottom: '1vb' }}>
                                            <DishList dishItems={modalDishes} type='1' isDetailed />
                                        </Panel>
                                        <Panel header={<span style={{ fontWeight: '500' }}>Main Course</span>} key="2" style={{ padding: '1vb 0' }}>
                                            <DishList dishItems={modalDishes} type='2' isDetailed />
                                        </Panel>
                                        <Panel header={<span style={{ fontWeight: '500' }}>Dessert</span>} key="3" style={{ paddingTop: '1vb' }}>
                                            <DishList dishItems={modalDishes} type='3' isDetailed />
                                        </Panel>
                                    </Collapse>
                                </Col>
                            </Row>
                        </Modal>
                    </Col>
                </Row>
            </Form>
        </div>
    )
}
