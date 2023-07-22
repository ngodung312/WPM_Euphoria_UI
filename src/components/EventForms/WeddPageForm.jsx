import { Button, Card, Col, Dropdown, Form, Input, Modal, QRCode, Row, Space, message } from 'antd'
import {
    LinkOutlined, ExportOutlined, TeamOutlined, DownloadOutlined, QrcodeOutlined, ContactsOutlined
} from '@ant-design/icons';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import React, { useState } from 'react'
import { RsvpTable } from '../Tables/RsvpTable';
// import shortIcon from '../assets/images/logo.png';

export const WeddPageForm = ({ 
    isViewMode, weddPageForm, eventId, rsvpGuests, contextHolder, isHidden, onFinish 
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleModalCancel = () => {
        setIsModalOpen(false);
    };

    const downloadQRCode = () => {
        const canvas = document.getElementById('qrcode')?.querySelector('canvas');
        if (canvas) {
            const url = canvas.toDataURL("image/png");
            const a = document.createElement('a');
            a.download = 'QRCode.png';
            a.href = url;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    };

    return (
        <div>
            <Modal
                title="RSVP List"
                open={isModalOpen}
                onCancel={handleModalCancel}
                width='60vw'
                bodyStyle={{ padding: '8px 0' }}
                footer={false}
            >
                <RsvpTable rsvpGuests={rsvpGuests} />
            </Modal>

            <Form
                name="summary"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                form={weddPageForm}
                onFinish={onFinish}
                hidden={isHidden}
            >
                {contextHolder}
                <Form.Item name="formName" hidden>
                    <Input type="text" />
                </Form.Item>

                <Row justify='space-around'>
                    <Col span={11}>
                        <Space size='large'>
                            <Dropdown
                                dropdownRender={() => {
                                    return (
                                        <Card
                                            id='qrcode'
                                            size='small'
                                            title={
                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <span>QR Code</span>
                                                    <Button size='small' type="text" onClick={downloadQRCode}><DownloadOutlined /></Button>
                                                </div>
                                            }
                                            bodyStyle={{ padding: '1vb', display: 'flex', justifyContent: 'center' }}
                                        >
                                            <QRCode
                                                errorLevel="H"
                                                value={`${window.location.host}/wedding/${eventId}`}
                                                // icon={shortIcon}
                                                bordered={false}
                                                style={{
                                                    width: '100%',
                                                    padding: '0'
                                                }}
                                            />
                                        </Card>
                                    )
                                }}
                                placement="bottomLeft"
                                trigger={['click', 'hover']}
                            >

                                <Button size='large'><QrcodeOutlined /> Generate QR Code</Button>
                            </Dropdown>

                            <Button size='large' onClick={() => setIsModalOpen(true)}><ContactsOutlined /> RSVP List</Button>
                        </Space>
                    </Col>
                    <Col span={11}>
                        <Form.Item style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button type="primary" htmlType="submit" size="large" hidden={isViewMode}>Update All</Button>
                        </Form.Item>
                    </Col>
                </Row>

                <Row justify='space-around'>
                    <Col span={0}>

                    </Col>
                    <Col span={23}>
                        <Card
                            style={{
                                borderBottomLeftRadius: 0,
                                borderBottomRightRadius: 0,
                            }}
                            bodyStyle={{ padding: 0 }}
                            title={
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Wedding Page</span>
                                    <div className='d-flex justify-content-end'>
                                        <CopyToClipboard
                                            text={`${window.location.origin}/wedding/${eventId}`}
                                            onCopy={() => message.success('Copied to clipboard')}
                                        >
                                            <Button size='small' type="text" style={{ marginRight: '1vb' }}><LinkOutlined /> Copy Link</Button>
                                        </CopyToClipboard>
                                        {!isViewMode ? (
                                            <>
                                                <Button
                                                    size='small'
                                                    type="text"
                                                    onClick={() => window.open(`/wedding/${eventId}`, '_blank')}
                                                >
                                                    <TeamOutlined /> Guest View
                                                </Button>
                                                <Button
                                                    size='small'
                                                    type="text"
                                                    onClick={() => window.open(`/wedding/${eventId}/editing`, '_blank')}
                                                >
                                                    <ExportOutlined /> Edit in New Tab
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <Button
                                                    size='small'
                                                    type="text"
                                                    onClick={() => window.open(`/wedding/${eventId}`, '_blank')}
                                                >
                                                    <ExportOutlined /> Open in New Tab
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            }
                        >
                            <iframe
                                title="InvitationLink"
                                className='border'
                                width="100%"
                                height="550vb"
                                src={isViewMode ? `/wedding/${eventId}` : `/wedding/${eventId}/editing`}
                            />
                        </Card>
                    </Col>
                </Row>


            </Form>
        </div>
    )
}
