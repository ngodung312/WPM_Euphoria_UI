import React, { useContext, useEffect, useState } from 'react'
import { axiosInstance } from '../../context/axiosConfig';
import { Space, Table, Button, message, theme, Row, Col } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';

export const AlbumList = () => {
    const { currentUser } = useContext(AuthContext);
    const [albums, setAlbums] = useState([])
    const [messageApi, contextHolder] = message.useMessage();

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [loading, setLoading] = useState(false);
    const handleDeletes = () => {
        setLoading(true);
        
        axiosInstance
            .put(`/v1/auth/albums/deletes`, {
                "access_token": currentUser.data.token,
                "ids": selectedRowKeys,
            })
            .then((res) => {
                window.location.reload();
            })
            .catch((err) => {
                messageApi.error(err.response.data);
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
        const fetchAllAlbums = () => {
            axiosInstance
                .get("/v1/auth/albums", {
                    params: {
                        "access_token": currentUser.data.token,
                    },
                })
                .then((res) => {
                    let albumData = res.data.rows;
                    for (let i = 0; i < albumData.length; i++) {
                        albumData[i].key = albumData[i].id;
                    }
                    setAlbums(albumData);
                })
                .catch((err) => {
                    messageApi.error(err.response.data.message);
                });
        }
        fetchAllAlbums()
    }, [messageApi, currentUser])

    const handleDelete = (id) => {
        axiosInstance
            .delete(`/v1/auth/albums/${id}`, {
                data: {
                    "access_token": currentUser.data.token,
                },
            })
            .then((res) => {
                window.location.reload()
            })
            .catch((err) => {
                messageApi.error(err.response.data);
            });
    }

    const columns = [
        {
            title: 'Album Title',
            dataIndex: 'albumTitle',
            key: 'albumTitle',
        },
        {
            title: 'Album Size',
            dataIndex: 'albumSize',
            key: 'albumSize',
        },
        {
            title: 'Event ID',
            dataIndex: 'eventId',
            key: 'eventId',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    {contextHolder}
                    <Link to={`./${record.id}`}>
                        <Button>
                            <EditOutlined />
                        </Button>
                    </Link>
                    <Button onClick={() => handleDelete(record.id)} danger><DeleteOutlined /></Button>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: 8, background: 'rgb(255, 255, 255)', }}>
            <div style={{ marginBottom: 16, }} >
                <Row>
                    <Col span={12}>
                        <Button danger onClick={handleDeletes} disabled={!hasSelected} loading={loading}>
                            Delete Selected Album(s) <DeleteOutlined />
                        </Button>
                        <span style={{ marginLeft: 8, }} >
                            {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
                        </span>
                    </Col>
                    <Col span={12}>
                        <Link to={"./add"}>
                            <Button style={{ float: 'right' }}>
                                Add Album <PlusOutlined />
                            </Button>
                        </Link>
                    </Col>
                </Row>


            </div>
            <Table rowSelection={rowSelection} columns={columns} dataSource={albums}
                style={{
                    backgroundColor: colorBgContainer,
                }} />
        </div>
    )
}
