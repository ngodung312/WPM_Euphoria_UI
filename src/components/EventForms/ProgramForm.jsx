import { Button, Col, Form, Input, Popconfirm, Row, Table, TimePicker } from 'antd'
import { EditOutlined, DeleteOutlined, CheckOutlined, StopOutlined, PlusOutlined } from '@ant-design/icons';
import React, { useState } from 'react'
import dayjs from 'dayjs';

const originData = [];
for (let i = 0; i < 10; i++) {
    originData.push({
        key: i.toString(),
        itemTitle: `Edward ${i}`,
        itemDesc: `Desc about Edward ${i}`,
        startTime: `${(i + 3)}:00`,
        endTime: `${(i + 4)}:00`
    });
}

const timeFormat = 'HH:mm';

const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
}) => {
    const inputNode = inputType === 'time' ? <TimePicker format={timeFormat} /> : <Input />;
    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{
                        margin: 0,
                    }}
                    rules={dataIndex === 'itemDesc' ? null : [
                        {
                            required: true,
                            message: `Please input ${title}!`,
                        },
                    ]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};

export const ProgramForm = ({ isViewMode, programForm, eventId, evtItems, setEvtItems, deletedIds, setDeletedIds, contextHolder, isHidden, onFinish }) => {
    const [editingKey, setEditingKey] = useState('');
    const [addingKey, setAddingKey] = useState('');
    const isEditing = (record) => record.key === editingKey;
    const edit = (record) => {
        programForm.setFieldsValue({
            itemTitle: record.itemTitle || '',
            itemDesc: record.itemDesc || '',
            startTime: dayjs(record.startTime, timeFormat) || '',
            endTime: dayjs(record.endTime, timeFormat) || '',
            eventId: eventId
        });
        setEditingKey(record.key);
    };
    const handleCancel = () => {
        setEditingKey('');
        if (addingKey !== '') {
            const newData = evtItems.slice(0, evtItems.length - 1);
            setEvtItems(newData);
            setAddingKey('');
        }
    };
    const save = async (key) => {
        try {
            const row = await programForm.validateFields();
            const newData = [...evtItems];
            const index = newData.findIndex((item) => key === item.key);
            if (index > -1) {
                const item = newData[index];
                row.startTime = row.startTime.format(timeFormat).toString();
                row.endTime = row.endTime.format(timeFormat).toString();
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });
                setEvtItems(newData);
                setEditingKey('');
            } else {
                newData.push(row);
                setEvtItems(newData);
                setEditingKey('');
            }
            if (addingKey !== '') {
                setAddingKey('');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    const handleDelete = (key) => {
        const existedItem = evtItems.filter((item) => item.hasOwnProperty('id') & item.key === key).map(item => item.id);
        setDeletedIds([...deletedIds, ...existedItem])
        const newData = evtItems.filter((item) => item.key !== key);
        setEvtItems(newData);
    };

    const handleAdd = () => {
        const idx = evtItems.length.toString();
        console.log(evtItems);
        const newData = {
            key: idx,
            itemTitle: '',
            itemDesc: '',
            startTime: '',
            endTime: '',
            eventId: eventId
        };
        programForm.setFieldsValue(newData);
        setEvtItems([...evtItems, newData]);
        setEditingKey(idx);
        setAddingKey(idx);
    };

    let columns = [
        {
            title: 'Item Title',
            dataIndex: 'itemTitle',
            width: '28%',
            editable: true,
        },
        {
            title: 'Item Description',
            dataIndex: 'itemDesc',
            width: '38%',
            editable: true,
        },
        {
            title: 'Start Time',
            dataIndex: 'startTime',
            width: '10%',
            editable: true,
        },
        {
            title: 'End Time',
            dataIndex: 'endTime',
            width: '10%',
            editable: true,
        },

    ];

    if (!isViewMode) {
        columns.push({
            title: 'Action',
            dataIndex: 'action',
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <Row justify='start'>
                        <Col span={8}>
                            <Button
                                size='small'
                                onClick={() => save(record.key)}
                            >
                                <CheckOutlined />
                            </Button>
                        </Col>
                        <Col span={8}>
                            <Popconfirm title="Sure to cancel?" onConfirm={handleCancel}>
                                <Button size='small' danger><StopOutlined /></Button>
                            </Popconfirm>
                        </Col>
                    </Row>
                ) : (
                    <Row justify='start'>
                        <Col span={8}>
                            <Button size='small' disabled={editingKey !== ''} onClick={() => edit(record)}>
                                <EditOutlined />
                            </Button>
                        </Col>
                        <Col span={8}>
                            <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)} disabled={editingKey !== ''}>
                                <Button size='small' disabled={editingKey !== ''} danger><DeleteOutlined /></Button>
                            </Popconfirm>
                        </Col>
                    </Row>
                );
            },
        });
    }
    
    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: col.dataIndex === 'startTime' | col.dataIndex === 'endTime' ? 'time' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    return (
        <div>
            <Form
                name="program"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                form={programForm}
                onFinish={onFinish}
                hidden={isHidden}
            >
                {contextHolder}
                <Form.Item name="formName" hidden>
                    <Input type="text" />
                </Form.Item>

                <Row justify='space-around' hidden={isViewMode}>
                    <Col span={11}>
                        <Button
                            onClick={handleAdd}
                            size='large'
                            disabled={addingKey !== ''}
                        >
                            <PlusOutlined /> Add a Row
                        </Button>
                    </Col>

                    <Col span={11}>
                        <Form.Item style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button type="primary" htmlType="submit" size="large" disabled={editingKey !== '' | addingKey !== ''}>Update</Button>
                        </Form.Item>
                    </Col>
                </Row>

                <Row justify='space-around'>
                    <Col span={23}>
                        <Table
                            components={{
                                body: {
                                    cell: EditableCell,
                                },
                            }}
                            bordered
                            dataSource={evtItems}
                            columns={mergedColumns}
                            rowClassName="editable-row"
                            pagination={false}
                            scroll={true}
                        />
                    </Col>
                </Row>
            </Form>
        </div>
    )
}
