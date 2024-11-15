import React from "react";
// import AdminLayout from "../../layouts/AdminLayout/AdminLayout";
import Sidebar from "../../components/Sidebar/Sidebar";
import { Link } from "react-router-dom";

const TestPage = () => {
    return (
        <Sidebar>
            {/* <div className="container mt-5">
                <h1 className="text-center">Welcome to the Test Page</h1>
                <p className="text-center">This page is only accessible by admins.</p>
                <div className="text-center">
                <button className="btn btn-primary">
                    <Link className="text-decoration-none text-white" to="/admin/accounts">
                    Go to Account Management
                    </Link>
                </button>
                </div>
            </div> */}
        </Sidebar>
    );
};

export default TestPage;