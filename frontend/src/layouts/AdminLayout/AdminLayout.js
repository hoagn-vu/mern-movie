import React, { useEffect } from 'react';
// import Footer from '../../components/Footer/Footer';
import Sidebar from '../../components/Sidebar/Sidebar';
import { Outlet } from 'react-router-dom';
import './AdminLayout.css'

const AdminLayout = () => {
  // useEffect(() => {
  //   document.querySelector('main').classList.add('main-admin-layout');
  //   return () => {
  //     document.querySelector('main').classList.remove('main-admin-layout');
  //   };
  // }, []);

  return (
    // <div className="admin-layout">
    //   <Sidebar />
    //   <div className="content">
    //     <Outlet />
    //   </div>
    // </div>
    <Sidebar>
      <Outlet />
    </Sidebar>
  );
};

export default AdminLayout;
