import { UploadOutlined } from '@ant-design/icons';
import { Button, Col, Form, Image, Input, Row, Upload, message, theme } from 'antd';
import { axiosInstance } from '../../context/axiosConfig';
import { useContext, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom'
import { AuthContext } from '../../context/authContext';
import AWS from 'aws-sdk';

const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

export const DishInfo = () => {
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const { TextArea } = Input;

    const { currentUser } = useContext(AuthContext);
    const folderUrl = `${currentUser.data.bucketUrl}/dishes`;
    const awsConfig = currentUser.data.awsConfig;
    const bucketName = currentUser.data.s3BucketName;
    const subfolder = 'dishes';
    const s3 = new AWS.S3(awsConfig);

    const location = useLocation()
    const dishId = location.pathname.split('/').pop();

    const form = useRef()

    const [messageApi, contextHolder] = message.useMessage();
    const [dish, setDish] = useState([])
    const [dishImage, setDishImage] = useState({})
    const [imgSource, setImgSource] = useState("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg==");

    useEffect(() => {
        const fetchDish = () => {
            axiosInstance
                .get(`/v1/auth/dishes/${dishId}`, {
                    params: {
                        "access_token": currentUser.data.token,
                    },
                })
                .then((res) => {
                    const dishData = res.data.data;
                    setDish(dishData);
                    if (dishData.dishUrl) {
                        setImgSource(`${folderUrl}/${dishData.dishUrl}`);
                    }
                    form.current.resetFields();
                })
                .catch((err) => {
                    messageApi.error(err.response.data.message);
                });
        }
        fetchDish()
    }, [dishId, messageApi, currentUser, folderUrl]);

    const handleUploadToS3 = async () => {
        const file = dishImage.originFileObj;
        try {
            const params = {
                Bucket: bucketName,
                Key: `${subfolder}/${file.uploaded}_${dish.id}_${dish.dishTitle.replaceAll(' ', '-').toLowerCase()}`,
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
        if (dishImage.originFileObj) {
            values["dishUrl"] = `${dishImage.originFileObj.uploaded}_${dish.id}_${dish.dishTitle.replaceAll(' ', '-').toLowerCase()}`;
        } else {
            values["dishUrl"] = dish.dishUrl;
        }
        if (values["dishUrl"] !== dish.dishUrl) {
            if (dish.dishUrl) {
                handleDeleteFromS3(dish.dishUrl);
            }
            handleUploadToS3();
        }
        // console.log(values);
        axiosInstance
            .put(`/v1/auth/dishes/${dishId}`, values)
            .then((res) => {
                messageApi.success(res ? res.data.result : 'ok');
            })
            .catch((err) => {
                messageApi.error(err.response ? err.response.data : 'err');
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
            setDishImage(fileData);
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
            <Form
                name="basic"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                ref={form}
                initialValues={dish}
                onFinish={onFinish}
            >
                {contextHolder}
                <Row justify='space-around'>
                    <Col span={9}>
                        <Image
                            width="100%"
                            src={imgSource}
                        />
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            name="dishTitle"
                            label="Dish Title"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input dish title!',
                                },
                            ]}
                        >
                            <Input type="text" placeholder="Dish Title" size="large" />
                        </Form.Item>

                        <Form.Item
                            name="dishDesc"
                            label="Dish Description"
                        >
                            <TextArea rows={4} placeholder="Dish Description" size="large" />
                        </Form.Item>

                        <Form.Item
                            name="dishPrice"
                            label="Dish Price ($)"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input dish price!',
                                },
                            ]}
                        >
                            <Input type="number" placeholder="Dish Price" size="large" />
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
                                <Form.Item style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <Button type="primary" htmlType="submit" size="large">Update</Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Form>
        </div>
    )
}
