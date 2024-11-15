import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ children }) => {
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

  return (
    <div className=" d-flex">
      {/* Sidebar */}
      <div className={`sidebar bg-black text-white  ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header bg-dark d-flex align-items-center mb-2">
          <a className="p-3 navbar-brand d-flex align-items-center" href="/admin">
            <img src="https://i.imgur.com/qsNW0LL.png" alt="Logo" className="me-2" />
            {isSidebarOpen && <span className="fs-5">vMovie</span>}
          </a>
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
            {isSidebarOpen && <span>Xử lý yêu cầu</span>}
          </NavLink>
        </div>
      </div>

      {/* Main content */}
      <div className="main-content flex-grow-1">
        <header className="admin-header bg-black text-white shadow d-flex align-items-center justify-content-between p-3">
          <div className="sidebar-btn rounded-circle bg-dark d-flex align-items-center justify-content-center"  onClick={toggleSidebar}>
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
            <div className="dropdown">
              <button
                className="btn d-flex align-items-center p-0 dropdown-toggle"
                type="button"
                id="userDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img
                  src="https://via.placeholder.com/40"
                  alt="User Avatar"
                  className="avatar img-fluid rounded-circle"
                />
                <span className="username ms-2">Username</span>
              </button>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                <li><a className="dropdown-item" href="#">Profile</a></li>
                <li><a className="dropdown-item" href="#">Settings</a></li>
                <li><hr className="dropdown-divider" /></li>
                <li><a className="dropdown-item" href="#">Logout</a></li>
              </ul>
            </div>
          </div>
        </header>
        <div className="content">
          { children }
        </div>

      </div>
    </div>
  );
};

export default Sidebar;
