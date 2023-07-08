import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, message } from 'antd';
import { axiosInstance } from '../../context/axiosConfig';
import { useContext, useState } from 'react';
import { AuthContext } from '../../context/authContext';

export const FieldModal = ({ restaurantInfos, setRestaurantInfos, isEditing = null }) => {
    const { currentUser } = useContext(AuthContext);

    const [restaurantForm] = Form.useForm();

    const [messageApi, contextHolder] = message.useMessage();

    const [submitLoading, setSubmitLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleInfoField = (values) => {
        setSubmitLoading(true);
        values["access_token"] = currentUser.data.token;
        // console.log(values);
        if (isEditing !== null) {
            axiosInstance
                .put(`/v1/auth/restaurant-infos/${isEditing}`, values)
                .then((res) => {
                    let updatedField = {
                        ...values,
                        id: parseInt(res.data.data.id),
                        key: parseInt(res.data.data.id)
                    };
                    const fieldIdx = restaurantInfos.findIndex(item => item.id === updatedField.id);
                    let updatedResInfos = restaurantInfos;
                    updatedResInfos.splice(fieldIdx, 1, updatedField);
                    setRestaurantInfos([...updatedResInfos]);
                    messageApi.success(res ? res.data.result : 'ok');
                    setIsModalOpen(false);
                    setSubmitLoading(false);
                })
                .catch((err) => {
                    messageApi.error(err.response ? err.response.data : 'err');
                    setSubmitLoading(false);
                });
        } else {
            axiosInstance
                .post(`/v1/auth/restaurant-infos`, values)
                .then((res) => {
                    const newField = {
                        ...values,
                        id: parseInt(res.data.data.id),
                        key: parseInt(res.data.data.id)
                    };
                    delete newField["access_token"];
                    setRestaurantInfos([...restaurantInfos, newField]);
                    messageApi.success(res ? res.data.result : 'ok');
                    setIsModalOpen(false);
                    setSubmitLoading(false);
                })
                .catch((err) => {
                    messageApi.error(err.response ? err.response.data : 'err');
                    setSubmitLoading(false);
                });
        }
    };

    const handleAddModal = () => {
        setIsModalOpen(true);
        restaurantForm.setFieldsValue({
            infoLabel: null,
            infoValue: null,
        });
    }

    const handleEditModal = () => {
        setIsModalOpen(true);
        const filteredField = restaurantInfos.filter(item => item.id === parseInt(isEditing));
        if (filteredField.length > 0) {
            restaurantForm.setFieldsValue(filteredField[0]);
        }
    }


    const handleModalCancel = () => {
        setIsModalOpen(false);
    };

    const RestaurantForm = ({ form, onFinish }) => {
        return (
            <Form
                name="restaurant"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                form={form}
                onFinish={onFinish}
            >
                <Form.Item
                    name="infoLabel"
                    label="Field Name"
                    rules={[
                        {
                            required: true,
                            message: 'Please input field name!',
                        },
                    ]}
                >
                    <Input type="text" placeholder="Field Name" size="large" />
                </Form.Item>

                <Form.Item
                    name="infoValue"
                    label="Field Value"
                    rules={[
                        {
                            required: true,
                            message: 'Please input field value!',
                        },
                    ]}
                >
                    <Input type="text" placeholder="Field Value" size="large" />
                </Form.Item>
            </Form>
        )
    }

    const AddButton = () => {
        return (
            <>
                <Button size='large' style={{ float: 'right' }} onClick={handleAddModal}>
                    <PlusOutlined /> Add Field
                </Button>
            </>
        )
    }

    const EditButton = () => {
        return (
            <>
                <Button onClick={handleEditModal}>
                    <EditOutlined />
                </Button>
            </>
        )
    }

    return (
        <>
            {contextHolder}
            {isEditing ? (<EditButton />) : (<AddButton />)}
            <Modal
                title={isEditing ? "Update Field" : "New Field"}
                open={isModalOpen}
                onCancel={handleModalCancel}
                footer={[
                    <Button key="back" onClick={handleModalCancel}>
                        Return
                    </Button>,

                    <Button key="submit" type="primary" loading={submitLoading} onClick={() => restaurantForm.submit()}>
                        Submit
                    </Button>
                ]}
            >
                <RestaurantForm form={restaurantForm} onFinish={handleInfoField} />
            </Modal>
        </>
    )
}