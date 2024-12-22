import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../../UserContext';
import api from '../../api/api';
import './Header.css';

const Header = ({ userData }) => {
    const { isAuthenticated } = useContext(UserContext);

    const handleLogout = () => {
        try {
            api.get('/auth/logout', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
        } catch (error) {
            console.error("Lỗi khi đăng xuất:", error);
        }
        localStorage.removeItem('accessToken');
        window.location.href = '/';
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-black sticky-top shadow">
            <div className="container header-comp-container">
                {/* Logo */}
                <Link className="navbar-brand" to="/">
                    <img src="https://i.imgur.com/MD7mgf9.png" alt="Logo" className='me-2' />
                    {/* <img src="https://i.imgur.com/oFOA28M.png" alt="Logo" className='me-2' /> */}
                    {/* <img src="https://i.imgur.com/qsNW0LL.png" alt="Logo" className='me-2' /> */}
                    <span>Lovie</span>
                </Link>

                {/* Toggle button (bars) chỉ hiển thị trên màn hình nhỏ */}
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#offcanvasNavbar"
                    aria-controls="offcanvasNavbar"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Nav links và các nút (hiển thị trên màn hình lớn) */}
                <div className="collapse navbar-collapse nav-link-menu-list">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <div>
                                <Link className="nav-link" to="/">Trang chủ</Link>
                            </div>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/search">Tìm kiếm</Link>
                        </li>

                        {isAuthenticated && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/favorite">Yêu thích</Link>
                            </li>
                        )}

                    </ul>

                    {/* Icon Search luôn hiển thị trên màn hình lớn */}
                    <Link className="nav-link d-none d-lg-block me-3 text-white search-div" href="#">
                        {userData.role === 'admin' && (
                            <Link className="nav-link to-admin-site" to="/admin/dashboard">Chuyển đổi QTV</Link>
                        )}
                        {/* <i className="fas fa-search me-2"></i> */}
                    </Link>

                    {isAuthenticated ? (
                        <li className="nav-item dropdown d-none d-lg-block">
                            <Link
                                className="nav-link dropdown-toggle d-flex align-items-center text-white"
                                href="#"
                                id="navbarDropdown"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                <img src={`${userData.avatar}`} alt="User" style={{ width: '45px' }} className='rounded-circle avatar-img me-2'/>
                                {/* <img src="https://i.imgur.com/jzX5Wa6.png" alt="User" style={{ width: '40px' }} className='rounded-circle avatar-img me-2'/> */}
                                <span> {userData.fullname}</span>
                            </Link>
                            <ul className="dropdown-menu bg-dark dropdown-menu-end" aria-labelledby="navbarDropdown">
                                <li>                                        
                                    <Link className="dropdown-item text-white" id="account-dropdown-item" to="/profile">Hồ sơ</Link>
                                </li>
                                <li><Link className="dropdown-item text-white" id="account-dropdown-item" to="/favorite">Yêu thích</Link></li>
                                <li><Link className="dropdown-item text-white" id="account-dropdown-item" to="/history">Lịch sử xem</Link></li>
                                {/* {userData.role === 'admin' && (
                                    <li><Link className="dropdown-item text-white" id="account-dropdown-item" to="/admin/dashboard">Trang quản trị</Link></li>
                                )} */}
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
                    ) : (
                        <Link className="text-decoration-none text-white to-login-site" to="/login">Đăng nhập/Đăng ký</Link>
                    )}
                </div>

                {/* Sidebar (offcanvas) chỉ hiển thị trên màn hình nhỏ */}
                <div
                    className="offcanvas offcanvas-start bg-dark d-lg-none"
                    tabIndex="-1"
                    id="offcanvasNavbar"
                    aria-labelledby="offcanvasNavbarLabel"
                >
                    <div className="offcanvas-header d-flex align-items-center justify-content-between">
                        {isAuthenticated ? (
                            <div className="nav-item dropdown d-lg-none text-white">
                                <Link
                                    className="nav-link dropdown-toggle d-flex align-items-center"
                                    href="#"
                                    id="offcanvasNavbarDropdown"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    <img src={`${userData.avatar}`} alt="User" style={{ width: '45px' }} className='rounded-circle me-2' />
                                    <span>  {userData.fullname}</span>
                                </Link>
                                <ul className="dropdown-menu bg-dark" aria-labelledby="offcanvasNavbarDropdown">
                                    <li>
                                        <Link className="dropdown-item text-white" id="account-dropdown-item" to="/profile">Hồ sơ</Link>
                                    </li>
                                    <li>
                                        <Link className="dropdown-item text-white" id="account-dropdown-item" to="/history">Lịch sử xem</Link>
                                    </li>
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
                                {/* <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="offcanvasNavbarDropdown">
                                    <li><Link className="dropdown-item" href="#">Hồ sơ</Link></li>
                                    <li><Link className="dropdown-item" href="#">Settings</Link></li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li><Link className="dropdown-item" href="#">Đăng xuất</Link></li>
                                </ul> */}
                            </div>
                        ) : (
                            <Link className="text-decoration-none text-white to-login-site" to="/login">Đăng nhập/Đăng ký</Link>
                        )}
                        <div className="nav-item d-lg-none">
                            {userData.role === 'admin' && (
                                <Link className="nav-link" to="/admin/dashboard">Chuyển đổi QTV</Link>
                            )}
                            {/* <Link className="nav-link" href="#">
                                <i className="fas fa-search text-white" style={{  }}></i>
                            </Link> */}
                        </div>
                    </div>

                    <div className="offcanvas-body">
                        <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                            <li className="nav-item">
                                <Link className="nav-link" to="/">Trang chủ</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/search">Tìm kiếm</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/favorite">Yêu thích</Link>
                            </li>
                            {/* {userData.role === 'admin' && (
                                <li className="nav-item">
                                    <Link className="nav-link" to="/admin/dashboard">Trang quản trị</Link>
                                </li>
                            )} */}
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Header;
