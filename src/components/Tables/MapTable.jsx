import React, { useContext, useRef, useState } from 'react'
import { Table, Button, Input, Space, Form, Row, Col, Modal, Image, Upload, message } from 'antd';
import { SearchOutlined, EditOutlined, EyeOutlined, UploadOutlined, PlusOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import TextArea from 'antd/es/input/TextArea';
import { AuthContext } from '../../context/authContext';
import { axiosInstance } from '../../context/axiosConfig';
import AWS from 'aws-sdk';

const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

export const MapTable = ({ maps, setMaps, hallId, currMap, setCurrMap }) => {
    const [mapForm] = Form.useForm()
    const [messageApi, contextHolder] = message.useMessage();

    const { currentUser } = useContext(AuthContext);
    const defaultImg = "data:image/png;base64,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";
    const folderUrl = `${currentUser.data.bucketUrl}/maps`;
    const awsConfig = currentUser.data.awsConfig;
    const bucketName = currentUser.data.s3BucketName;
    const subfolder = 'maps';
    const s3 = new AWS.S3(awsConfig);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [mapImage, setMapImage] = useState({})
    const [imgSource, setImgSource] = useState(defaultImg);
    const [isCreated, setIsCreated] = useState(false);


    const searchInput = useRef(null);
    const [searchText, setSearchText] = useState('');
    const handleSearch = (selectedKeys, confirm) => {
        confirm();
        setSearchText(selectedKeys[0]);
    };

    const handleUploadToS3 = async () => {
        const file = mapImage.originFileObj;
        try {
            const params = {
                Bucket: bucketName,
                Key: `${subfolder}/${file.uploaded}_${mapForm.getFieldValue('mapTitle').replaceAll(' ', '-').toLowerCase()}`,
                Body: file,
            };

            await s3.upload(params).promise();
            messageApi.success(`${file.name} uploaded successfully`);
        } catch (error) {
            messageApi.error(`Error uploading ${file.name}`);
        }
    };

    const handleDeleteFromS3 = async (fileName) => {
        try {
            const params = {
                Bucket: bucketName,
                Key: `${subfolder}/${fileName}`
            };

            await s3.deleteObject(params).promise();
            messageApi.success(`${fileName} deleted successfully`);
        } catch (error) {
            messageApi.error(`Error deleting ${fileName}`);
        }
    };

    const handleMapSubmit = (values) => {
        setSubmitLoading(true);
        if (imgSource === defaultImg) {
            messageApi.error(`Please upload an image!`);
            setSubmitLoading(false);
            return;
        }

        if (isCreated) delete values.id;
        let mapData = {
            ...values,
            "mapUrl": mapImage.originFileObj ? `${mapImage.originFileObj.uploaded}_${mapForm.getFieldValue('mapTitle').replaceAll(' ', '-').toLowerCase()}` : currMap.mapUrl,
            "hallId": hallId,
        }
        // console.log(mapData);

        if (mapImage.originFileObj) {
            const initMap = maps.filter(item => item.id === mapData.id).map(item => item.mapUrl);
            if (isCreated || currMap.mapUrl !== mapData.mapUrl) {
                if (!isCreated & initMap.length > 0) {
                    handleDeleteFromS3(initMap[0]);
                }
                handleUploadToS3();
            }
        }


        const axiosReq = isCreated ? (
            axiosInstance.post("/v1/auth/maps", {
                "access_token": currentUser.data.token,
                ...mapData
            })
        ) : (
            axiosInstance.put(`/v1/auth/maps/${mapData.id}`, {
                "access_token": currentUser.data.token,
                ...mapData
            })
        )

        axiosReq.then((res) => {
            mapData = {
                ...mapData,
                id: parseInt(res.data.data.id),
                key: parseInt(res.data.data.id)
            };
            if (isCreated) {
                setMaps([...maps, mapData]);
            } else {
                const updatedMaps = maps.filter(item => item.id !== mapData.id);
                setMaps([...updatedMaps, mapData]);
            }
            messageApi.success(res ? res.data.result : 'ok');
            mapForm.resetFields();
            setIsModalOpen(false);
            setSubmitLoading(false);
        }).catch((err) => {
            messageApi.error(err.response ? err.response.data.message : 'err');
            setSubmitLoading(false);
        });
    };

    const showMapModal = (data) => {
        // console.log(data);
        if (data.mapUrl) {
            setImgSource(`${folderUrl}/${data.mapUrl}`);
        }
        mapForm.setFieldsValue(data);
        setIsModalOpen(true);
    };

    const handleModalCancel = () => {
        setIsModalOpen(false);
    };

    const handleImgUpload = async (info) => {
        const fileData = info.fileList[0];
        if (fileData.status !== 'uploading') {
            fileData.preview = await getBase64(fileData.originFileObj);
            // console.log(info.file, info.fileList);
            const timestamp = new Date().getTime();
            fileData.originFileObj.uploaded = timestamp;
            setImgSource(fileData.preview);
            setMapImage(fileData);
        }
        if (fileData.status === 'done') {
            messageApi.success(`${fileData.name} file uploaded successfully`);
        } else if (fileData.status === 'error') {
            messageApi.error(`${fileData.name} file upload failed.`);
        }
    };

    const MapForm = ({ form, onFinish }) => {
        return (
            <Form
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                form={form}
                onFinish={onFinish}
            >
                <Form.Item name="id" hidden>
                    <Input type="number" />
                </Form.Item>

                <Form.Item
                    name="mapTitle"
                    label="Map Title"
                    rules={[
                        {
                            required: true,
                            message: 'Please input map title!',
                        },
                    ]}
                >
                    <Input type="text" placeholder="Map Title" size="large" />
                </Form.Item>

                <Form.Item
                    name="mapDesc"
                    label="Map Description"
                    style={{ marginBottom: '0' }}
                >
                    <TextArea rows={4} placeholder="Map Description" size="large" />
                </Form.Item>
            </Form>
        )
    }

    const columns = [
        {
            title: 'Map List',
            dataIndex: 'mapTitle',
            key: 'mapTitle',
            width: '75%',
            filterDropdown: ({ selectedKeys, setSelectedKeys, confirm }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        ref={searchInput}
                        placeholder={`Search Map Title`}
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
                        margin: '0 12px'
                    }}
                />
            ),
            onFilter: (value, record) =>
                record.mapTitle.toString().toLowerCase().includes(value.toLowerCase()),
            onFilterDropdownOpenChange: (visible) => {
                if (visible) {
                    setTimeout(() => searchInput.current?.select(), 100);
                }
            },
            render: (text, record) => (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Space direction='vertical'>
                        <Highlighter
                            highlightStyle={{
                                backgroundColor: '#ffc069',
                                padding: 0,
                                fontSize: '16px'
                            }}
                            unhighlightStyle={{
                                fontSize: '16px'
                            }}
                            searchWords={[searchText]}
                            autoEscape
                            textToHighlight={text ? text.toString() : ''}
                        />
                        <span style={{ color: 'grey' }}>{record.mapDesc ? record.mapDesc : 'N.A'}</span>
                    </Space>
                    <Space direction='vertical'>
                        <Button
                            size='small'
                            onClick={() => {
                                setIsCreated(false);
                                showMapModal(record);
                            }}
                        >
                            <EditOutlined />
                        </Button >
                        <Button
                            size='small'
                            disabled={record.id === currMap.id ? true : false}
                            onClick={() => setCurrMap(record)}
                        >
                            <EyeOutlined />
                        </Button >
                    </Space>
                </div>
            )
        },
    ];

    return (
        <div>
            {contextHolder}
            <Table
                columns={columns}
                dataSource={maps}
                bordered
                pagination={false}
            />
            <Button
                onClick={() => {
                    setIsCreated(true);
                    showMapModal({
                        mapTitle: '',
                        mapDesc: '',
                        mapUrl: ''
                    });
                }}
                style={{ marginTop: '3vb' }}
            ><PlusOutlined /> Add a Map</Button>
            <Modal
                title={isCreated ? 'Add New Map' : 'Update Map'}
                open={isModalOpen}
                onCancel={handleModalCancel}
                width='45vw'
                footer={
                    <div style={{ display: 'flex', justifyContent: 'space-between', margin: '3vb 2vb 1vb 2vb' }}>
                        <Upload
                            beforeUpload={() => false}
                            listType="picture"
                            maxCount={1}
                            onChange={handleImgUpload}
                            showUploadList={false}
                        >
                            <Button className='mx-3' icon={<UploadOutlined />}>Upload</Button>
                        </Upload>

                        <Button key="submit" type="primary" loading={submitLoading} onClick={() => mapForm.submit()}>
                            {isCreated ? 'Add' : 'Update'}
                        </Button>
                    </div>
                }
            >
                <Row justify='space-between' style={{ padding: '2vb 2vb 0 2vb' }}>
                    <Col span={10}>
                        <Image
                            width="100%"
                            height="100%"
                            style={{ objectFit: 'cover' }}
                            src={imgSource}
                        />
                    </Col>

                    <Col span={13}>
                        <MapForm form={mapForm} onFinish={handleMapSubmit} />

                        {/* <Row justify='space-between' style={{ marginTop: '4vb' }}>
                                        <Col span={12}>
                                            <Upload
                                                beforeUpload={() => false}
                                                listType="picture"
                                                maxCount={1}
                                                onChange={handleImgUpload}
                                                showUploadList={false}
                                            >
                                                <Button size='large' icon={<UploadOutlined />}>Upload</Button>
                                            </Upload>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                <Button type="primary" htmlType="submit" size="large">Update</Button>
                                            </Form.Item>
                                        </Col>
                                    </Row> */}
                    </Col>
                </Row>
            </Modal>
        </div>
    )
}
