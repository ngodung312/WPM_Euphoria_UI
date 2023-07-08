import { Button, Col, Form, Input, Popconfirm, Row, Table, Typography } from 'antd'
import { EditOutlined, DeleteOutlined, CheckOutlined, StopOutlined, PlusOutlined } from '@ant-design/icons';
import React, { useState } from 'react'

const originData = [];
for (let i = 0; i < 10; i++) {
    originData.push({
        key: i.toString(),
        expenseCode: `Title about Edward ${i}`,
        amount: `${i}000`,
    });
}

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
    const inputNode = inputType === 'number' ? <Input type="number" /> : <Input type="text" />;
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


export const ExpenseForm = ({ 
    isViewMode, userRole, expenseForm, eventId, evtExpenses, setEvtExpenses, deletedIds, setDeletedIds, contextHolder, isHidden, onFinish 
}) => {
    const { Text } = Typography;

    const [editingKey, setEditingKey] = useState('');
    const [addingKey, setAddingKey] = useState('');

    const totalAmount = evtExpenses.reduce((total, exp) => {
        return total + parseFloat(exp.amount);
    }, 0)

    const isEditing = (record) => record.key === editingKey;
    const edit = (record) => {
        expenseForm.setFieldsValue({
            expenseCode: record.expenseCode || '',
            amount: record.amount || 0,
            eventId: eventId
        });
        setEditingKey(record.key);
    };
    const handleCancel = () => {
        setEditingKey('');
        if (addingKey !== '') {
            const newData = evtExpenses.slice(0, evtExpenses.length - 1);
            setEvtExpenses(newData);
            setAddingKey('');
        }
    };
    const save = async (key) => {
        try {
            const row = await expenseForm.validateFields();
            const newData = [...evtExpenses];
            const index = newData.findIndex((item) => key === item.key);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });
                setEvtExpenses(newData);
                setEditingKey('');
                setAddingKey('');
            } else {
                newData.push(row);
                setEvtExpenses(newData);
                setEditingKey('');
                setAddingKey('');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    const handleDelete = (key) => {
        const existedItem = evtExpenses.filter((item) => item.hasOwnProperty('id') & item.key === key).map(item => item.id);
        setDeletedIds([...deletedIds, ...existedItem])
        const newData = evtExpenses.filter((item) => item.key !== key);
        setEvtExpenses(newData);
    };

    const handleAdd = () => {
        const idx = evtExpenses.length.toString();
        // console.log(evtExpenses);
        const newData = {
            key: idx,
            expenseCode: '',
            amount: 0,
            eventId: eventId
        };
        expenseForm.setFieldsValue(newData);
        setEvtExpenses([...evtExpenses, newData]);
        setEditingKey(idx);
        setAddingKey(idx);
    };

    let columns = [
        {
            title: 'Expense Code',
            dataIndex: 'expenseCode',
            width: '50%',
            editable: true,
        },
        {
            title: 'Amount ($)',
            dataIndex: 'amount',
            width: '30%',
            editable: true,
        },
    ];

    if (userRole >= 3 & !isViewMode) {
        columns.push({
            title: 'Action',
            dataIndex: 'action',
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <Row justify='start'>
                        <Col span={6}>
                            <Button
                                size='small'
                                onClick={() => save(record.key)}
                            >
                                <CheckOutlined />
                            </Button>
                        </Col>
                        <Col span={6}>
                            <Popconfirm title="Sure to cancel?" onConfirm={handleCancel}>
                                <Button size='small' danger><StopOutlined /></Button>
                            </Popconfirm>
                        </Col>
                    </Row>
                ) : (
                    <Row justify='start'>
                        <Col span={6}>
                            <Button size='small' disabled={editingKey !== ''} onClick={() => edit(record)}>
                                <EditOutlined />
                            </Button>
                        </Col>
                        <Col span={6}>
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
                inputType: col.dataIndex === 'amount' ? 'number' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    return (
        <div>
            <Form
                name="expense"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                form={expenseForm}
                onFinish={onFinish}
                hidden={isHidden}
            >
                {contextHolder}
                <Form.Item name="formName" hidden>
                    <Input type="text" />
                </Form.Item>

                <Row justify='space-around' hidden={userRole < 3 || isViewMode}>
                    <Col span={11}>
                        <Button
                            onClick={handleAdd}
                            size='large'
                            disabled={editingKey !== '' | addingKey !== ''}
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
                            dataSource={evtExpenses}
                            columns={mergedColumns}
                            rowClassName="editable-row"
                            pagination={false}
                            scroll={true}
                            summary={() => (
                                <Table.Summary fixed>
                                    <Table.Summary.Row>
                                        <Table.Summary.Cell index={0}>
                                            <Text strong>Total Amount</Text>
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell index={1} colSpan={2}>
                                            <Text strong>{totalAmount}</Text>
                                        </Table.Summary.Cell>
                                    </Table.Summary.Row>
                                </Table.Summary>
                            )}
                        />
                    </Col>
                </Row>
            </Form>
        </div>
    )
}
