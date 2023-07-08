import { UploadOutlined } from '@ant-design/icons';
import { Button, Col, ConfigProvider, Form, Image, Input, Row, Select, Upload, message, theme } from 'antd';
import { useContext, useEffect, useState } from 'react';
import AWS from 'aws-sdk';

import defaultAvatar from '../../assets/images/default-avatar.png';

import { axiosInstance } from '../../context/axiosConfig';
import { AuthContext } from '../../context/authContext';

const roleChoices = [
    { key: '1', value: '1', label: "Guest" },
    { key: '2', value: '2', label: "Event Host" },
    { key: '3', value: '3', label: "Manager" },
    { key: '4', value: '4', label: "Admin" },
]

const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

export const MyProfile = () => {
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const { currentUser, setCurrentUser } = useContext(AuthContext);
    const folderUrl = `${currentUser.data.bucketUrl}/users`;
    const awsConfig = currentUser.data.awsConfig;
    const bucketName = currentUser.data.s3BucketName;
    const subfolder = 'users';
    const s3 = new AWS.S3(awsConfig);

    const userId = currentUser.data.id;

    const [profileForm] = Form.useForm();

    const [messageApi, contextHolder] = message.useMessage();

    const [user, setUser] = useState([]);
    const [imgSource, setImgSource] = useState(defaultAvatar);
    const [avatar, setAvatar] = useState({});
    const [submitLoading, setSubmitLoading] = useState(false);

    useEffect(() => {
        setUser(currentUser.data);
        profileForm.setFieldsValue(currentUser.data);
        if (currentUser.data.avatar) {
            setImgSource(`${folderUrl}/${currentUser.data.avatar}`);
        }
    }, [userId, messageApi, currentUser, profileForm, setImgSource, folderUrl]);

    const onFinish = (values) => {
        setSubmitLoading(true);
        values["access_token"] = currentUser.data.token;
        if (avatar.originFileObj) {
            values["avatar"] = `${avatar.originFileObj.uploaded}_${currentUser.data.id}_${currentUser.data.username}`;
        } else {
            values["avatar"] = user.avatar;
        }
        // console.log(values);
        if (values["avatar"] !== user.avatar) {
            if (user.avatar) {
                handleDeleteFromS3(user.avatar);
            }
            handleUploadToS3();
        }
        window.setTimeout(() => {
            axiosInstance
                .put(`/v1/auth/users/${userId}`, values)
                .then((res) => {
                    messageApi.success(res ? res.data.result : 'ok');
                    setCurrentUser({
                        ...currentUser,
                        data: {
                            ...currentUser.data,
                            ...values,
                        }
                    });
                    setSubmitLoading(false);
                })
                .catch((err) => {
                    messageApi.error(err.response ? err.response.data : 'err');
                    setSubmitLoading(false);
                });
        }, 1000);
    };

    const handleUploadToS3 = async () => {
        const file = avatar.originFileObj;
        try {
            const params = {
                Bucket: bucketName,
                Key: `${subfolder}/${file.uploaded}_${currentUser.data.id}_${currentUser.data.username}`,
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

    const handleImgUpload = async (info) => {
        const fileData = info.fileList[0];
        if (fileData.status !== 'uploading') {
            fileData.preview = await getBase64(fileData.originFileObj);
            // console.log(info.file, info.fileList);
            const timestamp = new Date().getTime();
            fileData.originFileObj.uploaded = timestamp;
            setImgSource(fileData.preview);
            setAvatar(fileData);
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
                    colorTextDisabled: '#373425',
                },
            }}>
                <Form
                    name="user"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    form={profileForm}
                    initialValues={user}
                    onFinish={onFinish}
                >
                    {contextHolder}
                    <Row justify='space-around'>
                        <Col span={9}>
                            <Image
                                id='avatar'
                                src={imgSource}
                                width='100%'
                                height='62.5vb'
                                style={{
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                }}
                            />
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="username"
                                label="Username"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your Username!',
                                    },
                                ]}
                            >
                                <Input placeholder="Username" size="large" />
                            </Form.Item>

                            <Form.Item
                                name="fullName"
                                label="Full Name"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your Full Name!',
                                    },
                                ]}
                            >
                                <Input
                                    type="text"
                                    placeholder="Full Name"
                                    size="large"
                                />
                            </Form.Item>

                            <Form.Item
                                name="email"
                                label="Email"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your Email!',
                                    },
                                ]}
                            >
                                <Input
                                    type="email"
                                    placeholder="Email"
                                    size="large"
                                />
                            </Form.Item>

                            <Form.Item
                                name="phoneNumber"
                                label="Phone Number"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your Phone Number!',
                                    },
                                ]}
                            >
                                <Input
                                    type="number"
                                    placeholder="Phone Number"
                                    size="large"
                                />
                            </Form.Item>

                            <Form.Item
                                name="userRole"
                                label="User Role"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please select user role!',
                                    },
                                ]}
                            >
                                <Select
                                    size='large'
                                    disabled={true}
                                >
                                    {roleChoices.map(item => (
                                        <Select.Option key={item.key} value={item.value}>{item.label}</Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Row justify='space-between' style={{ marginTop: '4vb' }}>
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
                                    <Form.Item className='d-flex justify-content-end'>
                                        <Button type="primary" loading={submitLoading} htmlType="submit" size="large">
                                            Update
                                        </Button>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Form>
            </ConfigProvider>
        </div>
    )
}
