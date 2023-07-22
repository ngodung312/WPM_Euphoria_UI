import {
    InfoCircleOutlined, OrderedListOutlined, WalletOutlined, RestOutlined, FolderOpenOutlined,
    GroupOutlined, LayoutOutlined
} from '@ant-design/icons';
import { Form, Steps, message, theme } from 'antd';
import { axiosInstance } from '../../context/axiosConfig';
import { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/authContext';
import dayjs from 'dayjs';
import { GeneralForm } from '../../components/EventForms/GeneralForm';
import { HallForm } from '../../components/EventForms/HallForm';
import { ProgramForm } from '../../components/EventForms/ProgramForm';
import { MenuForm } from '../../components/EventForms/MenuForm';
import { AlbumForm } from '../../components/EventForms/AlbumForm';
import { ExpenseForm } from '../../components/EventForms/ExpenseForm';
import { WeddPageForm } from '../../components/EventForms/WeddPageForm';

export const EventInfo = () => {
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const { currentUser } = useContext(AuthContext);
    const userRole = parseInt(currentUser.data.userRole);
    const userId = currentUser.data.id;

    const defaultImg = "data:image/png;base64,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";

    const location = useLocation();
    const eventId = location.pathname.split('/').pop();

    const navigate = useNavigate();

    const [messageApi, contextHolder] = message.useMessage();

    const [generalForm] = Form.useForm();
    const [hallForm] = Form.useForm();
    const [programForm] = Form.useForm();
    const [menuForm] = Form.useForm();
    const [albumForm] = Form.useForm();
    const [expenseForm] = Form.useForm();
    const [weddPageForm] = Form.useForm();

    const [event, setEvent] = useState([]);
    const [evtItems, setEvtItems] = useState([]);
    const [delEvtItemIds, setDelEvtItemIds] = useState([]);
    const [evtExpenses, setEvtExpenses] = useState([]);
    const [delEvtExpIds, setDelEvtExpIds] = useState([]);
    const [menus, setMenus] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [selectedMenu, setSelectedMenu] = useState({});
    const [menuDishes, setMenuDishes] = useState([]);
    const [dishes, setDishes] = useState([]);
    const [albums, setAlbums] = useState([]);
    const [images, setImages] = useState([]);
    const [delImageIds, setDelImageIds] = useState([]);
    const [userInfo, setUserInfo] = useState([]);
    const [userOptions, setUserOptions] = useState([]);
    const [hostInfo, setHostInfo] = useState([]);
    const [managerInfo, setManagerInfo] = useState([]);
    const [halls, setHalls] = useState([]);
    const [maps, setMaps] = useState([]);
    const [weddItems, setWeddItems] = useState([]);
    const [rsvpGuests, setRsvpGuests] = useState([]);
    const [isViewMode, setIsViewMode] = useState(false);
    const [isFormHidden, setIsFormHidden] = useState([false, true, true, true, true, true, true])
    const [tabItems, setTabItems] = useState([
        {
            status: 'process',
            title: 'General',
            icon: <InfoCircleOutlined />
        },
        {
            status: 'wait',
            title: 'Hall',
            icon: <GroupOutlined />
        },
        {
            status: 'wait',
            title: 'Program',
            icon: <OrderedListOutlined />
        },
        {
            status: 'wait',
            title: 'Menu',
            icon: <RestOutlined />
        },
        {
            status: 'wait',
            title: 'Albums',
            icon: <FolderOpenOutlined />
        },
        {
            status: 'wait',
            title: 'Expense',
            icon: <WalletOutlined />
        },
        {
            status: 'wait',
            title: 'Website',
            icon: <LayoutOutlined />
        },
    ])

    useEffect(() => {
        const findUser = (users, userId) => {
            let filteredData = users.filter(user => user.id === userId);
            filteredData = filteredData ? filteredData[0] : {};
            return [
                { key: 'Full Name', value: filteredData['fullName'] },
                { key: 'Email', value: filteredData['email'] },
                { key: 'Phone Number', value: filteredData['phoneNumber'] },
                { key: 'Avatar', value: `${currentUser.data.bucketUrl}/users/${filteredData['avatar']}` },
            ];
        }

        axiosInstance.get(`/v1/auth/events/${eventId}`, {
            params: {
                "access_token": currentUser.data.token,
            },
        }).then((eventRes) => {
            const eventData = eventRes.data.data;
            if (userRole === 3 & eventData.managerId !== userId) {
                setIsViewMode(true);
            }
            Promise
                .all([
                    axiosInstance.get("/v1/auth/users", {
                        params: {
                            "access_token": currentUser.data.token,
                        },
                    }),

                    axiosInstance.get("/v1/auth/halls", {
                        params: {
                            "access_token": currentUser.data.token,
                        },
                    }),

                    axiosInstance.get("/v1/auth/maps", {
                        params: {
                            "access_token": currentUser.data.token,
                        },
                    }),

                    axiosInstance.get("/v1/auth/evt-items", {
                        params: {
                            "access_token": currentUser.data.token,
                            "eventId": eventId,
                        },
                    }),

                    axiosInstance.get("/v1/auth/menus", {
                        params: {
                            "access_token": currentUser.data.token,
                        },
                    }),

                    axiosInstance.get("/v1/auth/menu-items", {
                        params: {
                            "access_token": currentUser.data.token,
                        },
                    }),

                    axiosInstance.get("/v1/auth/dishes", {
                        params: {
                            "access_token": currentUser.data.token,
                        },
                    }),

                    axiosInstance.get("/albums", {
                        params: {
                            "eventId": eventId,
                        },
                    }),

                    axiosInstance.get("/v1/auth/evt-expenses", {
                        params: {
                            "access_token": currentUser.data.token,
                            "eventId": eventId,
                        },
                    }),

                    axiosInstance.get("/wedding-pages", {
                        params: {
                            "access_token": currentUser.data.token,
                            "eventId": eventId,
                        },
                    }),

                    axiosInstance.get("/v1/auth/rsvp-guests", {
                        params: {
                            "access_token": currentUser.data.token,
                            "eventId": eventId,
                        },
                    }),
                ])
                .then(([
                    userRes, hallRes, mapRes, evtItemRes, menuRes, menuItemRes,
                    dishRes, albumRes, evtExpenseRes, weddPageRes, rsvpRes
                ]) => {
                    eventData['eventDate'] = dayjs(eventData['eventDate'], 'YYYY-MM-DD');

                    let userData = userRes.data.rows;
                    let userOptions = [];
                    for (let i = 0; i < userData.length; i++) {
                        userOptions.push({
                            key: userData[i].id,
                            value: userData[i].id,
                            label: userData[i].fullName,
                            role: userData[i].userRole
                        })
                    }
                    let hostData = findUser(userData, eventData['hostId']);
                    let managerData = findUser(userData, eventData['managerId']);

                    let hallData = hallRes.data.rows;
                    for (let i = 0; i < hallData.length; i++) {
                        hallData[i].value = hallData[i].id;
                        hallData[i].label = hallData[i].hallTitle;
                    }

                    let mapData = mapRes.data.rows;
                    for (let i = 0; i < mapData.length; i++) {
                        mapData[i].value = mapData[i].id;
                        mapData[i].label = mapData[i].mapTitle;
                    }
                    const currMap = mapData.filter(item => item.id === eventData.mapId)[0];

                    const evtItemData = evtItemRes.data.rows;
                    const timeFormat = 'HH:mm';
                    for (let i = 0; i < evtItemData.length; i++) {
                        evtItemData[i].key = i;
                        evtItemData[i].startTime = dayjs(evtItemData[i].startTime, timeFormat).format(timeFormat).toString();
                        evtItemData[i].endTime = dayjs(evtItemData[i].endTime, timeFormat).format(timeFormat).toString();
                    }

                    const menuData = menuRes.data.rows;
                    for (let i = 0; i < menuData.length; i++) {
                        menuData[i].key = i;
                    }
                    const initMenu = menuData.filter(item => item.id === eventData.menuId);
                    if (initMenu.length > 0) {
                        setSelectedMenu(initMenu[0]);
                    }

                    const dishData = dishRes.data.rows;
                    const menuItemData = menuItemRes.data.rows;

                    const menuDishData = menuItemData.filter(item => item.menuId === eventData.menuId);
                    for (let i = 0; i < menuDishData.length; i++) {
                        const currDish = dishData.find(item => item.id === menuDishData[i].dishId);
                        menuDishData[i] = {
                            dishTitle: currDish.dishTitle,
                            dishPrice: currDish.dishPrice,
                            dishUrl: currDish.dishUrl ? `${currentUser.data.bucketUrl}/dishes/${currDish.dishUrl}` : defaultImg,
                            dishDesc: currDish.dishDesc,
                            ...menuDishData[i]
                        }
                    }

                    const albumData = albumRes.data.rows;
                    for (let i = 0; i < albumData.length; i++) {
                        albumData[i].key = albumData[i].id;
                        albumData[i].albumSize = parseInt(albumData[i].albumSize);
                    }

                    const evtExpenseData = evtExpenseRes.data.rows;
                    for (let i = 0; i < evtExpenseData.length; i++) {
                        evtExpenseData[i].key = i;
                    }

                    const weddPageData = weddPageRes.data.rows;

                    const rsvpData = rsvpRes.data.rows;
                    let sumGuests = 0;
                    for (let i = 0; i < rsvpData.length; i++) {
                        rsvpData[i].key = rsvpData[i].id;
                        sumGuests += rsvpData[i].numGuests;
                    }
                    eventData.numActGuests = sumGuests;

                    setEvent(eventData);
                    window.setTimeout(() => {
                        generalForm.setFieldsValue({ formName: "general", ...eventData });
                    }, 2000);
                    setHostInfo(hostData);
                    setManagerInfo(managerData);
                    setUserInfo(userData);
                    setUserOptions(userOptions);

                    setHalls(hallData);
                    setMaps(mapData);
                    hallForm.setFieldValue("formName", "hall");
                    hallForm.setFieldValue("hallId", currMap.hallId);
                    hallForm.setFieldValue("mapId", currMap.id);

                    setEvtItems(evtItemData);
                    programForm.setFieldValue("formName", "program");

                    setMenus(menuData);
                    menuForm.setFieldValue("formName", "menu");
                    setMenuItems(menuItemData);
                    setDishes(dishData);
                    setMenuDishes(menuDishData);

                    setAlbums(albumData);
                    albumForm.setFieldValue("formName", "album");

                    setEvtExpenses(evtExpenseData);
                    expenseForm.setFieldValue("formName", "expense");

                    setWeddItems(weddPageData);
                    weddPageForm.setFieldValue("formName", "wedding");

                    setRsvpGuests(rsvpData);
                })
                .catch(err => {
                    messageApi.error(err.response ? err.response.data.message : 'err');
                });
        }).catch(err => {
            if (err.response) {
                messageApi.error(err.response.data.message);
                return navigate(`/error/${err.response.status}`);
            } else {
                messageApi.error('err');
            }
        });

    }, [
        eventId, messageApi, currentUser, navigate, userId, userRole,
        generalForm, hallForm, programForm, menuForm, albumForm, expenseForm, weddPageForm
    ]);

    const [currTab, setCurrTab] = useState(0);
    const onTabChange = (idx) => {
        let updatedTabs = tabItems.map(item => {
            return { ...item, status: 'wait' };
        });
        let formHidden = new Array(isFormHidden.length).fill(true);
        formHidden[idx] = false;
        updatedTabs[idx].status = 'process';
        setCurrTab(idx);
        setTabItems(updatedTabs);
        setIsFormHidden(formHidden);
    };

    const onHostChange = (hostId) => {
        let filteredData = userInfo.filter(user => user.id === hostId);
        filteredData = filteredData ? filteredData[0] : {};
        let hostData = [
            { key: 'Full Name', value: filteredData['fullName'] },
            { key: 'Email', value: filteredData['email'] },
            { key: 'Phone Number', value: filteredData['phoneNumber'] },
        ];
        setHostInfo(hostData);
    }

    const onManagerChange = (managerId) => {
        let filteredData = userInfo.filter(user => user.id === managerId);
        filteredData = filteredData ? filteredData[0] : {};
        let managerData = [
            { key: 'Full Name', value: filteredData['fullName'] },
            { key: 'Email', value: filteredData['email'] },
            { key: 'Phone Number', value: filteredData['phoneNumber'] },
        ];
        setManagerInfo(managerData);
    }

    const onFinish = (values) => {
        const formKeys = ['general', 'hall', 'program', 'menu', 'album', 'expense'];
        let formNameList = formKeys.reduce((form, key) => {
            form[key] = false;
            return form;
        }, {});

        const currForm = values.formName;
        if (currForm === 'wedding' || currForm === 'all') {
            for (let key in formNameList) {
                formNameList[key] = isViewMode ? false : true;
            }
            if (userRole < 3) {
                formNameList['expense'] = false;
            }
            formNameList['album'] = false;
        } else {
            formNameList[currForm] = isViewMode ? false : true;
        }
        // console.log(currForm);
        // console.log(formNameList);

        let isRequested = {};
        let updatedEvt = {};
        let newWeddItems = [];

        if (formNameList['general']) {
            // console.log(generalForm.getFieldsValue());
            updatedEvt = {
                ...event,
                ...generalForm.getFieldsValue(),
            };
            isRequested['put_events'] = true;
        }

        if (formNameList['hall']) {
            // console.log(hallForm.getFieldsValue());
            updatedEvt = {
                ...event,
                mapId: hallForm.getFieldValue('mapId')
            };
            isRequested['put_events'] = true;
        }

        if (formNameList['program']) {
            // console.log(evtItems);
            // console.log(weddItems);

            let eventStart = null;
            let eventEnd = null;
            const timeFormat = 'HH:mm';
            const evtStartList = evtItems.map(item => item.startTime);
            const evtEndList = evtItems.map(item => item.endTime);
            for (let i = 0; i < evtStartList.length; i++) {
                const currentTime = dayjs(evtStartList[i], timeFormat);
                if (!eventStart || currentTime.isBefore(eventStart)) {
                    eventStart = currentTime;
                }
            };
            for (let i = 0; i < evtEndList.length; i++) {
                const currentTime = dayjs(evtEndList[i], timeFormat);
                if (!eventEnd || currentTime.isAfter(eventEnd)) {
                    eventEnd = currentTime;
                }
            };
            let weddEvtStart = weddItems.filter(item => item.infoLabel === 'eventStart');
            if (weddEvtStart.length > 0) {
                weddEvtStart[0].infoValue = eventStart.format('HH:mm:ss').toString();
            } else {
                weddEvtStart = [{
                    infoLabel: 'eventStart',
                    infoValue: eventStart.format('HH:mm:ss').toString(),
                    eventId: eventId,
                }];
            }
            let weddEvtEnd = weddItems.filter(item => item.infoLabel === 'eventEnd');
            if (weddEvtEnd.length > 0) {
                weddEvtEnd[0].infoValue = eventEnd.format('HH:mm:ss').toString();
            } else {
                weddEvtEnd = [{
                    infoLabel: 'eventEnd',
                    infoValue: eventEnd.format('HH:mm:ss').toString(),
                    eventId: eventId,
                }];
            }
            newWeddItems = [...weddEvtStart, ...weddEvtEnd];

            isRequested['put_evt_items'] = delEvtItemIds.length > 0 ? true : false;
            isRequested['post_evt_items'] = evtItems.length > 0 ? true : false;
            isRequested['post_wedd_items'] = newWeddItems.length > 0 ? true : false;
        }

        if (formNameList['menu']) {
            // console.log(selectedMenu);
            updatedEvt = {
                ...event,
                menuId: selectedMenu.id
            };
            isRequested['put_events'] = true;
        }

        if (formNameList['album']) {
            // console.log(albumForm.getFieldsValue());
            // console.log(images);

            isRequested['put_albums'] = true;
            isRequested['put_images'] = delImageIds.length > 0 ? true : false;
            isRequested['post_images'] = images.length > 0 ? true : false;
        }

        if (formNameList['expense']) {
            // console.log(evtExpenses);

            isRequested['put_evt_expenses'] = delEvtExpIds.length > 0 ? true : false;
            isRequested['post_evt_expenses'] = evtExpenses.length > 0 ? true : false;
        }

        // console.log("Updated Form:", isRequested);

        Promise
            .all([
                isRequested['put_events'] ?
                    axiosInstance.put(`/v1/auth/events/${eventId}`, {
                        "access_token": currentUser.data.token,
                        ...updatedEvt
                    }) : null,

                isRequested['put_evt_items'] ?
                    axiosInstance.put(`/v1/auth/evt-items/deletes`, {
                        "access_token": currentUser.data.token,
                        "ids": delEvtItemIds,
                    }) : null,

                isRequested['post_evt_items'] ?
                    axiosInstance.post(`/v1/auth/evt-items`, {
                        "access_token": currentUser.data.token,
                        "createType": "bulk",
                        "data": evtItems,
                    }) : null,

                isRequested['post_wedd_items'] ?
                    axiosInstance.post(`/v1/auth/wedding-pages`, {
                        "access_token": currentUser.data.token,
                        "createType": "bulk",
                        "data": newWeddItems,
                    }) : null,

                isRequested['put_albums'] ?
                    axiosInstance.put(`/v1/auth/albums/${albumForm.getFieldValue('id')}`, {
                        "access_token": currentUser.data.token,
                        ...albumForm.getFieldsValue(),
                    }) : null,

                isRequested['put_images'] ?
                    axiosInstance.put(`/v1/auth/images/deletes`, {
                        "access_token": currentUser.data.token,
                        "ids": delImageIds,
                    }) : null,

                isRequested['post_images'] ?
                    axiosInstance.post(`/v1/auth/images`, {
                        "access_token": currentUser.data.token,
                        "createType": "bulk",
                        "data": images,
                    }) : null,

                isRequested['put_evt_expenses'] ?
                    axiosInstance.put(`/v1/auth/evt-expenses/deletes`, {
                        "access_token": currentUser.data.token,
                        "ids": delEvtExpIds,
                    }) : null,

                isRequested['post_evt_expenses'] ?
                    axiosInstance.post(`/v1/auth/evt-expenses`, {
                        "access_token": currentUser.data.token,
                        "createType": "bulk",
                        "data": evtExpenses,
                    }) : null,
            ])
            .then(([
                eventRes,
                delEvtItemsRes, creEvtItemsRes, creWeddItemsRes,
                albumRes,
                delImagesRes, creImagesres,
                delEvtExpensesRes, creEvtExpensesRes
            ]) => {
                switch (currForm) {
                    case 'general':
                        messageApi.success(eventRes ? eventRes.data.result : 'ok');
                        break;
                    case 'program':
                        messageApi.success(creEvtItemsRes ? creEvtItemsRes.data.result : 'ok');
                        let updatedEvtItems = creEvtItemsRes.data.data;
                        for (let i = 0; i < updatedEvtItems.length; i++) {
                            const currItem = updatedEvtItems[i];
                            const filteredItem = evtItems.filter(item => item.itemTitle === currItem.itemTitle & item.itemDesc === currItem.itemDesc);
                            if (filteredItem.length > 0) {
                                updatedEvtItems[i] = {
                                    ...filteredItem[0],
                                    ...updatedEvtItems[i],
                                }
                            }
                        }
                        setEvtItems(updatedEvtItems);
                        // console.log(updatedEvtItems);

                        let updatedWeddItems = creWeddItemsRes.data.data;
                        for (let i = 0; i < updatedWeddItems.length; i++) {
                            const currItem = updatedWeddItems[i];
                            const filteredItem = weddItems.filter(item => item.infoLabel === currItem.infoLabel & item.infoValue === currItem.infoValue);
                            if (filteredItem.length > 0) {
                                updatedWeddItems[i] = {
                                    ...filteredItem[0],
                                    ...updatedWeddItems[i],
                                }
                            }
                        }
                        setWeddItems(updatedWeddItems);
                        break;
                    case 'album':
                        messageApi.success(albumRes ? albumRes.data.result : 'ok');
                        const newAlbum = albumForm.getFieldsValue();
                        newAlbum.key = newAlbum.id;
                        const albumIdx = albums.findIndex(item => item.id === newAlbum.id);
                        let udpatedAlbums = albums;
                        udpatedAlbums.splice(albumIdx, 1, newAlbum);
                        setAlbums(udpatedAlbums);

                        let updatedImgs = creImagesres.data.data;
                        for (let i = 0; i < updatedImgs.length; i++) {
                            const currImg = updatedImgs[i];
                            const filteredImg = images.filter(item => item.imageTitle === currImg.imageTitle & item.imageDesc === currImg.imageDesc);
                            if (filteredImg.length > 0) {
                                updatedImgs[i] = {
                                    ...filteredImg[0],
                                    ...updatedImgs[i],
                                }
                            }
                        }
                        setImages(updatedImgs);
                        // console.log(updatedImgs);
                        break;
                    case 'expense':
                        messageApi.success(creEvtExpensesRes ? creEvtExpensesRes.data.result : 'ok');
                        let updatedExps = creEvtExpensesRes.data.data;
                        for (let i = 0; i < updatedExps.length; i++) {
                            const currExp = updatedExps[i];
                            const filteredExp = evtExpenses.filter(item => item.expenseCode === currExp.expenseCode & item.amount === currExp.amount);
                            if (filteredExp.length > 0) {
                                updatedExps[i] = {
                                    ...filteredExp[0],
                                    ...updatedExps[i],
                                }
                            }
                        }
                        setEvtExpenses(updatedExps);
                        // console.log(updatedExps);
                        break;
                    default:
                        messageApi.success(eventRes.data.result);
                }
            })
            .catch(err => {
                messageApi.error(err.response ? err.response.data.message : 'err');
            });
    };

    return (
        <div style={{
            backgroundColor: colorBgContainer,
            padding: "2vb",
        }}
        >
            <Steps
                type="navigation"
                current={currTab}
                onChange={onTabChange}
                items={tabItems}
                style={{ padding: '1vb 3vb 3vb 3vb' }}
            />

            <GeneralForm
                userRole={userRole}
                isViewMode={isViewMode}
                generalForm={generalForm}
                event={event}
                userOptions={userOptions}
                hostInfo={hostInfo}
                onHostChange={onHostChange}
                managerInfo={managerInfo}
                onManagerChange={onManagerChange}
                contextHolder={contextHolder}
                isHidden={isFormHidden[0]}
                onFinish={onFinish} />

            <HallForm
                userRole={userRole}
                isViewMode={isViewMode}
                hallForm={hallForm}
                halls={halls}
                maps={maps}
                contextHolder={contextHolder}
                isHidden={isFormHidden[1]}
                onFinish={onFinish} />

            <ProgramForm
                isViewMode={isViewMode}
                programForm={programForm}
                eventId={eventId}
                evtItems={evtItems}
                setEvtItems={setEvtItems}
                deletedIds={delEvtItemIds}
                setDeletedIds={setDelEvtItemIds}
                contextHolder={contextHolder}
                isHidden={isFormHidden[2]}
                onFinish={onFinish} />

            <MenuForm
                isViewMode={isViewMode}
                menuForm={menuForm}
                selectedMenu={selectedMenu}
                setSelectedMenu={setSelectedMenu}
                menuDishes={menuDishes}
                setMenuDishes={setMenuDishes}
                menus={menus}
                dishes={dishes}
                menuItems={menuItems}
                contextHolder={contextHolder}
                isHidden={isFormHidden[3]}
                onFinish={onFinish} />

            <AlbumForm
                isViewMode={isViewMode}
                albumForm={albumForm}
                eventId={eventId}
                albums={albums}
                setAlbums={setAlbums}
                images={images}
                setImages={setImages}
                delImageIds={delImageIds}
                setDelImageIds={setDelImageIds}
                contextHolder={contextHolder}
                isHidden={isFormHidden[4]}
                onFinish={onFinish} />

            <ExpenseForm
                userRole={userRole}
                isViewMode={isViewMode}
                expenseForm={expenseForm}
                eventId={eventId}
                evtExpenses={evtExpenses}
                setEvtExpenses={setEvtExpenses}
                deletedIds={delEvtExpIds}
                setDeletedIds={setDelEvtExpIds}
                contextHolder={contextHolder}
                isHidden={isFormHidden[5]}
                onFinish={onFinish} />

            <WeddPageForm
                isViewMode={isViewMode}
                weddPageForm={weddPageForm}
                eventId={eventId}
                rsvpGuests={rsvpGuests}
                contextHolder={contextHolder}
                isHidden={isFormHidden[6]}
                onFinish={onFinish} />
        </div>
    )
}
