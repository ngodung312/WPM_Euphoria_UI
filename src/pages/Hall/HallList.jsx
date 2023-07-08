import React, { useContext, useEffect, useRef, useState } from 'react'
import { EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { Space, Table, Button, message, theme, Row, Col, Input, Popconfirm } from 'antd';
import { Link } from 'react-router-dom';
import Highlighter from 'react-highlight-words';

import { axiosInstance } from '../../context/axiosConfig';
import { AuthContext } from '../../context/authContext';
import { AddHall } from './AddHall';

export const HallList = () => {
    const searchInput = useRef(null);

    const { currentUser } = useContext(AuthContext);
    const [halls, setHalls] = useState([])
    const [messageApi, contextHolder] = message.useMessage();

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');

    const handleDeletes = () => {
        setLoading(true);

        axiosInstance
            .put(`/v1/auth/halls/deletes`, {
                "access_token": currentUser.data.token,
                "ids": selectedRowKeys,
            })
            .then((res) => {
                const updatedHalls = halls.filter(item => !selectedRowKeys.includes(item.id));
                setHalls(updatedHalls);
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
        const fetchAllHalls = () => {
            axiosInstance
                .get("/v1/auth/halls", {
                    params: {
                        "access_token": currentUser.data.token,
                    },
                })
                .then((res) => {
                    let hallData = res.data.rows;
                    for (let i = 0; i < hallData.length; i++) {
                        hallData[i].key = hallData[i].id;
                    }
                    setHalls(hallData);
                })
                .catch((err) => {
                    messageApi.error(err.response.data.message);
                });
        }
        fetchAllHalls()
    }, [messageApi, currentUser])

    const handleDelete = (id) => {
        axiosInstance
            .delete(`/v1/auth/halls/${id}`, {
                data: {
                    "access_token": currentUser.data.token,
                },
            })
            .then((res) => {
                const updatedHalls = halls.filter(item => item.id !== id);
                setHalls(updatedHalls);
                messageApi.success(res ? res.data.result : 'ok');
            })
            .catch((err) => {
                messageApi.error(err.response ? err.response.data.message : 'err');
            });
    }

    const handleSearch = (selectedKeys, confirm) => {
        confirm();
        setSearchText(selectedKeys[0]);
    };

    const columns = [
        {
            title: 'Hall Title',
            dataIndex: 'hallTitle',
            key: 'hallTitle',
            width: '20%',
            sorter: {
                compare: (a, b) => a.hallTitle.localeCompare(b.hallTitle),
            },
            filterDropdown: ({ selectedKeys, setSelectedKeys, confirm }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        ref={searchInput}
                        placeholder={`Search Hall Title`}
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
                record.hallTitle.toString().toLowerCase().includes(value.toLowerCase()),
            onFilterDropdownOpenChange: (visible) => {
                if (visible) {
                    setTimeout(() => searchInput.current?.select(), 100);
                }
            },
            render: (text, record) => (
                <Space size="middle">
                    {/* <Image src={record.hallUrl} width="12vb" /> */}
                    <Highlighter
                        highlightStyle={{
                            backgroundColor: '#ffc069',
                            padding: 0,
                        }}
                        searchWords={[searchText]}
                        autoEscape
                        textToHighlight={text ? text.toString() : ''}
                    />
                </Space>
            ),
        },
        {
            title: 'Hall Description',
            dataIndex: 'hallDesc',
            key: 'hallDesc',
        },
        {
            title: 'Number of Tables',
            dataIndex: 'numTables',
            key: 'numTables',
            width: '15%',
            sorter: {
                compare: (a, b) => a.numTables - b.numTables,
            },
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
                                <DeleteOutlined /> Delete Selected Hall(s)
                            </Button>
                        </Popconfirm>
                        <span style={{ marginLeft: 8, fontSize: 16, }} >
                            {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
                        </span>
                    </Col>
                    <Col span={12}>
                        <AddHall halls={halls} setHalls={setHalls} />
                    </Col>
                </Row>


            </div>
            <Table rowSelection={rowSelection} columns={columns} dataSource={halls}
                style={{
                    backgroundColor: colorBgContainer,
                }} />
        </div>
    )
}
