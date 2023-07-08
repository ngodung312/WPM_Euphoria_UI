import React, { useContext, useEffect, useState } from 'react'
import { axiosInstance } from '../../context/axiosConfig';
import { Space, Table, Button, message, theme, Row, Col } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';

export const ImageList = () => {
    const { currentUser } = useContext(AuthContext);
    const [images, setImages] = useState([])
    const [messageApi, contextHolder] = message.useMessage();

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [loading, setLoading] = useState(false);
    const handleDeletes = () => {
        setLoading(true);
        
        axiosInstance
            .put(`/v1/auth/images/deletes`, {
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
        const fetchAllImages = () => {
            axiosInstance
                .get("/images", {
                    params: {
                        "access_token": currentUser.data.token,
                    },
                })
                .then((res) => {
                    let imageData = res.data.rows;
                    for (let i = 0; i < imageData.length; i++) {
                        imageData[i].key = imageData[i].id;
                    }
                    setImages(imageData);
                })
                .catch((err) => {
                    messageApi.error(err.response.data.message);
                });
        }
        fetchAllImages()
    }, [messageApi, currentUser])

    const handleDelete = (id) => {
        axiosInstance
            .delete(`/v1/auth/images/${id}`, {
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
            title: 'Image Title',
            dataIndex: 'imageTitle',
            key: 'imageTitle',
        },
        {
            title: 'Image Size',
            dataIndex: 'imageSize',
            key: 'imageSize',
        },
        {
            title: 'Album ID',
            dataIndex: 'albumId',
            key: 'albumId',
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
                            Delete Selected Image(s) <DeleteOutlined />
                        </Button>
                        <span style={{ marginLeft: 8, }} >
                            {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
                        </span>
                    </Col>
                    <Col span={12}>
                        <Link to={"./add"}>
                            <Button style={{ float: 'right' }}>
                                Add Image <PlusOutlined />
                            </Button>
                        </Link>
                    </Col>
                </Row>


            </div>
            <Table rowSelection={rowSelection} columns={columns} dataSource={images}
                style={{
                    backgroundColor: colorBgContainer,
                }} />
        </div>
    )
}
