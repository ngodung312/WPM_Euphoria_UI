import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, message } from 'antd';
import { axiosInstance } from '../../context/axiosConfig';
import { useContext, useState } from 'react';
import { AuthContext } from '../../context/authContext';
import TextArea from 'antd/es/input/TextArea';

export const AddMenu = ({ menus, setMenus }) => {
    const { currentUser } = useContext(AuthContext);

    const [menuForm] = Form.useForm();

    const [messageApi, contextHolder] = message.useMessage();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);

    const handleNewMenu = (values) => {
        setSubmitLoading(true);
        values["access_token"] = currentUser.data.token;
        values["menuPrice"] = 0;
        // console.log(values);
        axiosInstance
            .post(`/v1/auth/menus`, values)
            .then((res) => {
                const newMenu = {
                    ...values,
                    id: parseInt(res.data.data.id),
                    key: parseInt(res.data.data.id)
                };
                delete newMenu["access_token"];
                setMenus([...menus, newMenu]);
                messageApi.success(res ? res.data.result : 'ok');
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

    const MenuForm = ({ form, onFinish }) => {
        return (
            <Form
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                form={form}
                onFinish={onFinish}
            >
                {contextHolder}
                <Form.Item
                    name="menuTitle"
                    label="Menu Title"
                    rules={[
                        {
                            required: true,
                            message: 'Please input menu title!',
                        },
                    ]}
                >
                    <Input type="text" placeholder="Menu Title" size="large" />
                </Form.Item>

                <Form.Item
                    name="menuDesc"
                    label="Menu Description"
                >
                    <TextArea rows={4} placeholder="Menu Description" size="large" />
                </Form.Item>
            </Form>
        )
    }

    return (
        <div>
            {contextHolder}
            <Button size='large' style={{ float: 'right' }} onClick={() => showAddModal()}>
                <PlusOutlined /> Add Menu
            </Button>
            <Modal
                title="New Menu"
                open={isModalOpen}
                onCancel={handleModalCancel}
                footer={[
                    <Button key="back" onClick={handleModalCancel}>
                        Return
                    </Button>,

                    <Button key="submit" type="primary" loading={submitLoading} onClick={() => menuForm.submit()}>
                        Submit
                    </Button>
                ]}
            >
                <MenuForm form={menuForm} onFinish={handleNewMenu} />
            </Modal>
        </div>
    )
}
