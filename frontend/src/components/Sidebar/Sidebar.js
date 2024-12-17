import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import './Sidebar.css';
import api from '../../api/api';

import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const Sidebar = ({ userData, uploadingQueue, callClearQueue, hideToastBody, callHideToastBody ,children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    useEffect(() => {
        const handleResize = () => {
        setWindowWidth(window.innerWidth);
        if (window.innerWidth < 768) {
            setIsSidebarOpen(false);
        } else {
            setIsSidebarOpen(true);
        }
        };

        window.addEventListener('resize', handleResize);
        return () => {
        window.removeEventListener('resize', handleResize);
        };
    }, []);

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


    const [showToast, setShowToast] = useState(true);
    // const [hideToastBody, setHideToastBody] = useState(false);
    // const toggleToastBody = () => {
    //   setHideToastBody((prev) => !prev);
    // };
    const closeToast = () => {
        // setShowToast(false);
        callClearQueue();
    };
    const [isUploading, setIsUploading] = useState(false);

    // useEffect(() => {
    //   console.log("uploadingQueue:", uploadingQueue);
    // }, [uploadingQueue]);

    // Kiểm tra các phần tử trong uploadingQueue có phần tử nào đang ở trạng thái 'uploading' hay không
    const isSomeStillLoading = uploadingQueue.some((movie) => movie.status === 'uploading');
    const isAllDone = uploadingQueue.every((movie) => movie.status === 'done');


    // const [progresses, setProgresses] = useState(
    //   uploadingQueue.map(() => 0)
    // );

    // useEffect(() => {
    //     if (showToast) {
    //         setIsUploading(true);
    //         const interval = setInterval(() => {
    //             setProgresses((prev) =>
    //                 prev.map((p) => (p < 100 ? p + 5 : 100)) // Tăng dần giá trị progress
    //             );
    //         }, 500); // Cập nhật mỗi 500ms
    //         return () => clearInterval(interval); // Clear interval khi component unmount
            
    //     }
    // }, [showToast, isUploading]);
    

    return (
        <div className=" d-flex">
        {/* Sidebar */}
        <div className={`sidebar bg-black text-white  ${isSidebarOpen ? 'open' : 'closed'}`}>
            <div className="sidebar-header bg-dark d-flex align-items-center mb-2">
            <Link className="p-3 navbar-brand d-flex align-items-center" to="/admin/dashboard">
                <img src="https://i.imgur.com/MD7mgf9.png" alt="Logo" className='me-2' />
                {/* <img src="https://i.imgur.com/oFOA28M.png" alt="Logo" className='me-2' /> */}
                {/* <img src="https://i.imgur.com/qsNW0LL.png" alt="Logo" className='me-2' /> */}
                {isSidebarOpen && <span className="fs-5">Lovie</span>}
            </Link>
            </div>
            <div className="nav-section d-flex flex-column mt-3">
            <NavLink
                to="/admin/dashboard"
                className={`ps-3 mb-1 nav-link text-white d-flex align-items-center`}
            >
                <i className="fas fa-tachometer-alt me-3"></i>
                {isSidebarOpen && <span>Bảng điều khiển</span>}
            </NavLink>
            <NavLink
                to="/admin/movies"
                className={`ps-3 mb-1 nav-link text-white d-flex align-items-center`}
            >
                <i className="fas fa-film me-3"></i>
                {isSidebarOpen && <span>Quản lý phim</span>}
            </NavLink>
            <NavLink
                to="/admin/accounts2"
                className={`ps-3 mb-1 nav-link text-white d-flex align-items-center`}
            >
                <i className="fas fa-users-cog me-3"></i>
                {isSidebarOpen && <span>Quản lý tài khoản</span>}
            </NavLink>
            <NavLink
                to="/admin/requests"
                className={`ps-3 mb-1 nav-link text-white d-flex align-items-center`}
            >
                <i className="fas fa-tasks me-3"></i>
                {isSidebarOpen && <span>Người dùng phản hồi</span>}
            </NavLink>
            <NavLink
                to="/"
                className={`ps-3 mb-1 nav-link text-white d-flex align-items-center`}
            >
                <i className="fa-solid fa-people-arrows me-3"></i>
                {isSidebarOpen && <span>Góc nhìn người dùng</span>}
            </NavLink>
            </div>
        </div>

        {/* Main content */}
        <div className="main-content flex-grow-1">
            <header className="admin-header bg-black text-white shadow d-flex align-items-center justify-content-between p-3">
                <div className="sidebar-btn rounded-circle bg-dark d-flex align-items-center justify-content-center" onClick={toggleSidebar}>
                    <i className="fas fa-bars"></i>
                </div>
            
                <div className="d-flex align-items-center">
                    <div className="dropdown me-3">
                    <button
                        className="btn p-0 rounded-circle bg-dark notification dropdown-toggle"
                        type="button"
                        id="notificationDropdown"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                        <i className="far fa-bell text-white"></i>
                        <span className="notification-dot position-absolute"></span>
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="notificationDropdown">
                        <li><a className="dropdown-item" href="#">Notification 1</a></li>
                        <li><a className="dropdown-item" href="#">Notification 2</a></li>
                        <li><a className="dropdown-item" href="#">Notification 3</a></li>
                    </ul>
                    </div>
                    <li className="nav-item dropdown d-block">
                    <Link
                        className="nav-link dropdown-toggle d-flex align-items-center text-white"
                        href="#"
                        id="navbarDropdown"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                        {/* <img src="https://i.imgur.com/BwUIQuD.png" alt="User" style={{ width: '40px' }} className='rounded-circle avatar-img me-2'/> */}
                        <img src={`${userData.avatar}`} alt="User" style={{ width: '40px' }} className='rounded-circle avatar-img me-2'/>
                        <span> {userData.fullname}</span>
                    </Link>
                    <ul className="dropdown-menu bg-dark dropdown-menu-end" aria-labelledby="navbarDropdown">
                        <li>
                        <div className='d-flex align-items-center'>
                            <Link className="dropdown-item text-white" id="account-dropdown-item" to="/profile">Hồ sơ</Link>
                        </div>
                        </li>
                        <li><Link className="dropdown-item text-white" id="account-dropdown-item" href="#">Yêu thích</Link></li>
                        <li><Link className="dropdown-item text-white" id="account-dropdown-item" href="#">Lịch sử xem</Link></li>
                        <li><hr className="dropdown-divider" /></li>
                        <li><Link className="dropdown-item text-white" id="account-dropdown-item" onClick={handleLogout}>Đăng xuất</Link></li>
                    </ul>
                    </li>
                </div>
            </header>

            <div className="toast-container position-fixed bottom-0 end-0 pe-3" style={{ zIndex: 1055 }} >
                <div className={`toast upload-movie-toast align-items-center ${uploadingQueue.length>0 ? "show" : ""}`} data-bs-autohide="false" >
                    <div className="toast-header">
                        <i className="fa-solid fa-upload me-2"></i>
                        <h5 className="me-auto mb-0">
                            {isAllDone ? (
                            <strong>Đã tải lên {uploadingQueue.length} phim</strong>
                            ) : (
                            <strong>Đang tải lên {uploadingQueue.filter((item) => item.status === 'uploading').length } phim</strong>
                            )}
                        </h5>

                        <i className={`chevron-control-body fa-solid ${hideToastBody===false ? 'fa-chevron-down' : 'fa-chevron-up'} `} onClick={callHideToastBody}></i>
                        {isSomeStillLoading===false ? (
                            <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close" onClick={closeToast}></button>
                        ) : null }
                    </div>
                    <div className={`toast-body ${hideToastBody===false ? '' : 'hide-toast-body'}`}>
                        {uploadingQueue.filter((item) => item.status === 'uploading').length > 0 ? (
                            <div className="uploading-alert">
                                <p className="mb-0">Vui lòng không chuyển trang tránh gián đoạn...</p>
                            </div>
                        ) : null }
                        {uploadingQueue.map((movie, index) => (
                            <div className="movie-upload-row d-flex align-items-center" key={movie.id}>
                            <i className="upload-type-icon fa-solid fa-clapperboard me-3"></i>
                            <h6 className="me-auto mb-0">{movie.name}</h6>

                            {movie.status === 'done' ? (
                                <i className="fa-solid fa-check-circle text-success ms-3"></i>
                            ) : movie.status === 'failed' ? (
                                <i className="fa-solid fa-times-circle text-danger ms-3"></i>
                            ) : movie.status === 'uploading' && movie.progress === 100 ? (
                                <i className="fa-solid fa-spinner fa-spin text-warning ms-3"></i>
                                ) : (
                                <div className=" d-flex align-items-center" style={{ width: 18, height: 18 }}>
                                    <CircularProgressbar
                                    value={movie.progress}
                                    strokeWidth={12}
                                    // text={`${progresses[index]}%`}
                                    styles={buildStyles({
                                        textColor: '#000',
                                        pathColor: '#ff6500',
                                        trailColor: '#e5e7eb',
                                    })}
                                    />
                                </div>
                                )}
                            </div>
                        ))}

                        </div>
                    </div>
                </div>

                <div className="content">
                { children }
                </div>

            </div>
        </div>
    );
};

export default Sidebar;
