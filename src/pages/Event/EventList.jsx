import React, { useContext, useEffect, useRef, useState } from 'react'
import { EditOutlined, DeleteOutlined, SearchOutlined, EyeOutlined } from '@ant-design/icons';
import { Space, Table, Button, message, theme, Row, Col, Input, Popconfirm } from 'antd';
import { Link } from 'react-router-dom';
import Highlighter from 'react-highlight-words';
import dayjs from 'dayjs';

import { axiosInstance } from '../../context/axiosConfig';
import { AuthContext } from '../../context/authContext';
import { AddEvent } from './AddEvent';

export const EventList = () => {
    const searchInput = useRef(null);

    const { currentUser } = useContext(AuthContext);
    const userRole = parseInt(currentUser.data.userRole);
    const userId = currentUser.data.id;

    const [messageApi, contextHolder] = message.useMessage();

    const [events, setEvents] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');

    const handleSearch = (selectedKeys, confirm) => {
        confirm();
        setSearchText(selectedKeys[0]);
    };

    const getUserFullName = (userId) => {
        const filteredUser = users.filter(item => item.id === parseInt(userId)).map(item => item.fullName);
        return filteredUser.length > 0 ? filteredUser[0] : 'N.A';
    }

    const getEventTime = (items) => {
        let eventStart = null;
        let eventEnd = null;
        if (items.length <= 0) {
            eventStart = dayjs();
            eventEnd = dayjs();
        } else {
            const timeFormat = 'HH:mm:ss';
            for (let i = 0; i < items.length; i++) {
                const startTime = dayjs(items[i].startTime, timeFormat);
                if (!eventStart || startTime.isBefore(eventStart)) {
                    eventStart = startTime;
                }
                const endTime = dayjs(items[i].endTime, timeFormat);
                if (!eventEnd || endTime.isAfter(eventEnd)) {
                    eventEnd = endTime;
                }
            }
        }
        return `${eventStart.format('HH:mm A').toString()} - ${eventEnd.format('HH:mm A').toString()}`;
    }

    const handleDeletes = () => {
        setLoading(true);
        axiosInstance
            .put(`/v1/auth/events/deletes`, {
                "access_token": currentUser.data.token,
                "ids": selectedRowKeys,
            })
            .then((res) => {
                const updatedEvents = events.filter(item => selectedRowKeys.indexOf(item.id) < 0);
                setEvents(updatedEvents);
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

    const rowSelection = userRole >= 4 ? {
        selectedRowKeys,
        onChange: onSelectChange,
    } : null;

    const hasSelected = selectedRowKeys.length > 0;

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    useEffect(() => {
        Promise
            .all([
                axiosInstance.get("/v1/auth/events", {
                    params: {
                        "access_token": currentUser.data.token,
                    },
                }),
                axiosInstance.get("/v1/auth/evt-items", {
                    params: {
                        "access_token": currentUser.data.token,
                    },
                }),
                axiosInstance.get("/v1/auth/users", {
                    params: {
                        "access_token": currentUser.data.token,
                    },
                }),
            ])
            .then(([
                eventRes, evtItemRes, userRes,
            ]) => {
                let eventData = eventRes.data.rows;
                let evtItemData = evtItemRes.data.rows;
                let userData = userRes.data.rows;

                for (let i = 0; i < eventData.length; i++) {
                    eventData[i].key = eventData[i].id;
                    const currItems = evtItemData.filter(item => parseInt(item.eventId) === eventData[i].id);
                    eventData[i].eventTime = getEventTime(currItems);
                }

                setEvents(eventData);
                setUsers(userData);
            })
            .catch(err => {
                messageApi.error(err.response ? err.response.data : 'err');
            });
    }, [messageApi, currentUser])

    const handleDelete = (id) => {
        axiosInstance
            .delete(`/v1/auth/events/${id}`, {
                data: {
                    "access_token": currentUser.data.token,
                    "managerId": events.filter(item => item.id === parseInt(id))[0].managerId,
                },
            })
            .then((res) => {
                const updatedEvents = events.filter(item => item.id !== parseInt(id));
                setEvents(updatedEvents);
                messageApi.success(res ? res.data.result : 'ok');
            })
            .catch((err) => {
                console.log(err.response);
                messageApi.error(err.response ? err.response.data.message : 'err');
            });
    }

    const columns = [
        {
            title: 'Event Title',
            dataIndex: 'eventTitle',
            key: 'eventTitle',
            sorter: {
                compare: (a, b) => a.eventTitle.localeCompare(b.eventTitle),
            },
            filterDropdown: ({ selectedKeys, setSelectedKeys, confirm }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        ref={searchInput}
                        placeholder={`Search Event Title`}
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
                record.eventTitle.toString().toLowerCase().includes(value.toLowerCase()),
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
            title: 'Event Date',
            dataIndex: 'eventDate',
            key: 'eventDate',
            sorter: {
                compare: (a, b) => new Date(a.eventDate) - new Date(b.eventDate),
            },
        },
        {
            title: 'Event Time',
            dataIndex: 'eventTime',
            key: 'eventTime',
            sorter: {
                compare: (a, b) => a.eventTime.localeCompare(b.eventTime),
            },
        },
        {
            title: 'Event Host',
            dataIndex: 'hostId',
            key: 'hostId',
            sorter: {
                compare: (a, b) => getUserFullName(a.hostId).localeCompare(getUserFullName(b.hostId)),
            },
            filterDropdown: ({ selectedKeys, setSelectedKeys, confirm }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        ref={searchInput}
                        placeholder={`Search Event Host`}
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
                getUserFullName(record.hostId).toString().toLowerCase().includes(value.toLowerCase()),
            onFilterDropdownOpenChange: (visible) => {
                if (visible) {
                    setTimeout(() => searchInput.current?.select(), 100);
                }
            },
            render: (hostId) => (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: '#ffc069',
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={getUserFullName(hostId) ? getUserFullName(hostId).toString() : ''}
                />
            ),
        },
        {
            title: 'Manager',
            dataIndex: 'managerId',
            key: 'managerId',
            sorter: {
                compare: (a, b) => getUserFullName(a.managerId).localeCompare(getUserFullName(b.managerId)),
            },
            filterDropdown: ({ selectedKeys, setSelectedKeys, confirm }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        ref={searchInput}
                        placeholder={`Search Manager`}
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
                getUserFullName(record.managerId).toString().toLowerCase().includes(value.toLowerCase()),
            onFilterDropdownOpenChange: (visible) => {
                if (visible) {
                    setTimeout(() => searchInput.current?.select(), 100);
                }
            },
            render: (managerId) => (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: '#ffc069',
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={getUserFullName(managerId) ? getUserFullName(managerId).toString() : ''}
                />
            ),
        },
        {
            title: 'Action',
            key: 'action',
            width: '15%',
            render: (_, record) => userId === record.hostId || userId === record.managerId || userRole === 4 ? (
                <Space size="middle">
                    {contextHolder}
                    <Link to={`./${record.id}`}>
                        <Button>
                            <EditOutlined />
                        </Button>
                    </Link>
                    <Popconfirm title="Sure to delete?" hidden={userRole < 3} onConfirm={() => handleDelete(record.id)}>
                        <Button danger hidden={userRole < 3}><DeleteOutlined /></Button>
                    </Popconfirm>
                </Space>
            ) : (
                <Link to={`./${record.id}`}>
                    <Button>
                        <EyeOutlined />
                    </Button>
                </Link>
            ),
        },
    ];

    return (
        <div style={{ padding: 8, background: 'rgb(255, 255, 255)', }}>
            <div className='mb-4'>
                <Row>
                    <Col span={12} className='d-flex flex-row align-items-center'>
                        <Popconfirm title="Sure to delete?" hidden={userRole < 4} onConfirm={handleDeletes} disabled={!hasSelected}>
                            <Button disabled={!hasSelected} loading={loading} hidden={userRole < 4} size='large'>
                                <DeleteOutlined /> Delete Selected Event(s)
                            </Button>
                        </Popconfirm>
                        <span style={{ marginLeft: 8, fontSize: 16, }} >
                            {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
                        </span>
                    </Col>
                    <Col span={12}>
                        <AddEvent events={events} setEvents={setEvents} />
                    </Col>
                </Row>
            </div>
            <Table rowSelection={rowSelection} columns={columns} dataSource={events}
                style={{
                    backgroundColor: colorBgContainer,
                }} />
        </div>
    )
}
