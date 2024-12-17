import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(Boolean(localStorage.getItem("accessToken")));

    const handleOAuthLogin = () => {
        const params = new URLSearchParams(window.location.search);
        const accessToken = params.get("accessToken");
        // const userId = params.get("userId");

        if (accessToken) {
            localStorage.setItem("accessToken", accessToken);
            setIsAuthenticated(true);

            // Xóa query string khỏi URL
            window.history.replaceState({}, document.title, "/");
        }
    };

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const accessToken = params.get("accessToken");
        if (accessToken) {
            handleOAuthLogin();
            localStorage.setItem("accessToken", accessToken);
        }
        const token = localStorage.getItem("accessToken");
        if (token) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
    }, []);

    return (
        <UserContext.Provider value={{ isAuthenticated, setIsAuthenticated, handleOAuthLogin }}>
            {children}
        </UserContext.Provider>
    );
};