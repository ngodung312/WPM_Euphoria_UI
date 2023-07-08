import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { ConfigProvider, Layout, theme } from 'antd';
import { AuthContext } from "./context/authContext";
import { useContext } from "react";

import { Dashboard } from "./pages/Dashboard/Dashboard";

import { Login } from "./pages/User/Login";
import { Register } from "./pages/User/Register";
import { UserInfo } from "./pages/User/UserInfo";
import { UserList } from "./pages/User/UserList";

import { DishList } from "./pages/Dish/DishList";
import { DishInfo } from "./pages/Dish/DishInfo";
import { AddDish } from "./pages/Dish/AddDish";

import { MenuList } from "./pages/Menu/MenuList";
import { MenuInfo } from "./pages/Menu/MenuInfo";

import { HallList } from "./pages/Hall/HallList";
import { HallInfo } from "./pages/Hall/HallInfo";

import { EventList } from "./pages/Event/EventList";
import { EventInfo } from "./pages/Event/EventInfo";

import { RestaurantInfoList } from "./pages/RestaurantInfo/RestaurantInfoList";

import { WeddingPage } from "./pages/WeddingPage/WeddingPage";
import { MyProfile } from "./pages/User/MyProfile";

import { NavBar } from './components/Layout/NavBar';
import { LeftBar } from "./components/Layout/LeftBar";
import { Footer } from './components/Layout/Footer';
import { NavBreadcrumb } from './components/Layout/NavBreadcrumb';

import { PageErrorServer, PageForbidden, PageNotFound } from "./components/ErrorResult/ErrorResult";

import "./App.scss";


function App() {
    const { Content } = Layout;

    const { currentUser } = useContext(AuthContext);
    const userRole = currentUser ? currentUser.data.userRole : 0;

    const restrictedRoutes = {
        'manager': ['/restaurant-infos', '/dishes', '/menus', '/halls'],
        'admin': ['/users'],
    }

    const ProtectedRoute = ({ children }) => {
        const currRoute = window.location.pathname;
        if (!currentUser) {
            return <Navigate to={currRoute === '/' ? '/login' : `/login?next=${currRoute}`} />
        }
        return children;
    }

    const LoggedInRoute = ({ children }) => {
        const nextLoc = window.location.search ? window.location.search.split('?next=')[1] : '/';
        if (currentUser) {
            return <Navigate to={nextLoc} />
        }
        return children;
    }

    const AppLayout = () => {
        const {
            token: { colorBgContainer },
        } = theme.useToken();

        const currRoute = window.location.pathname;
        let isRestricted = false;
        if (userRole < 3) {
            isRestricted = isRestricted || restrictedRoutes.manager.map(item => currRoute.includes(item)).includes(true);
        } 
        if (userRole < 4) {
            isRestricted = isRestricted || restrictedRoutes.admin.map(item => currRoute.includes(item)).includes(true);
        }

        return !isRestricted ? (
            <Layout style={{ minHeight: '100vh' }}>
                <LeftBar />
                <Layout className="site-layout dashboard-content">

                    <NavBar />
                    <Content style={{ margin: '0 4vb' }}>
                        <NavBreadcrumb />
                        <div style={{
                            padding: "4vb",
                            minHeight: 360,
                            background: colorBgContainer,
                        }}>
                            <Outlet />
                        </div>
                    </Content>
                    <Footer />
                </Layout>
            </Layout>
        ) : < PageForbidden />;
    }

    return (
        <div className="App">
            <ConfigProvider theme={{
                token: {
                    colorBgLayout: '#E5E4E1',
                    colorText: '#373425',
                    colorPrimary: '#94755a'
                },
            }}>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
                            <Route path="" element={<Dashboard />} />
                            <Route path="users" element={<Layout><Outlet /></Layout>}>
                                <Route path="" element={<UserList />}></Route>
                                <Route path=":id" element={<UserInfo />}></Route>
                            </Route>
                            <Route path="my-profile" element={<MyProfile />}></Route>
                            <Route path="events" element={<Layout><Outlet /></Layout>}>
                                <Route path="" element={<EventList />}></Route>
                                <Route path=":id" element={<EventInfo />}></Route>
                            </Route>
                            <Route path="restaurant-infos" element={<Layout><RestaurantInfoList /></Layout>}></Route>
                            <Route path="dishes" element={<Layout><Outlet /></Layout>}>
                                <Route path="" element={<DishList />}></Route>
                                <Route path="add" element={<AddDish />}></Route>
                                <Route path=":id" element={<DishInfo />}></Route>
                            </Route>
                            <Route path="menus" element={<Layout><Outlet /></Layout>}>
                                <Route path="" element={<MenuList />}></Route>
                                <Route path=":id" element={<MenuInfo />}></Route>
                            </Route>
                            <Route path="halls" element={<Layout><Outlet /></Layout>}>
                                <Route path="" element={<HallList />}></Route>
                                <Route path=":id" element={<HallInfo />}></Route>
                            </Route>
                        </Route>
                        <Route path="wedding/:id/editing" element={<ProtectedRoute><WeddingPage isEditing={true} /></ProtectedRoute>} />
                        <Route path="wedding/:id" element={<WeddingPage />} />
                        <Route path="/login" element={<LoggedInRoute><Login /></LoggedInRoute>}></Route>
                        <Route path="/register" element={<LoggedInRoute><Register /></LoggedInRoute>}></Route>
                        
                        <Route path="error">
                            <Route path="403" element={<PageForbidden />} />
                            <Route path="404" element={<PageNotFound />} />
                            <Route path="500" element={<PageErrorServer />} />
                        </Route>
                        <Route path="*" element={<PageNotFound />} />
                    </Routes>
                </BrowserRouter>
            </ConfigProvider>

        </div>
    );
}

export default App;
