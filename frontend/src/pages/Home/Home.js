import React from 'react';

const Home = () => {
    const toLogin = () => {
        window.location.href = "/login";
    }

    return (
        <div className="container mt-5">
            <h1 className="text-center">Welcome to the Home Page</h1>
            <p className="text-center">This page is accessible without logging in.</p>

            <div className="text-center">
                <button className="btn btn-primary" onClick={toLogin}>Login</button>
            </div>
        </div>
    );
};

export default Home;
