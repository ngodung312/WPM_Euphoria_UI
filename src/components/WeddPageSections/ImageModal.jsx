import { Button, Form, Image, Input, Modal, Select, Space, Table } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { axiosInstance } from '../../context/axiosConfig';

export const ImageModal = ({
    editingImg, setEditingImg, imageForm, handleImageForm, albumOptions, images, setImages,
    submitLoading, isOpen, setIsOpen, currentUser, messageApi
}) => {
    let albumUrl = currentUser ? `${currentUser.data.bucketUrl}/albums` : null;

    const [albumImgs, setAlbumImgs] = useState([]);
    const searchInput = useRef(null);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        if (albumOptions) {
            axiosInstance.get("/images", {
                params: {
                    "albumId": albumOptions.map(item => item.key),
                },
            }).then((res) => {
                let imageData = res.data.rows;
                let currAlbum = albumUrl ? albumUrl : `${res.data.bucketUrl}/albums`;
                imageData = imageData.map((img) => {
                    return {
                        ...img,
                        key: img.id,
                        imageUrl: `${currAlbum}/${img.imageUrl}`,
                    };
                });
                setImages(imageData);
            }).catch((err) => {
                messageApi.error(err.response ? err.response.data : 'err');
            });
        }
    }, [albumOptions, albumUrl, currentUser, messageApi, setImages]);

    const handleSearch = (selectedKeys, confirm) => {
        confirm();
        setSearchText(selectedKeys[0]);
    };

    const handleImageSelect = (imageId) => {
        setEditingImg({ ...editingImg, infoValue: imageId });
    }

    const handleAlbumSelect = (albumId) => {
        setAlbumImgs(images.filter(item => item.albumId === albumId));
    }

    const columns = [
        {
            title: 'Image List',
            dataIndex: 'imageTitle',
            key: 'imageTitle',
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
                        padding: 8
                    }}
                />
            ),
            onFilter: (value, record) =>
                record.dishTitle.toString().toLowerCase().includes(value.toLowerCase()),
            onFilterDropdownOpenChange: (visible) => {
                if (visible) {
                    setTimeout(() => searchInput.current?.select(), 100);
                }
            },
            render: (text, record) => (
                <div className='d-flex justify-content-between'>
                    <Space size="middle">
                        <Image src={record.imageUrl} width="12vb" />
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
                    <Space size="middle">
                        <Button
                            size='small'
                            disabled={parseInt(editingImg.infoValue) === record.id}
                            onClick={() => handleImageSelect(record.id)}
                        >
                            <PlusOutlined />
                        </Button>
                    </Space>
                </div>
            )
        },
    ];

    const ImageForm = ({ form, onFinish }) => {
        return (
            <Form
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                form={form}
                onFinish={onFinish}
            >
                <Row>
                    <Col md={6}>
                        <Form.Item
                            name='albumId'
                            rules={[
                                {
                                    required: true,
                                    message: 'Please select an album!',
                                },
                            ]}
                        >
                            <Select
                                size='large'
                                placeholder='Select an Album'
                                onChange={handleAlbumSelect}
                            >
                                {albumOptions.map(item => (
                                    <Select.Option key={item.key} value={item.value}>{item.label}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Table
                    size='small'
                    className='mb-4'
                    columns={columns}
                    dataSource={albumImgs}
                    bordered
                    scroll={{
                        y: '60vh',
                    }}
                    pagination={false} />
            </Form>
        )
    };

    return (
        <>

            <Modal
                id='imageModal'
                centered
                open={isOpen}
                onCancel={() => setIsOpen(false)}
                footer={[
                    <Button key="back" onClick={() => setIsOpen(false)}>
                        Return
                    </Button>,

                    <Button key="submit" type="primary" loading={submitLoading} onClick={() => imageForm.submit()}>
                        Update
                    </Button>
                ]}
            >
                <ImageForm form={imageForm} onFinish={handleImageForm} />
            </Modal>
        </>
    )
}
