import React, { useRef, useState } from 'react'
import { Input, Table } from 'antd'
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';

export const RsvpTable = ({ rsvpGuests }) => {
    const searchInput = useRef(null);
    const [searchText, setSearchText] = useState('');
    const handleSearch = (selectedKeys, confirm) => {
        confirm();
        setSearchText(selectedKeys[0]);
    };

    const columns = [
        {
            title: 'Guest Name',
            dataIndex: 'guestName',
            key: 'guestName',
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
                record.guestName.toString().toLowerCase().includes(value.toLowerCase()),
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
            title: 'Guest Email',
            dataIndex: 'guestEmail',
            key: 'guestEmail',
        },
        {
            title: 'Number Of Guests',
            dataIndex: 'numGuests',
            key: 'numGuests',
            width: '25%',
        },
        // {
        //     title: 'Action',
        //     key: 'action',
        //     render: (_, record) => {
        //         if (selectedIds.indexOf(record.id, record.dishName) >= 0) {
        //             return (
        //                 <Space>
        //                     <Button size='small' onClick={() => showDishModal(record)}>
        //                         <EyeOutlined />
        //                     </Button>
        //                     <Button size='small' danger onClick={() => handleDeleteDish(record.id, record.guestEmail)}>
        //                         <MinusOutlined />
        //                     </Button>
        //                 </Space>
        //             );
        //         }
        //         return (
        //             <Space>
        //                 <Button size='small' onClick={() => showDishModal(record)}>
        //                     <EyeOutlined />
        //                 </Button>
        //                 <Dropdown
        //                     menu={{
        //                         items: dishTypeItems,
        //                         onClick: ({ key }) => handleAddDish(record, key),
        //                     }}
        //                     placement="bottomRight"
        //                 >
        //                     <Button size='small'><PlusOutlined /></Button>
        //                 </Dropdown>
        //             </Space>
        //         );
        //     }
        // },
    ];

    return (
        <div>
            <Table
                size='middle'
                columns={columns}
                dataSource={rsvpGuests}
                bordered
            />
        </div>
    )
}
