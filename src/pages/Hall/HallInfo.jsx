import { useContext, useEffect, useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Card, Col, ConfigProvider, Divider, Form, Image, Input, Row, Upload, message, theme } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useLocation } from 'react-router-dom'
import AWS from 'aws-sdk';

import { axiosInstance } from '../../context/axiosConfig';
import { AuthContext } from '../../context/authContext';
import { MapTable } from '../../components/Tables/MapTable';

const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

export const HallInfo = () => {
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const { currentUser } = useContext(AuthContext);
    const defaultImg = "data:image/png;base64,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";
    const folderUrl = `${currentUser.data.bucketUrl}/halls`;
    const awsConfig = currentUser.data.awsConfig;
    const bucketName = currentUser.data.s3BucketName;
    const subfolder = 'halls';
    const s3 = new AWS.S3(awsConfig);

    const location = useLocation();
    const hallId = location.pathname.split('/').pop();
    const [hallForm] = Form.useForm();

    const [messageApi, contextHolder] = message.useMessage();
    const [hall, setHall] = useState({});
    const [maps, setMaps] = useState([]);
    const [currMap, setCurrMap] = useState({});
    const [imgSource, setImgSource] = useState(defaultImg);
    const [hallImage, setHallImage] = useState({})

    useEffect(() => {
        Promise
            .all([
                axiosInstance.get(`/v1/auth/halls/${hallId}`, {
                    params: {
                        "access_token": currentUser.data.token,
                    },
                }),

                axiosInstance.get("/v1/auth/maps", {
                    params: {
                        "access_token": currentUser.data.token,
                        "hallId": hallId,
                    },
                })
            ])
            .then(([hallRes, mapRes]) => {
                const hallData = hallRes.data.data;
                if (hallData.hallUrl) {
                    setImgSource(`${folderUrl}/${hallData.hallUrl}`);
                }
                hallForm.setFieldsValue(hallData);
                setHall(hallData);

                const mapData = mapRes.data.rows;
                for (let i = 0; i < mapData.length; i++) {
                    mapData[i].key = mapData[i].id;
                }
                setMaps(mapData);
                if (mapData.length > 0) {
                    setCurrMap(mapData[0]);
                }
            })
            .catch(err => {
                messageApi.error(err.response.data.message);
            });
    }, [hallId, messageApi, currentUser, hallForm, folderUrl]);

    const handleUploadToS3 = async () => {
        const file = hallImage.originFileObj;
        try {
            const params = {
                Bucket: bucketName,
                Key: `${subfolder}/${file.uploaded}_${hall.id}_${hall.hallTitle.replaceAll(' ', '-').toLowerCase()}`,
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

    const onFinish = (values) => {
        values["access_token"] = currentUser.data.token;
        // console.log(values);
        if (hallImage.originFileObj) {
            values["hallUrl"] = `${hallImage.originFileObj.uploaded}_${hall.id}_${hall.hallTitle.replaceAll(' ', '-').toLowerCase()}`;
        } else {
            values["hallUrl"] = hall.hallUrl;
        }
        if (values["hallUrl"] !== hall.hallUrl) {
            if (hall.hallUrl) {
                handleDeleteFromS3(hall.hallUrl);
            }
            handleUploadToS3();
        }

        axiosInstance
            .put(`/v1/auth/halls/${hallId}`, values)
            .then((res) => {
                messageApi.success(res ? res.data.result : 'ok');
            })
            .catch((err) => {
                messageApi.error(err.response ? err.response.data.message : 'err');
            });
    };

    const handleImgUpload = async (info) => {
        const fileData = info.fileList[0];
        if (fileData.status !== 'uploading') {
            fileData.preview = await getBase64(fileData.originFileObj);
            // console.log(info.file, info.fileList);
            const timestamp = new Date().getTime();
            fileData.originFileObj.uploaded = timestamp;
            setImgSource(fileData.preview);
            setHallImage(fileData);
        }
        if (fileData.status === 'done') {
            messageApi.success(`${fileData.name} file uploaded successfully`);
        } else if (fileData.status === 'error') {
            messageApi.error(`${fileData.name} file upload failed.`);
        }
    };

    return (
        <div style={{
            backgroundColor: colorBgContainer,
            padding: "2vb",
        }}
        >
            <ConfigProvider theme={{
                token: {
                    colorSplit: '#BCA79B',
                    colorText: '#373425',
                    colorTextHeading: '#373425',
                },
            }}>
                <Form
                    name="basic"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    form={hallForm}
                    initialValues={hall}
                    onFinish={onFinish}
                >
                    {contextHolder}
                    <Row justify="space-around">
                        <Col span={11}>
                            <Upload
                                beforeUpload={() => false}
                                listType="picture"
                                maxCount={1}
                                onChange={handleImgUpload}
                                showUploadList={false}
                            >
                                <Button size='large' icon={<UploadOutlined />}>Upload Hall Image</Button>
                            </Upload>
                        </Col>
                        <Col span={11}>
                            <Form.Item style={{ marginBottom: '2vb', display: 'flex', justifyContent: 'flex-end' }}>
                                <Button type="primary" htmlType="submit" size="large">Update</Button>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row justify="space-around">
                        <Col span={23}>
                            <Divider
                                orientation="left"
                                style={{
                                    fontSize: 20,
                                    margin: "15px 0 25px 0",
                                }}
                            >General Information</Divider>
                        </Col>
                    </Row>

                    <Row justify="space-around">
                        <Col span={9}>
                            <Image
                                width="100%"
                                src={imgSource}
                            />
                        </Col>
                        <Col span={13}>
                            <Form.Item
                                name="hallTitle"
                                label="Hall Title"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input hall title!',
                                    },
                                ]}
                            >
                                <Input type="text" placeholder="Hall Title" size="large" />
                            </Form.Item>
                            <Form.Item
                                name="numTables"
                                label="Number of Tables"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input number of tables!',
                                    },
                                ]}
                            >
                                <Input type="number" placeholder="Number of Tables" size="large" />
                            </Form.Item>
                            <Form.Item
                                name="hallDesc"
                                label="Hall Description"
                            >
                                <TextArea rows={6} placeholder="Hall Description" size="large" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row justify="space-around">
                        <Col span={23}>
                            <Divider
                                orientation="left"
                                style={{
                                    fontSize: 20,
                                    margin: "25px 0 25px 0",
                                }}
                            >Map Information</Divider>
                        </Col>
                    </Row>

                    <Row justify="space-around">
                        <Col span={8}>
                            <MapTable
                                maps={maps}
                                setMaps={setMaps}
                                hallId={hallId}
                                currMap={currMap}
                                setCurrMap={setCurrMap}
                            />
                        </Col>
                        <Col span={14}>
                            <Card
                                title={currMap.mapTitle || 'N.A'}
                            >
                                <Image
                                    src={currMap.mapUrl ? `${currentUser.data.bucketUrl}/maps/${currMap.mapUrl}` : defaultImg}
                                    width='100%' />
                            </Card>
                        </Col>
                    </Row>
                </Form>
            </ConfigProvider>
        </div>
    )
}
