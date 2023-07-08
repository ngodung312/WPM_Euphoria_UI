import React, { useContext, useEffect, useRef, useState } from 'react'
import { DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { Space, Table, Button, message, theme, Row, Col, Popconfirm, Input } from 'antd';
import Highlighter from 'react-highlight-words';

import { axiosInstance } from '../../context/axiosConfig';
import { AuthContext } from '../../context/authContext';
import { FieldModal } from './RestaurantInfoModal';

export const RestaurantInfoList = () => {
    const searchInput = useRef(null);

    const { currentUser } = useContext(AuthContext);
    const [messageApi, contextHolder] = message.useMessage();

    const [restaurantInfos, setRestaurantInfos] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');

    const handleSearch = (selectedKeys, confirm) => {
        confirm();
        setSearchText(selectedKeys[0]);
    };

    const handleDeletes = () => {
        setLoading(true);

        axiosInstance
            .put(`/v1/auth/restaurant-infos/deletes`, {
                "access_token": currentUser.data.token,
                "ids": selectedRowKeys,
            })
            .then((res) => {
                const updatedInfos = restaurantInfos.filter(item => selectedRowKeys.indexOf(item.id) < 0);
                setRestaurantInfos(updatedInfos);
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
        const fetchAllRestaurantInfos = () => {
            axiosInstance
                .get("/restaurant-infos", {
                    params: {
                        "access_token": currentUser.data.token,
                    },
                })
                .then((res) => {
                    let restaurantInfoData = res.data.rows;
                    for (let i = 0; i < restaurantInfoData.length; i++) {
                        restaurantInfoData[i].key = restaurantInfoData[i].id;
                    }
                    setRestaurantInfos(restaurantInfoData);
                })
                .catch((err) => {
                    messageApi.error(err.response.data.message);
                });
        }
        fetchAllRestaurantInfos()
    }, [messageApi, currentUser])

    const handleDelete = (id) => {
        axiosInstance
            .delete(`/v1/auth/restaurant-infos/${id}`, {
                data: {
                    "access_token": currentUser.data.token,
                },
            })
            .then((res) => {
                const updatedInfos = restaurantInfos.filter(item => item.id !== parseInt(id));
                setRestaurantInfos(updatedInfos);
                messageApi.success(res ? res.data.result : 'ok');
            })
            .catch((err) => {
                messageApi.error(err.response ? err.response.data.message : 'err');
            });
    }

    const columns = [
        {
            title: 'Field Name',
            dataIndex: 'infoLabel',
            key: 'infoLabel',
            width: '20%',
            sorter: {
                compare: (a, b) => a.infoLabel.localeCompare(b.infoLabel),
            },
            filterDropdown: ({ selectedKeys, setSelectedKeys, confirm }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        ref={searchInput}
                        placeholder={`Search Field Name`}
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
                record.infoLabel.toString().toLowerCase().includes(value.toLowerCase()),
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
            )
        },
        {
            title: 'Field Value',
            dataIndex: 'infoValue',
            key: 'infoValue',
            sorter: {
                compare: (a, b) => a.infoValue.localeCompare(b.infoValue),
            },
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    {contextHolder}
                    <FieldModal isEditing={record.id} restaurantInfos={restaurantInfos} setRestaurantInfos={setRestaurantInfos} />
                    <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
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
                            <Button size='large' danger disabled={!hasSelected} loading={loading}>
                                <DeleteOutlined /> Delete Selected Field(s)
                            </Button>
                        </Popconfirm>
                        <span style={{ marginLeft: 8, fontSize: 16, }} >
                            {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
                        </span>
                    </Col>
                    <Col span={12}>
                        <FieldModal restaurantInfos={restaurantInfos} setRestaurantInfos={setRestaurantInfos} />
                    </Col>
                </Row>
            </div>
            <Table rowSelection={rowSelection} columns={columns} dataSource={restaurantInfos}
                style={{
                    backgroundColor: colorBgContainer,
                }} />
        </div>
    )
}
