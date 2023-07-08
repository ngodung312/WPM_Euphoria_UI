import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, DatePicker, Modal, TimePicker } from 'antd';
import { axiosInstance } from '../../context/axiosConfig';
import { useContext, useState } from 'react';
import { AuthContext } from '../../context/authContext';

export const AddEvent = ({ events, setEvents }) => {
    const { currentUser } = useContext(AuthContext);
    const userRole = parseInt(currentUser.data.userRole);

    const [eventForm] = Form.useForm();

    const [messageApi, contextHolder] = message.useMessage();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);

    const handleNewEvent = (evtData) => {
        evtData = {
            ...evtData,
            "access_token": currentUser.data.token,
            "managerId": 8,
            "hostId": 2,
            "mapId": 1,
            "menuId": 1,
            "numTables": 0,
            "numEstGuests": 0,
            "numActGuests": 0
        }
        axiosInstance
            .post(`/v1/auth/events`, evtData)
            .then((res) => {
                const newEvent = {
                    ...evtData,
                    eventDate: evtData.eventDate.format('YYYY-MM-DD').toString(),
                    eventTime: `${evtData.eventTime[0].format('HH:mm A').toString()} - ${evtData.eventTime[1].format('HH:mm A').toString()}`,
                    id: parseInt(res.data.data.id),
                    key: parseInt(res.data.data.id)
                };
                delete newEvent["access_token"];
                setEvents([...events, newEvent]);

                evtData.eventTime = evtData.eventTime.map(item => item.format('HH:mm:ss').toString());
                const evtItem = {
                    "access_token": currentUser.data.token,
                    "itemTitle": newEvent.eventTitle,
                    "itemDesc": "",
                    "startTime": evtData.eventTime[0],
                    "endTime": evtData.eventTime[1],
                    "eventId": newEvent.id
                };

                const weddItems = [
                    {
                        infoLabel: "eventStart",
                        infoValue: evtData.eventTime[0],
                        eventId: newEvent.id,
                    },
                    {
                        infoLabel: "eventEnd",
                        infoValue: evtData.eventTime[1],
                        eventId: newEvent.id,
                    }
                ]

                Promise
                    .all([
                        axiosInstance.post(`/v1/auth/evt-items`, evtItem),

                        axiosInstance.post(`/v1/auth/wedding-pages`, {
                            "access_token": currentUser.data.token,
                            "createType": "bulk",
                            "data": weddItems,
                        })
                    ])
                    .then(([evtItemRes, weddItemRes]) => {
                        messageApi.success(evtItemRes ? evtItemRes.data.result : 'ok');
                        setIsModalOpen(false);
                        setSubmitLoading(false);
                    })
                    .catch((err) => {
                        messageApi.error(err.response ? err.response.data.message : 'err');
                        setSubmitLoading(false);
                    });
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

    const EventForm = ({ form, onFinish }) => {
        return (
            <Form
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                form={form}
                onFinish={onFinish}
            >
                {contextHolder}
                <Form.Item
                    name="eventTitle"
                    label="Event Title"
                    rules={[
                        {
                            required: true,
                            message: 'Please input event title!',
                        },
                    ]}
                >
                    <Input type="text" placeholder="Event Title" size="large" />
                </Form.Item>

                <Form.Item
                    name="eventDate"
                    label="Event Date"
                    rules={[
                        {
                            required: true,
                            message: 'Please input event date!',
                        },
                    ]}
                >
                    <DatePicker size="large" placeholder="Event Date" style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    name="eventTime"
                    label="Event Time"
                    rules={[
                        {
                            required: true,
                            message: 'Please input event time!',
                        },
                    ]}
                >
                    <TimePicker.RangePicker format='HH:mm' size="large" style={{ width: '100%' }} />
                </Form.Item>
            </Form>
        )
    }

    return (
        <div>
            <Button
                size='large'
                style={{ float: 'right' }}
                hidden={userRole < 3}
                onClick={() => showAddModal()}
            >
                <PlusOutlined /> Add Event
            </Button>
            <Modal
                title="New Event"
                open={isModalOpen}
                onCancel={handleModalCancel}
                footer={[
                    <Button key="back" onClick={handleModalCancel}>
                        Return
                    </Button>,

                    <Button key="submit" type="primary" loading={submitLoading} onClick={() => eventForm.submit()}>
                        Submit
                    </Button>
                ]}
            >
                <EventForm form={eventForm} onFinish={handleNewEvent} />
            </Modal>
        </div>
    )
}
