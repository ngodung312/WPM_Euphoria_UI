import React, { useRef, useState } from 'react'
import { Table, Button, Input, Space } from 'antd';
import { PlusOutlined, SearchOutlined, EyeOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';


export const MenuTable = ({ menus, selectedMenu, handleAddDish, handleShowMenu, isViewMode = false }) => {
    const searchInput = useRef(null);
    const [searchText, setSearchText] = useState('');
    const handleSearch = (selectedKeys, confirm) => {
        confirm();
        setSearchText(selectedKeys[0]);
    };

    let columns = [
        {
            title: 'Menu Title',
            dataIndex: 'menuTitle',
            key: 'menuTitle',
            width: '45%',
            filterDropdown: ({ selectedKeys, setSelectedKeys, confirm }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        ref={searchInput}
                        placeholder={`Search Menu Title`}
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
                record.menuTitle.toString().toLowerCase().includes(value.toLowerCase()),
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
            title: 'Menu Price ($)',
            dataIndex: 'menuPrice',
            key: 'menuPrice',
        },
    ];

    if (!isViewMode) {
        columns.push({
            title: 'Action',
            key: 'action',
            width: '25%',
            render: (_, record) => {
                return (
                    <Space>
                        <Button
                            size='small'
                            onClick={() => handleShowMenu(record)}
                        >
                            <EyeOutlined />
                        </Button >
                        <Button
                            size='small'
                            disabled={selectedMenu.id === record.id ? true : false}
                            onClick={() => handleAddDish(record)}
                        >
                            <PlusOutlined />
                        </Button >
                    </Space>
                );
            }
        });
    }

    return (
        <div>
            <Table
                columns={columns}
                dataSource={menus}
                bordered
            />
        </div>
    )
}
