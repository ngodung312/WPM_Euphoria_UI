import React, { useContext, useEffect, useRef, useState } from 'react'
import { EditOutlined, DeleteOutlined, DollarOutlined, SearchOutlined } from '@ant-design/icons';
import { Space, Table, Button, message, theme, Row, Col, Popconfirm, Input } from 'antd';
import { Link } from 'react-router-dom';
import Highlighter from 'react-highlight-words';

import { axiosInstance } from '../../context/axiosConfig';
import { AuthContext } from '../../context/authContext';
import { AddMenu } from './AddMenu';

export const MenuList = () => {
    const searchInput = useRef(null);

    const { currentUser } = useContext(AuthContext);
    const [menus, setMenus] = useState([])
    const [messageApi, contextHolder] = message.useMessage();

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');

    const handleDeletes = () => {
        setLoading(true);

        axiosInstance
            .put(`/v1/auth/menus/deletes`, {
                "access_token": currentUser.data.token,
                "ids": selectedRowKeys,
            })
            .then((res) => {
                const updatedMenus = menus.filter(item => !selectedRowKeys.includes(item.id));
                setMenus(updatedMenus);
                messageApi.success(res ? res.data.result : 'ok');
            })
            .catch((err) => {
                messageApi.error(err.response ? err.response.data.message : 'err');
            })
            .finally(() => {
                setSelectedRowKeys([]);
                setLoading(false);
            });
    };

    const onSelectChange = (newSelectedRowKeys) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    const hasSelected = selectedRowKeys.length > 0;

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    useEffect(() => {
        const fetchAllMenus = () => {
            axiosInstance
                .get("/v1/auth/menus", {
                    params: {
                        "access_token": currentUser.data.token,
                    },
                })
                .then((res) => {
                    let menuData = res.data.rows;
                    for (let i = 0; i < menuData.length; i++) {
                        menuData[i].key = menuData[i].id;
                    }
                    setMenus(menuData);
                })
                .catch((err) => {
                    messageApi.error(err.response.data.message);
                });
        }
        fetchAllMenus()
    }, [messageApi, currentUser]);

    const handleDelete = (id) => {
        axiosInstance
            .delete(`/v1/auth/menus/${id}`, {
                data: {
                    "access_token": currentUser.data.token,
                },
            })
            .then((res) => {
                const updatedMenus = menus.filter(item => item.id !== id);
                setMenus(updatedMenus);
                messageApi.success(res ? res.data.result : 'ok');
            })
            .catch((err) => {
                messageApi.error(err.response ? err.response.data.message : 'err');
            });
    };

    const handleSearch = (selectedKeys, confirm) => {
        confirm();
        setSearchText(selectedKeys[0]);
    };

    const columns = [
        {
            title: 'Menu Title',
            dataIndex: 'menuTitle',
            key: 'menuTitle',
            width: '20%',
            sorter: {
                compare: (a, b) => a.menuTitle.localeCompare(b.menuTitle),
            },
            filterDropdown: ({ selectedKeys, setSelectedKeys, confirm }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        ref={searchInput}
                        placeholder={`Search Menu Title`}
                        value={selectedKeys[0]}
                        onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleSearch(selectedKeys, confirm);
                        }}
                    />
                </div>
            ),
            filterIcon: (filtered) => (
                <SearchOutlined
                    style={{
                        color: filtered ? '#1890ff' : undefined,
                    }}
                />
            ),
            onFilter: (value, record) =>
                record.menuTitle.toString().toLowerCase().includes(value.toLowerCase()),
            onFilterDropdownOpenChange: (visible) => {
                if (visible) {
                    setTimeout(() => searchInput.current?.select(), 100);
                }
            },
            render: (text) => (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: '#ffc069',
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ),
        },
        {
            title: 'Menu Description',
            dataIndex: 'menuDesc',
            key: 'menuDesc',
        },
        {
            title: 'Menu Price',
            dataIndex: 'menuPrice',
            key: 'menuPrice',
            width: '15%',
            sorter: {
                compare: (a, b) => a.menuPrice - b.menuPrice,
            },
            render: (text) => (
                <>
                    <span><DollarOutlined /> </span>
                    <span>{text}</span>
                </>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            width: '20%',
            render: (_, record) => (
                <Space size="middle">
                    {contextHolder}
                    <Link to={`./${record.id}`}>
                        <Button>
                            <EditOutlined />
                        </Button>
                    </Link>
                    <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.id)}>
                        <Button danger><DeleteOutlined /></Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: 8, background: 'rgb(255, 255, 255)', }}>
            <div className='mb-4'>
                <Row>
                    <Col span={12} className='d-flex flex-row align-items-center'>
                        <Popconfirm title="Sure to delete?" onConfirm={handleDeletes} disabled={!hasSelected}>
                            <Button danger disabled={!hasSelected} loading={loading} size='large'>
                                <DeleteOutlined /> Delete Selected Menu(s)
                            </Button>
                        </Popconfirm>
                        <span style={{ marginLeft: 8, fontSize: 16, }} >
                            {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
                        </span>
                    </Col>
                    <Col span={12}>
                        <AddMenu menus={menus} setMenus={setMenus} />
                    </Col>
                </Row>


            </div>
            <Table rowSelection={rowSelection} columns={columns} dataSource={menus}
                style={{
                    backgroundColor: colorBgContainer,
                }} />
        </div>
    )
}
