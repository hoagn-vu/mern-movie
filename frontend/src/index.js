import React from 'react';
import ReactDOM from 'react-dom/client'; // Đảm bảo bạn import từ 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { UserProvider } from './UserContext';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <BrowserRouter>
        <UserProvider>
            <App />
        </UserProvider>
    </BrowserRouter>
);
