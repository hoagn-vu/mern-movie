import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Sidebar2.css';
import api from '../../api/api';

import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const Sidebar2 = ({ userData, uploadingQueue, callClearQueue, hideToastBody, callHideToastBody, inSite, activeSite ,children }) => {
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




    const closeToast = () => {
        callClearQueue();
    };

    const isSomeStillLoading = uploadingQueue.some((movie) => movie.status === 'uploading');
    const isAllDone = uploadingQueue.every((movie) => movie.status === 'done');






    

    return (
        <div className=" d-flex">
            <div className={`sidebar bg-black text-white  ${isSidebarOpen ? 'open' : 'closed'}`}>
                <div className="sidebar-header bg-dark d-flex align-items-center mb-2">
                    <Link 
                        onClick={(e) => activeSite(e, 'welcome')}
                        className="p-3 navbar-brand d-flex align-items-center" 
                    >
                        <img src="https://i.imgur.com/MD7mgf9.png" alt="Logo" className='me-2' />
                        {isSidebarOpen && <span className="fs-5">Lovie</span>}
                    </Link>
                </div>
                <div className="nav-section d-flex flex-column mt-3">
                    {userData.accessControl.dashboard && (
                        <Link
                            onClick={(e) => activeSite(e, 'dashboard')}
                            className={`nav-link ${inSite==='dashboard' ? 'active' : ''} ps-3 mb-1 text-white d-flex align-items-center`}
                        >
                            <i className="fas fa-tachometer-alt me-3"></i>
                            {isSidebarOpen && <span>Bảng điều khiển</span>}
                        </Link>
                    )}
                    {userData.accessControl.movies && (
                        <Link
                            onClick={(e) => activeSite(e, 'movies')}
                            className={`nav-link ${inSite==='movies' ? 'active' : ''} ps-3 mb-1 text-white d-flex align-items-center`}
                        >
                            <i className="fas fa-film me-3"></i>
                            {isSidebarOpen && <span>Quản lý phim</span>}
                        </Link>
                    )}
                    {userData.accessControl.users && (
                        <Link
                            onClick={(e) => activeSite(e, 'accounts')}
                            className={`nav-link ${inSite==='accounts' ? 'active' : ''} ps-3 mb-1 text-white d-flex align-items-center`}
                        >
                            <i className="fas fa-users-cog me-3"></i>
                            {isSidebarOpen && <span>Quản lý tài khoản</span>}
                        </Link>
                    )}
                    {userData.accessControl.rolebased && (
                        <Link
                            onClick={(e) => activeSite(e, 'rolebased')}
                            className={`nav-link ${inSite==='rolebased' ? 'active' : ''} ps-3 mb-1 text-white d-flex align-items-center`}
                        >
                            <i class="fa-solid fa-user-tag me-3"></i>
                            {isSidebarOpen && <span>Phân quyền quản trị</span>}
                        </Link>
                    )}
                    {userData.accessControl.reports && (
                        <Link
                            onClick={(e) => activeSite(e, 'requests')}
                            className={`nav-link ${inSite==='requests' ? 'active' : ''} ps-3 mb-1 text-white d-flex align-items-center`}
                        >
                            <i className="fas fa-tasks me-3"></i>
                            {isSidebarOpen && <span>Người dùng phản hồi</span>}
                        </Link>
                    )}
                    {/* <Link
                        to="/"
                        className={`ps-3 mb-1 nav-link text-white d-flex align-items-center`}
                    >
                        <i className="fa-solid fa-people-arrows me-3"></i>
                        {isSidebarOpen && <span>Góc nhìn người dùng</span>}
                    </Link> */}
                </div>
            </div>

            <div className="main-content flex-grow-1">
                <header className="admin-header bg-black text-white shadow d-flex align-items-center justify-content-between p-3">
                    <div className="sidebar-btn rounded-circle bg-dark d-flex align-items-center justify-content-center" onClick={toggleSidebar}>
                        <i className="fas fa-bars"></i>
                    </div>
                
                    <div className="d-flex align-items-center">
                        <Link className="nav-link to-admin-site me-3" to="/"><i className="fa-solid fa-people-arrows me-2"></i>Góc nhìn người dùng</Link>
                        <li className="nav-item dropdown d-block">
                            <Link
                                className="nav-link dropdown-toggle d-flex align-items-center text-white"
                                id="navbarDropdown"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                <img src={`${userData.avatar}`} alt="User" style={{ width: '40px' }} className='rounded-circle avatar-img me-2'/>
                                <span> {userData.fullname}</span>
                            </Link>
                            <ul className="dropdown-menu bg-dark dropdown-menu-end" aria-labelledby="navbarDropdown">
                                <li>
                                <div className='d-flex align-items-center'>
                                    <Link className="dropdown-item text-white" id="account-dropdown-item" to="/profile">Hồ sơ</Link>
                                </div>
                                </li>
                                <li><Link className="dropdown-item text-white" id="account-dropdown-item" to="/favorite">Yêu thích</Link></li>
                                <li><Link className="dropdown-item text-white" id="account-dropdown-item" to="/history">Lịch sử xem</Link></li>
                                <li><hr className="dropdown-divider" /></li>
                                <li>
                                    <Link className="dropdown-item text-white" id="account-dropdown-item" onClick={handleLogout}>
                                        <div className='d-flex align-items-center justify-content-between'>
                                            Đăng xuất
                                            <i className="fa-solid fa-right-from-bracket"></i>
                                        </div>
                                    </Link>
                                </li>
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

export default Sidebar2;
