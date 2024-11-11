import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Register from './pages/Register/Register';
import Login from './pages/Login/Login';
import Home from './pages/Home/Home';
import Profile from './pages/Profile/Profile';

import api from './api/api';

const App = () => {
    const isAuthenticated = !!(localStorage.getItem('token') || sessionStorage.getItem('token'));
    const [userData, setUserData] = useState({});

    const fetchUserData = async () => {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        try {
            const response = await api.get('/auth/profile', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUserData(response.data);
        } catch (error) {
            // if (error.response && error.response.status === 401) {
            //     localStorage.removeItem('token');
            //     sessionStorage.removeItem('token');
            //     alert('Your session has expired. Please login again.');
            //     window.location.href = '/';
            // } else {
                alert('Error during fetching user data: ', error);
            // }
        }
    };

    useEffect(() => {
        if (isAuthenticated && !userData.id) {
            fetchUserData();
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
            </Routes>
        </Router>
    );
};

export default App;
