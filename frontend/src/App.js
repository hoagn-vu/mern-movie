import React, { useContext, useEffect, useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Register from './pages/Register/Register';
import Login from './pages/Login/Login';
import Home from './pages/Home/Home';
import Profile from './pages/Profile/Profile';
import AccountManagement from './pages/AccountManagement/AccountManagement';
import TestPage from './pages/testpage/testpage';

import AdminLayout from './layouts/AdminLayout/AdminLayout';
import Dashboard from './pages/AdminDashboard/Dashboard';
import MovieManagement from './pages/AdminMovieManagement/MovieManagement';
import AccountManagement2 from './pages/AdminAccountManagement/AccountManagement';
import RequestHandling from './pages/AdminRequestHandling/RequestHandling';

import { UserContext } from './UserContext';
import api from './api/api';


const App = () => {
    const { isAuthenticated } = useContext(UserContext);
    const [userData, setUserData] = useState({});

    useEffect(() => {
        if (isAuthenticated) {
            const getUserData = async () => {
                try {
                    const response = await api.get('/auth/profile', {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                        },
                    });
                    setUserData(response.data);
                    console.log('Fetching user profile');
                } catch (error) {
                    console.error('Error during getting user data:', error);
                }
            };
            getUserData();
        }
    }, [isAuthenticated]);

    return (
        <Routes>
            <Route path="/" element={<Home userData={userData} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route
                path="/profile"
                element={isAuthenticated ? <Profile userData={userData} /> : <Navigate to="/login" />}
            />
            <Route
                path="/admin/accounts"
                element={isAuthenticated ? <AccountManagement userData={userData} /> : <Navigate to="/login" />}
            />
            {/* <Route 
                path='/admin/accounts' 
                element={userData.role==='admin' ? <AccountManagement /> : <Navigate to="/login" />} 
            /> */}

            {/* <Route path="/testpage" element={<TestPage />} /> */}
            <Route path="/admin" element={<AdminLayout />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="movies" element={<MovieManagement />} />
                <Route path="accounts2" element={<AccountManagement2 />} />
                <Route path="requests" element={<RequestHandling />} />
            </Route>

        </Routes>
    );
};

export default App;
