import React from 'react';
import api from '../../api/api';
import { Link } from 'react-router-dom';

const Profile = ({ userData }) => {

    const handleLogout = () => {
        try {
            api.get('/auth/logout', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
        } catch (error) {
            console.error("Error during logout:", error);
        }
        localStorage.removeItem('accessToken');
        window.location.href = '/';
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center">Profile Page</h1>
            <p className="text-center">Welcome to your profile! This page is only accessible if you are logged in.</p>
            <p className="text-center">Username: {userData.username}</p>
            <p className="text-center">Email: {userData.email}</p>
            <p className='text-center'>Role: {userData.role}</p>
            <div className="text-center">
                <button className="btn btn-info">
                    <Link className='text-decoration-none text-white' to="/admin/accounts">Account Management</Link>
                </button>
            </div>
            <div className="text-center">
                <button className="btn btn-warning" onClick={handleLogout}>Logout</button>
            </div>
        </div>
    );
};

export default Profile;
