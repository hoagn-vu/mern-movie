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
            console.error("Error during logout:", error);
        }
        localStorage.removeItem('accessToken');
        window.location.href = '/';
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-black sticky-top shadow">
            <div className="container">
                {/* Logo */}
                <a className="navbar-brand" href="/">
                    <img src="logo.png" alt="Logo" className='me-2' />
                    <span>Lmovie</span>
                </a>

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
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                        <a className="nav-link" href="/">Home</a>
                        </li>
                        <li className="nav-item">
                        <a className="nav-link" href="/movies">Movies</a>
                        </li>
                        <li className="nav-item">
                        <a className="nav-link" href="/about">About</a>
                        </li>
                        <li className="nav-item">
                        <a className="nav-link" href="/contact">Contact</a>
                        </li>
                    </ul>

                    {/* Icon Search luôn hiển thị trên màn hình lớn */}
                    <a className="nav-link d-none d-lg-block me-3" href="#">
                        <img src="search.svg" alt="Search" style={{ width: '30px' }} />
                    </a>

                    {isAuthenticated ? (
                        <li className="nav-item dropdown d-none d-lg-block">
                            <a
                            className="nav-link dropdown-toggle d-flex align-items-center text-white"
                            href="#"
                            id="navbarDropdown"
                            role="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                            >
                                <img src="https://via.placeholder.com/50" alt="User" style={{ width: '40px' }} className='rounded-circle me-2'/>
                                <span> {userData.username}</span>
                            </a>
                            <ul className="dropdown-menu bg-dark dropdown-menu-end" aria-labelledby="navbarDropdown">
                                <li><Link className="dropdown-item text-white" id="account-dropdown-item" to="/profile">Profile</Link></li>
                                <li><a className="dropdown-item text-white" id="account-dropdown-item" href="#">Settings</a></li>
                                <li><hr className="dropdown-divider" /></li>
                                <li><a className="dropdown-item text-white" id="account-dropdown-item" onClick={handleLogout}>Logout</a></li>
                            </ul>
                        </li>
                    ) : (
                        <Link className="text-decoration-none text-white" to="/login">Đăng nhập</Link>
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
                                <a
                                    className="nav-link dropdown-toggle d-flex align-items-center"
                                    href="#"
                                    id="offcanvasNavbarDropdown"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    {/* <img src="user.svg" alt="User" style={{ width: '40px' }} /> */}
                                    <img src="https://via.placeholder.com/40" alt="User" style={{ width: '40px' }} className='rounded-circle me-2' />
                                    <span>  Hoàng Vũ</span>
                                    {/* <span>  {userData.username}</span> */}
                                </a>
                                <ul className="dropdown-menu bg-dark" aria-labelledby="offcanvasNavbarDropdown">
                                    {/* <li><a className="dropdown-item text-white" id="account-dropdown-item" href="#">Action 1</a></li>
                                    <li><a className="dropdown-item text-white" id="account-dropdown-item" href="#">Action 2</a></li>
                                    <li><a className="dropdown-item text-white" id="account-dropdown-item" href="#">Action 3</a></li> */}
                                    <li><a className="dropdown-item text-white" id="account-dropdown-item" href="#">Profile</a></li>
                                    <li><a className="dropdown-item text-white" id="account-dropdown-item" href="#">Settings</a></li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li><a className="dropdown-item text-white" id="account-dropdown-item" onClick={handleLogout}>Logout</a></li>
                                    </ul>
                                {/* <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="offcanvasNavbarDropdown">
                                    <li><a className="dropdown-item" href="#">Profile</a></li>
                                    <li><a className="dropdown-item" href="#">Settings</a></li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li><a className="dropdown-item" href="#">Logout</a></li>
                                </ul> */}
                            </div>
                        ) : (
                            <Link className="text-decoration-none text-white" to="/login">Đăng nhập</Link>
                        )}
                        <div className="nav-item d-lg-none">
                            <a className="nav-link" href="#">
                                <img src="search.svg" alt="Search" style={{ width: '30px' }} />
                            </a>
                        </div>
                    </div>

                    <div className="offcanvas-body">
                        <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                            <li className="nav-item">
                                <a className="nav-link" href="/home">Home</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/movies">Movies</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/about">About</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/contact">Contact</a>
                            </li>                 
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Header;
