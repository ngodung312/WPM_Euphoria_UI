import React, { useContext, useEffect, useRef, useState } from 'react'
import { EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { Space, Table, Button, message, theme, Row, Col, Input, Popconfirm } from 'antd';
import { Link } from 'react-router-dom';
import Highlighter from 'react-highlight-words';

import { axiosInstance } from '../../context/axiosConfig';
import { AuthContext } from '../../context/authContext';

const userRoles = { 1: "Guest", 2: "Event Host", 3: "Manager", 4: "Admin" }

export const UserList = () => {
    const searchInput = useRef(null);

    const { currentUser } = useContext(AuthContext);

    const [messageApi, contextHolder] = message.useMessage();

    const [users, setUsers] = useState([])
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');

    const handleDeletes = () => {
        setLoading(true);

        axiosInstance
            .put(`/v1/auth/users/deletes`, {
                "access_token": currentUser.data.token,
                "ids": selectedRowKeys,
            })
            .then((res) => {
                const updatedUsers = users.filter(item => selectedRowKeys.indexOf(item.id) < 0);
                setUsers(updatedUsers);
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
        const fetchAllUsers = () => {
            axiosInstance
                .get("/v1/auth/users", {
                    params: {
                        "access_token": currentUser.data.token,
                    },
                })
                .then((res) => {
                    let userData = res.data.rows;
                    for (let i = 0; i < userData.length; i++) {
                        userData[i].key = userData[i].id;
                    }
                    setUsers(userData);
                })
                .catch((err) => {
                    messageApi.error(err.response.data.message);
                });
        }
        fetchAllUsers()
    }, [messageApi, currentUser])

    const handleDelete = (id) => {
        axiosInstance
            .delete(`/v1/auth/users/${id}`, {
                data: {
                    "access_token": currentUser.data.token,
                },
            })
            .then((res) => {
                const updatedUsers = users.filter(item => item.id !== parseInt(id));
                setUsers(updatedUsers);
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
            title: 'Full Name',
            dataIndex: 'fullName',
            key: 'fullName',
            sorter: {
                compare: (a, b) => a.fullName.localeCompare(b.fullName),
            },
            filterDropdown: ({ selectedKeys, setSelectedKeys, confirm }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        ref={searchInput}
                        placeholder={`Search Dish Title`}
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
                record.fullName.toString().toLowerCase().includes(value.toLowerCase()),
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
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            sorter: {
                compare: (a, b) => a.email.localeCompare(b.email),
            },
            filterDropdown: ({ selectedKeys, setSelectedKeys, confirm }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        ref={searchInput}
                        placeholder={`Search Email`}
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
                record.email.toString().toLowerCase().includes(value.toLowerCase()),
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
            title: 'Phone Number',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
            sorter: {
                compare: (a, b) => a.phoneNumber.localeCompare(b.phoneNumber),
            },
            filterDropdown: ({ selectedKeys, setSelectedKeys, confirm }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        ref={searchInput}
                        placeholder={`Search Phone Number`}
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
                record.phoneNumber.toString().toLowerCase().includes(value.toLowerCase()),
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
            title: 'Role',
            dataIndex: 'userRole',
            key: 'userRole',
            sorter: {
                compare: (a, b) => userRoles[a.userRole].localeCompare(userRoles[b.userRole]),
            },
            filters: [
                { text: 'Guest', value: 1 },
                { text: 'Event Host', value: 2 },
                { text: 'Manager', value: 3 },
                { text: 'Admin', value: 4 },
            ],
            onFilter: (value, record) => parseInt(record.userRole) === value,
            render: (id) => (
                <>{userRoles[id]}</>
            )
        },
        {
            title: 'Action',
            key: 'action',
            width: '15%',
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
                                <DeleteOutlined /> Delete Selected User(s)
                            </Button>
                        </Popconfirm>
                        <span style={{ marginLeft: 8, fontSize: 16, }} >
                            {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
                        </span>
                    </Col>
                    <Col span={12}>
                        {/* <Link to={"/"}>
                            <Button style={{ float: 'right' }}>
                                Add User <PlusOutlined />
                            </Button>
                        </Link> */}
                    </Col>
                </Row>


            </div>
            <Table rowSelection={rowSelection} columns={columns} dataSource={users}
                style={{
                    backgroundColor: colorBgContainer,
                }} />
        </div>
    )
}
