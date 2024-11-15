import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(Boolean(localStorage.getItem("accessToken")));

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
    }, []);

    return (
        <UserContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
            {children}
        </UserContext.Provider>
    );
};