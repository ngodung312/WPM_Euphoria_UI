import { MinusOutlined, InfoCircleOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, theme, Divider, ConfigProvider, Row, Col, Collapse, List, Modal, Image, Space } from 'antd';
import { axiosInstance } from '../../context/axiosConfig';
import { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom'
import { AuthContext } from '../../context/authContext';
import { DishTable } from '../../components/Tables/DishTable';

// const initialData = [
//     { dishId: 1, dishTitle: 'Consomme printaniere royal', dishType: '1' },
//     { dishId: 2, dishTitle: 'Chicken gumbo', dishType: '1' },
//     { dishId: 7, dishTitle: 'Radishes', dishType: '1' },
//     { dishId: 11, dishTitle: 'Clear green turtle', dishType: '2' },
//     { dishId: 20, dishTitle: 'Pickles', dishType: '2' },
//     { dishId: 30, dishTitle: 'Cerealine with Milk', dishType: '2' },
//     { dishId: 27, dishTitle: 'Oysters', dishType: '2' },
//     { dishId: 26, dishTitle: 'Clams', dishType: '3' },
//     { dishId: 32, dishTitle: 'Wheat Vitos', dishType: '3' },
// ];

export const MenuInfo = () => {
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const { TextArea } = Input;
    const { Panel } = Collapse;

    const { currentUser } = useContext(AuthContext);
    const folderUrl = `${currentUser.data.bucketUrl}/dishes`;
    const defaultImg = "data:image/png;base64,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";

    // const navigate = useNavigate()
    const location = useLocation()
    const [menuForm] = Form.useForm()

    const [messageApi, contextHolder] = message.useMessage();
    const menuId = location.pathname.split('/').pop();
    const [menu, setMenu] = useState([]);
    const [dishes, setDishes] = useState([]);
    const [selectedDishes, setSelectedDishes] = useState([]);
    const [deletedIds, setDeletedIds] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalDish, setModalDish] = useState(false);
    const [modalImg, setModalImg] = useState(defaultImg);

    useEffect(() => {
        Promise
            .all([
                axiosInstance.get(`/v1/auth/menus/${menuId}`, {
                    params: {
                        "access_token": currentUser.data.token,
                    },
                }),

                axiosInstance.get("/v1/auth/dishes", {
                    params: {
                        "access_token": currentUser.data.token,
                    },
                }),

                axiosInstance.get("/v1/auth/menu-items", {
                    params: {
                        "access_token": currentUser.data.token,
                        "menuId": menuId,
                    },
                })
            ])
            .then(([menuRes, dishesRes, menuItemsRes]) => {
                const menuInfo = menuRes.data.data;
                let dishesInfo = dishesRes.data.rows;
                let menuItemsInfo = menuItemsRes.data.rows;

                for (let i = 0; i < dishesInfo.length; i++) {
                    dishesInfo[i].key = dishesInfo[i].id;
                    dishesInfo[i].dishUrl = dishesInfo[i].dishUrl ? `${folderUrl}/${dishesInfo[i].dishUrl}` : defaultImg;
                    if (!dishesInfo[i].dishDesc) {
                        dishesInfo[i].dishDesc = 'N.A';
                    }
                }

                let menuPrice = 0;
                for (let i = 0; i < menuItemsInfo.length; i++) {
                    const currDish = dishesInfo.find(item => item.id === menuItemsInfo[i].dishId);
                    menuItemsInfo[i] = {
                        dishTitle: currDish.dishTitle,
                        dishPrice: currDish.dishPrice,
                        dishUrl: currDish.dishUrl,
                        dishDesc: currDish.dishDesc,
                        ...menuItemsInfo[i]
                    }
                    menuPrice += currDish.dishPrice;
                }
                menuInfo['menuPrice'] = menuPrice;

                setMenu(menuInfo);
                setDishes(dishesInfo);
                setSelectedDishes(menuItemsInfo);
                menuForm.setFieldsValue(menuInfo);
            })
            .catch(err => {
                messageApi.error(err.response.data.message);
            });
    }, [menuId, messageApi, currentUser, menuForm, folderUrl]);

    const showDishModal = (item) => {
        // console.log(item);
        setIsModalOpen(true);
        const dishInfo = [
            {
                key: "Dish Title",
                value: item.dishTitle
            },
            {
                key: "Dish Price ($)",
                value: item.dishPrice
            },
            {
                key: "Dish Description",
                value: item.dishDesc
            }
        ]
        if (item.dishUrl) {
            setModalImg(item.dishUrl);
        }
        setModalDish(dishInfo);
    };

    const DishList = ({ type, handleDeleteDish }) => {
        const filteredDishes = selectedDishes.filter((item) => item.dishType === type);

        return <List
            itemLayout="horizontal"
            dataSource={filteredDishes}
            style={{ padding: '0 10px' }}
            renderItem={(item) => (
                <List.Item
                    actions={[
                        <Button size='small' onClick={() => showDishModal(item)}>
                            <EyeOutlined />
                        </Button>,
                        <Button size='small' danger onClick={() => handleDeleteDish(item.dishId, item.dishPrice)}>
                            <MinusOutlined />
                        </Button>,
                    ]}
                >
                    {item.dishTitle}
                </List.Item>
            )}
        />
    }

    const handleAddDish = (record, type) => {
        const newDish = {
            dishId: record.id,
            dishTitle: record.dishTitle,
            dishDesc: record.dishDesc,
            dishUrl: record.dishUrl,
            dishPrice: record.dishPrice,
            dishType: type,
            menuId: menuId,
        }
        setSelectedDishes([...selectedDishes, newDish]);
        const newPrice = menuForm.getFieldValue('menuPrice') + record.dishPrice;
        menuForm.setFieldValue('menuPrice', newPrice);
    }

    const handleDeleteDish = (dishId, dishPrice) => {
        const newPrice = menuForm.getFieldValue('menuPrice') - dishPrice;
        menuForm.setFieldValue('menuPrice', newPrice);
        const existedItem = selectedDishes.filter((item) => item.hasOwnProperty('id') & item.dishId === dishId).map(item => item.id);
        setDeletedIds([...deletedIds, ...existedItem])
        const updatedData = selectedDishes.filter((item) => item.dishId !== dishId);
        setSelectedDishes(updatedData);
    };

    const handelModalCancel = () => {
        setIsModalOpen(false);
    }

    const onFinish = (menuData) => {
        // console.log(selectedDishes);
        Promise
            .all([
                axiosInstance.put(`/v1/auth/menus/${menuId}`, {
                    "access_token": currentUser.data.token,
                    ...menuData
                }),

                deletedIds.length > 0 ?
                    axiosInstance.put(`/v1/auth/menu-items/deletes`, {
                        "access_token": currentUser.data.token,
                        "ids": deletedIds,
                    }) : null,

                selectedDishes.length > 0 ?
                    axiosInstance.post(`/v1/auth/menu-items`, {
                        "access_token": currentUser.data.token,
                        "createType": "bulk",
                        "data": selectedDishes,
                    }) : null
            ])
            .then(([menuRes, deleteItemsRes, createItemsRes]) => {
                messageApi.success(createItemsRes ? createItemsRes.data.result : 'ok');
                let updatedDishes = createItemsRes.data.data;
                for (let i = 0; i < updatedDishes.length; i++) {
                    const currDish = updatedDishes[i];
                    const filteredDish = selectedDishes.filter(item => item.dishId === currDish.dishId & item.dishType === currDish.dishType);
                    if (filteredDish.length > 0) {
                        updatedDishes[i] = {
                            ...filteredDish[0],
                            ...updatedDishes[i],
                        }
                    }
                }
                setSelectedDishes(updatedDishes);
                // console.log(updatedDishes);
            })
            .catch(err => {
                messageApi.error(err.response ? err.response.data : 'err');
            });
    };

    return (
        <div style={{
            backgroundColor: colorBgContainer,
            padding: "2vb",
        }}
        >
            <ConfigProvider theme={{
                token: {
                    colorSplit: '#BCA79B',
                    colorText: '#373425',
                    colorTextHeading: '#373425',
                    colorTextDisabled: '#373425',
                },
            }}>
                <Form
                    name="menuInfo"
                    layout="vertical"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    form={menuForm}
                    initialValues={menu}
                    onFinish={onFinish}
                >
                    <Form.Item style={{ marginBottom: '2vb', display: 'flex', justifyContent: 'flex-end' }}>
                        <Button type="primary" htmlType="submit" size="large">Update</Button>
                    </Form.Item>

                    <Divider
                        orientation="left"
                        style={{
                            fontSize: 20,
                            margin: "0 0 25px 0",
                        }}
                    >General Information</Divider>


                    {contextHolder}
                    <Row justify="space-between">
                        <Col span={12}>
                            <Form.Item
                                name="menuTitle"
                                label="Menu Title"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input menu title!',
                                    },
                                ]}
                            >
                                <Input type="text" placeholder="Menu Title" size="large" />
                            </Form.Item>
                        </Col>
                        <Col span={11}>
                            <Form.Item
                                name="menuPrice"
                                label="Menu Price"
                                tooltip={{
                                    title: 'Menu Price is calcuated automatically based on selected dishes.',
                                    icon: <InfoCircleOutlined />,
                                }}
                            >
                                <Input
                                    type="number"
                                    placeholder="Menu Price"
                                    size="large"
                                    prefix="$"
                                    disabled />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row justify="space-between">
                        <Col span={24}>
                            <Form.Item
                                name="menuDesc"
                                label="Menu Description"
                            >
                                <TextArea rows={4} placeholder="Menu Description" size="large" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Divider
                        orientation="left"
                        style={{
                            fontSize: 20,
                            margin: "25px 0 25px 0",
                        }}
                    >Dish Information</Divider>

                    <Row justify='space-between'>
                        <Col span={8}>
                            <Collapse size='small' defaultActiveKey={['1', '2', '3']}>
                                <Panel header="Appertizer" key="1">
                                    <DishList type='1' handleDeleteDish={handleDeleteDish} />
                                </Panel>
                                <Panel header="Main Course" key="2">
                                    <DishList type='2' handleDeleteDish={handleDeleteDish} />
                                </Panel>
                                <Panel header="Dessert" key="3">
                                    <DishList type='3' handleDeleteDish={handleDeleteDish} />
                                </Panel>
                            </Collapse>
                        </Col>

                        <Col span={15}>
                            <DishTable
                                dishes={dishes}
                                selectedDishes={selectedDishes}
                                handleAddDish={handleAddDish}
                                handleDeleteDish={handleDeleteDish}
                                showDishModal={showDishModal}
                            />
                            <Modal
                                title="Dish Information"
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
                                    <Col span={9}>
                                        <Image
                                            width="100%"
                                            src={modalImg}
                                        />
                                    </Col>
                                    <Col span={14}>
                                        <List
                                            size="small"
                                            dataSource={modalDish}
                                            renderItem={(item) => item.key === "Dish Description" & item.value ?
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
                                                        <Col span={15}>{item.value}</Col>
                                                    </List.Item>
                                                )
                                            }
                                        />
                                    </Col>
                                </Row>
                            </Modal>
                        </Col>
                    </Row>
                </Form>
            </ConfigProvider>

        </div>
    )
}
