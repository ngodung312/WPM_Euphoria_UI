import React, { useRef, useState } from 'react'
import { Table, Button, Dropdown, Input, Space } from 'antd';
import { PlusOutlined, MinusOutlined, SearchOutlined, EyeOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';


export const DishTable = ({ dishes, selectedDishes = {}, handleAddDish, handleDeleteDish, showDishModal }) => {
    const selectedIds = selectedDishes.map(item => item.dishId);

    const dishTypeItems = [
        {
            key: '1',
            label: 'Appertizer',
        },
        {
            key: '2',
            label: 'Main Course',
        },
        {
            key: '3',
            label: 'Dessert',
        },
    ];

    const searchInput = useRef(null);
    const [searchText, setSearchText] = useState('');
    const handleSearch = (selectedKeys, confirm) => {
        confirm();
        setSearchText(selectedKeys[0]);
    };

    const columns = [
        {
            title: 'Dish Title',
            dataIndex: 'dishTitle',
            key: 'dishTitle',
            filterDropdown: ({ selectedKeys, setSelectedKeys, confirm }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        ref={searchInput}
                        placeholder={`Search Dish Title`}
                        value={selectedKeys[0]}
                        onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleSearch(selectedKeys, confirm);
                        }}
                    />
                </div>
            ),
            filterIcon: (filtered) => (
                <SearchOutlined
                    style={{
                        color: filtered ? '#1890ff' : undefined,
                    }}
                />
            ),
            onFilter: (value, record) =>
                record.dishTitle.toString().toLowerCase().includes(value.toLowerCase()),
            onFilterDropdownOpenChange: (visible) => {
                if (visible) {
                    setTimeout(() => searchInput.current?.select(), 100);
                }
            },
            render: (text) => (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: '#ffc069',
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            )
        },
        {
            title: 'Dish Price ($)',
            dataIndex: 'dishPrice',
            key: 'dishPrice',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => {
                if (selectedIds.indexOf(record.id, record.dishName) >= 0) {
                    return (
                        <Space>
                            <Button size='small' onClick={() => showDishModal(record)}>
                                <EyeOutlined />
                            </Button>
                            <Button size='small' danger onClick={() => handleDeleteDish(record.id, record.dishPrice)}>
                                <MinusOutlined />
                            </Button>
                        </Space>
                    );
                }
                return (
                    <Space>
                        <Button size='small' onClick={() => showDishModal(record)}>
                            <EyeOutlined />
                        </Button>
                        <Dropdown
                            menu={{
                                items: dishTypeItems,
                                onClick: ({ key }) => handleAddDish(record, key),
                            }}
                            placement="bottomRight"
                        >
                            <Button size='small'><PlusOutlined /></Button>
                        </Dropdown>
                    </Space>
                );
            }
        },
    ];

    return (
        <div>
            <Table
                columns={columns}
                dataSource={dishes}
                bordered
            />
        </div>
    )
}
