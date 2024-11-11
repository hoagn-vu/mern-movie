import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Register from './pages/Register/Register';
import Login from './pages/Login/Login';
import Home from './pages/Home/Home';
import Profile from './pages/Profile/Profile';
import AccountManagement from './pages/AccountManagement/AccountManagement';

import api from './api/api';

const App = () => {
    const isAuthenticated = !!(localStorage.getItem('accessToken') );
    const [userData, setUserData] = useState({});

    const fetchUserData = async (token) => {
        try {
            const response = await api.get('/auth/profile', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUserData(response.data);
            console.log('User data fetched:', response.data);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                localStorage.removeItem('accessToken');
                alert('Your session has expired. Please login again.');
                window.location.href = '/';
            } else {
                alert('Error during fetching user data: ', error);
            }
        }

    };

    useEffect(() => {
        if (isAuthenticated && !userData.id) {
            const token = localStorage.getItem('accessToken');
            fetchUserData(token);
        }
    }, [isAuthenticated]);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route
                    path="/profile"
                    element={isAuthenticated ? <Profile userData={userData} /> : <Navigate to="/login" />}
                />
                {/* <Route 
                    path='/admin/accounts' 
                    element={userData.role==='admin' ? <AccountManagement /> : <Navigate to="/login" />} 
                /> */}
            </Routes>
        </Router>
    );
};

export default App;
