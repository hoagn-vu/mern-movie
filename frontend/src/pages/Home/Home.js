import React from 'react';
import { Link } from 'react-router-dom';
import DefaultLayout from '../../layouts/DefaultLayout/DefaultLayout';

const Home = ({ userData }) => {

    return (
        <DefaultLayout userData={userData}>
            <div className="container mt-5">
                <h1 className="text-center">Welcome to the Home Page</h1>
                <p className="text-center">This page is accessible without logging in.</p>

                <div className="text-center">
                    <button className="btn btn-primary">
                        <Link className="text-decoration-none text-white" to="/login">Login</Link>
                    </button>
                </div>
            </div>
        </DefaultLayout>
    );
};

export default Home;
