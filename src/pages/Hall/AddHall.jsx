import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, message } from 'antd';
import { axiosInstance } from '../../context/axiosConfig';
import { useContext, useState } from 'react';
import { AuthContext } from '../../context/authContext';
import TextArea from 'antd/es/input/TextArea';

export const AddHall = ({ halls, setHalls }) => {
    const { currentUser } = useContext(AuthContext);

    const [hallForm] = Form.useForm();

    const [messageApi, contextHolder] = message.useMessage();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);

    const handleNewHall = (values) => {
        setSubmitLoading(true);
        values["access_token"] = currentUser.data.token;
        // console.log(values);
        axiosInstance
            .post(`/v1/auth/halls`, values)
            .then((res) => {
                const newHall = {
                    ...values,
                    id: parseInt(res.data.data.id),
                    key: parseInt(res.data.data.id)
                };
                delete newHall["access_token"];
                setHalls([...halls, newHall]);
                messageApi.success(res ? res.data.result : 'ok');
                hallForm.resetFields();
                setIsModalOpen(false);
                setSubmitLoading(false);

            })
            .catch((err) => {
                messageApi.error(err.response ? err.response.data.message : 'err');
                setSubmitLoading(false);
            });
    };

    const handleModalCancel = () => {
        setIsModalOpen(false);
    };

    const showAddModal = () => {
        setIsModalOpen(true);
    };

    const HallForm = ({ form, onFinish }) => {
        return (
            <Form
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                form={form}
                onFinish={onFinish}
            >
                {contextHolder}
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
                    <TextArea rows={4} placeholder="Hall Description" size="large" />
                </Form.Item>
            </Form>
        )
    }

    return (
        <div>
            <Button
                size='large'
                style={{ float: 'right' }}
                onClick={() => showAddModal()}
            >
                <PlusOutlined /> Add Hall
            </Button>
            <Modal
                title="New Hall"
                open={isModalOpen}
                onCancel={handleModalCancel}
                footer={[
                    <Button key="back" onClick={handleModalCancel}>
                        Return
                    </Button>,

                    <Button key="submit" type="primary" loading={submitLoading} onClick={() => hallForm.submit()}>
                        Submit
                    </Button>
                ]}
            >
                <HallForm form={hallForm} onFinish={handleNewHall} />
            </Modal>
        </div>
    )
}
