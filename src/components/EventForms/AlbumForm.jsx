import { Button, Card, Col, Form, Input, message, Modal, Popconfirm, Row, Table, Upload, ConfigProvider } from 'antd'
import { EditOutlined, DeleteOutlined, PlusOutlined, ArrowLeftOutlined, InfoCircleOutlined, InboxOutlined, EyeOutlined } from '@ant-design/icons';
import React, { useContext, useState } from 'react'
import AWS from 'aws-sdk';
import Dragger from 'antd/es/upload/Dragger';
import { axiosInstance } from '../../context/axiosConfig';
import { AuthContext } from '../../context/authContext';


const originData = [];
for (let i = 0; i < 10; i++) {
    originData.push({
        key: i.toString(),
        albumTitle: `Edward ${i}`,
        albumDesc: `Desc about Edward ${i}`,
        albumSize: i,
    });
}

// const originFiles = [
//     {
//         uid: '-1',
//         name: 'image.png',
//         status: 'done',
//         url: 'https://wpm-images.s3.ap-southeast-1.amazonaws.com/albums/1244666801000_img17.jpg',
//     },
//     {
//         uid: '-2',
//         name: 'image.png',
//         status: 'done',
//         url: 'https://wpm-images.s3.ap-southeast-1.amazonaws.com/albums/1247549551000_Chrysanthemum.jpg',
//     },
//     {
//         uid: '-3',
//         name: 'image.png',
//         status: 'done',
//         url: 'https://wpm-images.s3.ap-southeast-1.amazonaws.com/albums/1247549551000_Jellyfish.jpg',
//     },
// ]

const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

export const AlbumForm = ({
    isViewMode, albumForm, eventId, albums, setAlbums,
    images, setImages, delImageIds, setDelImageIds,
    contextHolder, isHidden, onFinish
}) => {
    const { TextArea } = Input;

    const { currentUser } = useContext(AuthContext);
    const albumUrl = `${currentUser.data.bucketUrl}/albums`;
    const awsConfig = currentUser.data.awsConfig;
    const bucketName = currentUser.data.s3BucketName;
    const subfolder = 'albums';
    const s3 = new AWS.S3(awsConfig);

    const [albumModalOpen, setAlbumModalOpen] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [isListHidden, setIsListHidden] = useState(false);
    const [isInfoHidden, setIsInfoHidden] = useState(true);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState([]);
    const [delImgUrls, setDelImgUrls] = useState([]);
    const [sumImgSize, setSumImgSize] = useState(0);

    const [newAlbumForm] = Form.useForm();

    const handleNewAlbum = (values) => {
        setSubmitLoading(true);
        let newAlbum = {
            ...values,
            "albumSize": sumImgSize,
            "eventId": eventId,
        }

        axiosInstance.post("/v1/auth/albums", {
            "access_token": currentUser.data.token,
            ...newAlbum
        }).then((res) => {
            newAlbum = {
                id: res.data.data.id,
                ...newAlbum,
                key: res.data.data.id
            };
            setAlbums([...albums, newAlbum]);
            message.success(res ? res.data.result : 'ok');
            setAlbumModalOpen(false);
            setSubmitLoading(false);
        }).catch((err) => {
            message.error(err.response ? err.response.data.message : 'err');
            setSubmitLoading(false);
        });
    };

    const NewAlbumForm = ({ form, onFinish }) => {
        return (
            <Form
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                form={form}
                onFinish={onFinish}
            >
                <Form.Item
                    name="albumTitle"
                    label="Album Title"
                    rules={[
                        {
                            required: true,
                            message: 'Please input album title!',
                        },
                    ]}
                >
                    <Input type="text" placeholder="Album Title" size="large" />
                </Form.Item>

                <Form.Item
                    name="albumDesc"
                    label="Album Description"
                >
                    <TextArea rows={4} placeholder="Album Description" size="large" />
                </Form.Item>
            </Form>
        )
    }

    const handleUploadToS3 = async (file) => {
        try {
            const params = {
                Bucket: bucketName,
                Key: `${subfolder}/${file.uploaded}_${albumForm.getFieldValue('id')}_${file.name}`,
                Body: file,
            };

            await s3.upload(params).promise();
            message.success(`${file.name} uploaded successfully`);
        } catch (error) {
            // console.error('Error uploading file:', error);
            message.error(`Error uploading ${file.name}`);
        }
    };

    const handleDeleteFromS3 = async (fileName) => {
        try {
            const params = {
                Bucket: bucketName,
                Key: `${subfolder}/${fileName}`
            };

            await s3.deleteObject(params).promise();
            message.success(`${fileName} deleted successfully`);
        } catch (error) {
            // console.error('Error uploading file:', error);
            // message.error(`Error deleting ${fileName}`);
        }
    };

    const handleSubmit = () => {
        const newFiles = fileList.filter(item => item.hasOwnProperty('originFileObj')).map(item => item.originFileObj);
        for (let i = 0; i < newFiles.length; i++) {
            handleUploadToS3(newFiles[i]);
        }
        for (let i = 0; i < delImgUrls.length; i++) {
            handleDeleteFromS3(delImgUrls[i]);
        }
        onFinish(albumForm.getFieldsValue());
    }

    const handleImageUpload = (info) => {
        const { status } = info.file;
        if (status !== 'uploading') {
            // console.log("NEW FILE:", info.file, info.fileList);
            const newFiles = info.fileList.filter(newImg => !fileList.find(img => img.uid === newImg.uid));
            let newImgData = [];
            for (let i = 0; i < newFiles.length; i++) {
                const currFile = newFiles[i];
                const timestamp = new Date().getTime();
                currFile.originFileObj.uploaded = timestamp;
                newImgData.push({
                    imageTitle: currFile.name,
                    imageDesc: currFile.uid,
                    imageSize: currFile.size || 0,
                    imageUrl: `${timestamp}_${albumForm.getFieldValue('id')}_${currFile.name}`,
                    albumId: albumForm.getFieldValue('id')
                });
            }
            let newImgList = [...images, ...newImgData];
            setImages(newImgList);
            setFileList([...fileList, ...newFiles]);
            setSumImgSize(newImgList.reduce((sum, item) => sum + item.imageSize, 0));
            albumForm.setFieldValue('albumSize', newImgList.reduce((sum, item) => sum + item.imageSize, 0));
        }
        if (status === 'done') {
            message.success(`${info.file.name} file uploaded successfully.`);
        } else if (status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    }

    const handleCancel = () => setPreviewOpen(false);

    const handleImgPreview = async (file) => {
        // console.log(file);
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };

    const handleImgChange = ({ fileList: newFileList }) => {
        let deletedImgUid = fileList.filter(img => !newFileList.find(newImg => newImg.uid === img.uid));
        deletedImgUid = deletedImgUid.length > 0 ? deletedImgUid.map(item => item.uid)[0] : null;
        const deletedImage = images.filter((item) => item.imageDesc === deletedImgUid);
        if (deletedImage.length > 0) {
            let newImages = images.filter((item) => item.imageDesc !== deletedImage[0].imageDesc);
            setImages(newImages);
            setDelImgUrls([...delImgUrls, deletedImage[0].imageUrl]);
            if (deletedImage[0].hasOwnProperty('id')) {
                setDelImageIds([...delImageIds, deletedImage[0].id]);
            }
            albumForm.setFieldValue('albumSize', newImages.reduce((sum, item) => sum + item.imageSize, 0));
        }
        setFileList(newFileList);
    };

    const showAlbumModal = () => {
        setAlbumModalOpen(true);
    };

    const handleModalCancel = () => {
        setAlbumModalOpen(false);
    };

    const handleAlbumUpdate = (record) => {
        setIsListHidden(true);
        setIsInfoHidden(false);
        albumForm.setFieldsValue({
            id: record.id,
            albumTitle: record.albumTitle || '',
            albumDesc: record.albumDesc || '',
            albumSize: sumImgSize || 0,
            eventId: eventId
        });

        axiosInstance.get("/images", {
            params: {
                "access_token": currentUser.data.token,
                "albumId": record.id,
            },
        }).then((res) => {
            let imageData = res.data.rows;
            let imgFileList = [];
            for (let i = 0; i < imageData.length; i++) {
                imageData[i].key = imageData[i].id;
                imgFileList.push({
                    uid: imageData[i].imageDesc,
                    name: imageData[i].imageTitle,
                    status: 'done',
                    url: `${albumUrl}/${imageData[i].imageUrl}`
                });
            }
            setImages(imageData);
            setFileList(imgFileList);
            setSumImgSize(imageData.reduce((sum, item) => sum + item.imageSize, 0));
            albumForm.setFieldValue('albumSize', imageData.reduce((sum, item) => sum + item.imageSize, 0));
        }).catch((err) => {
            message.error(err.response.data.message);
        });
    };

    const handleDelete = (key) => {
        const delItem = albums.filter((item) => item.key === key).map(item => item.id);
        if (delItem.length > 0) {
            axiosInstance.delete(`/v1/auth/albums/${delItem[0]}`, {
                data: {
                    "access_token": currentUser.data.token,
                },
            }).then((res) => {
                message.success(res ? res.data.result : 'ok');
                const newData = albums.filter((item) => item.key !== key);
                setAlbums(newData);
                setSumImgSize(newData.reduce((sum, item) => sum + item.imageSize, 0));
            }).catch((err) => {
                message.error(err.response.data.message);
            });
        }
    };

    const handleBack = () => {
        setIsListHidden(false);
        setIsInfoHidden(true);
        setAlbums([...albums]);
    };

    const columns = [
        {
            title: 'Album Title',
            dataIndex: 'albumTitle',
            width: '30%',
            editable: true,
        },
        {
            title: 'Album Description',
            dataIndex: 'albumDesc',
            width: '40%',
            editable: true,
        },
        {
            title: 'Album Size',
            dataIndex: 'albumSize',
            width: '15%',
            editable: true,
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: (_, record) => {
                return isViewMode ? (
                    <Button size='small' onClick={() => handleAlbumUpdate(record)}>
                        <EyeOutlined />
                    </Button>
                ) : (
                    <Row justify='start'>
                        <Col span={8}>
                            <Button size='small' onClick={() => handleAlbumUpdate(record)}>
                                <EditOutlined />
                            </Button>
                        </Col>
                        <Col span={8}>
                            <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
                                <Button size='small' danger><DeleteOutlined /></Button>
                            </Popconfirm>
                        </Col>
                    </Row>
                );
            },
        },
    ];

    return (
        <div>
            <ConfigProvider
                theme={{
                    token: {
                        colorSplit: '#BCA79B',
                        colorText: '#373425',
                        colorTextHeading: '#373425',
                        colorTextDisabled: '#373425',
                    },
                }}
            >
                <Form
                    name="ablum"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    form={albumForm}
                    // onFinish={onFinish}
                    hidden={isHidden}
                >
                    {contextHolder}
                    <Form.Item name="formName" hidden>
                        <Input type="text" />
                    </Form.Item>

                    <div hidden={isListHidden}>
                        <Row justify='space-around' hidden={isViewMode}>
                            <Col span={23}>
                                <Button
                                    onClick={showAlbumModal}
                                    size='large'
                                >
                                    <PlusOutlined /> Add an Album
                                </Button>
                                <Modal
                                    title="New Album"
                                    open={albumModalOpen}
                                    onCancel={handleModalCancel}
                                    footer={[
                                        <Button key="back" onClick={handleModalCancel}>
                                            Return
                                        </Button>,

                                        <Button key="submit" type="primary" loading={submitLoading} onClick={() => newAlbumForm.submit()}>
                                            Submit
                                        </Button>
                                    ]}
                                >
                                    <NewAlbumForm form={newAlbumForm} onFinish={handleNewAlbum} />
                                </Modal>
                            </Col>
                        </Row>

                        <Row justify='space-around' style={{ marginTop: '3vb' }}>
                            <Col span={23}>
                                <Table
                                    bordered
                                    dataSource={albums}
                                    columns={columns}
                                    pagination={false}
                                    scroll={true}
                                />
                            </Col>
                        </Row>
                    </div>

                    <div hidden={isInfoHidden}>
                        <Row justify='space-around'>
                            <Col span={11}>
                                <Button
                                    onClick={handleBack}
                                    size='large'
                                >
                                    <ArrowLeftOutlined /> Back to Album List
                                </Button>
                            </Col>

                            <Col span={11}>
                                <Form.Item style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <Button type="primary" htmlType="submit" size="large" onClick={handleSubmit} hidden={isViewMode}>Update</Button>
                                </Form.Item>
                            </Col>
                        </Row>


                        <Form.Item name="id" hidden>
                            <Input type="number" />
                        </Form.Item>

                        <Form.Item name="eventId" hidden>
                            <Input type="number" />
                        </Form.Item>

                        {/* <Row justify='space-around' style={{ marginTop: '1vb' }}>
                        <Col span={23}>
                            <Divider
                                orientation="left"
                                style={{
                                    fontSize: 20,
                                    margin: "0 0 25px 0",
                                }}
                            >Album Information</Divider>
                        </Col>
                    </Row> */}

                        <Row justify="space-around">
                            <Col span={11}>
                                <Form.Item
                                    name="albumTitle"
                                    label="Album Title"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input album title!',
                                        },
                                    ]}
                                >
                                    <Input type="text" placeholder="Album Title" size="large" disabled={isViewMode} />
                                </Form.Item>
                            </Col>
                            <Col span={11}>
                                <Form.Item
                                    name="albumSize"
                                    label="Album Size"
                                    tooltip={{
                                        title: 'Album Size is calcuated automatically based on imported images.',
                                        icon: <InfoCircleOutlined />,
                                    }}
                                >
                                    <Input
                                        type="number"
                                        placeholder="Album Size"
                                        size="large"
                                        disabled />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row justify="space-around">
                            <Col span={23}>
                                <Form.Item
                                    name="albumDesc"
                                    label="Album Description"
                                >
                                    <TextArea rows={4} placeholder="Album Description" size="large" disabled={isViewMode} />
                                </Form.Item>
                            </Col>
                        </Row>

                        {/* <Row justify="space-around">
                        <Col span={23}>
                            <Button><PlusOutlined /> Add an Image</Button>
                        </Col>
                    </Row> */}

                        <Row justify="space-around" style={{ marginTop: '2vb' }}>
                            <Col span={23}>
                                <Card title="Image Gallery">
                                    {!isViewMode ? (
                                        <Dragger
                                            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                            name="image"
                                            multiple={true}
                                            showUploadList={false}
                                            beforeUpload={() => false}
                                            onChange={handleImageUpload}
                                            fileList={fileList}
                                            style={{ marginBottom: '3vb' }}
                                        >
                                            <p className="ant-upload-drag-icon">
                                                <InboxOutlined />
                                            </p>
                                            <p className="ant-upload-text">Click or drag file to this area to upload</p>
                                        </Dragger>

                                    ) : <></>}
                                    <Upload
                                        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                        listType="picture-card"
                                        onPreview={handleImgPreview}
                                        onChange={handleImgChange}
                                        showUploadList={{
                                            showRemoveIcon: !isViewMode,
                                        }}
                                        fileList={fileList} />

                                    <Modal open={previewOpen} centered title={previewTitle} footer={null} onCancel={handleCancel}>
                                        <img
                                            alt="example"
                                            style={{
                                                width: '100%',
                                            }}
                                            src={previewImage}
                                        />
                                    </Modal>
                                </Card>
                            </Col>
                        </Row>

                        {/* <input type="file" onChange={handleFileSelect} />
                    {file && (
                        <div style={{ marginTop: '10px' }}>
                            <button onClick={uploadToS3}>Upload</button>
                        </div>
                    )}
                    {imageUrl && (
                        <div style={{ marginTop: '10px' }}>
                            <img src={imageUrl} alt="uploaded" />
                        </div>
                    )} */}
                    </div>
                </Form>
            </ConfigProvider>

        </div>
    )
}
