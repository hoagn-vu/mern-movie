import React, { useEffect } from "react";
import api from "../../api/api";

const AccountManagement = () => {
    const toProfile = () => {
        window.location.href = '/profile';
    };

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
            <div className="text-center">
                <h1>Account Management</h1>
                <p>Here you can manage your account settings.</p>
            </div>
            <div className="text-center">
                <button className="btn btn-info" onClick={toProfile}>to Profile</button>
            </div>
            <div className="text-center">
                <button className="btn btn-warning" onClick={handleLogout}>Logout</button>
            </div>
        </div>
    );
}

export default AccountManagement;