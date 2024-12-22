import React, { useState, useEffect } from 'react';
import './AccessControl.css';
import api from '../../api/api';
import Pagination from '../../components/Pagination/Pagination';

const AccessControl = ({ adminAccounts, setAdminAccounts, originalAdminAccounts, setOriginalAdminAccounts }) => {
    const [idToChangeAccessControl, setIdToChangeAccessControl] = useState('');
    const [preDashboard, setPreDashboard] = useState(false);
    const [preMovies, setPreMovies] = useState(false);
    const [preUsers, setPreUsers] = useState(false);
    const [preRolebased, setPreRolebased] = useState(false);
    const [preReports, setPreReports] = useState(false);

    const preChangeAccessControl = (id, dashboard, movies, users, rolebased, reports) => {
        setIdToChangeAccessControl(id);
        setPreDashboard(dashboard);
        setPreMovies(movies);
        setPreUsers(users);
        setPreRolebased(rolebased);
        setPreReports(reports);
    };
    const onChangeAC = (key) => {
        switch (key) {
            case 'dashboard':
                setPreDashboard((prev) => !prev);
                break;
            case 'movies':
                setPreMovies((prev) => !prev);
                break;
            case 'users':
                setPreUsers((prev) => !prev);
                break;
            case 'rolebased':
                setPreRolebased((prev) => !prev);
                break;
            case 'reports':
                setPreReports((prev) => !prev);
                break;
            default:
                break;
        }
    };
    const cancelChangeAccessControl = () => {
        setIdToChangeAccessControl('');
        setPreDashboard(false);
        setPreMovies(false);
        setPreUsers(false);
        setPreRolebased(false);
        setPreReports(false);
    };
    const changeAccessControl = async () => {
        if (window.confirm('Xác nhận thay đổi quyền truy cập?')) {
            try {
                const response = await api.put(`/account/access/${idToChangeAccessControl}`, {
                    dashboard: preDashboard,
                    movies: preMovies,
                    users: preUsers,
                    rolebased: preRolebased,
                    reports: preReports,
                });
                console.log(response.data);
                setAdminAccounts(adminAccounts.map((account) => (account._id === idToChangeAccessControl ? { ...account, accessControl: { dashboard: preDashboard, movies: preMovies, users: preUsers, rolebased: preRolebased, reports: preReports } } : account)));
                setOriginalAdminAccounts(adminAccounts.map((account) => (account._id === idToChangeAccessControl ? { ...account, accessControl: { dashboard: preDashboard, movies: preMovies, users: preUsers, rolebased: preRolebased, reports: preReports } } : account)));
                setIdToChangeAccessControl('');
                setPreDashboard(false);
                setPreMovies(false);
                setPreUsers(false);
                setPreRolebased(false);
                setPreReports(false);
            } catch (error) {
                console.error("Error changing access control:", error);
            }
        }
    };

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const getCurrentPageData = (data) => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return data.slice(startIndex, endIndex);
    };

    const currentData = getCurrentPageData(adminAccounts);
    const totalPages = Math.ceil(adminAccounts.length / itemsPerPage);



    const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
        
        setSortConfig({ key, direction });
    
        const sortedAccounts = [...adminAccounts].sort((a, b) => {
            if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
            if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
            return 0;
        });
        setAdminAccounts(sortedAccounts);
    };

    const clearSortConfig = () => {
        setSortConfig({ key: '', direction: '' });
        setAdminAccounts(originalAdminAccounts);
        setSearchTerm('');
    };

    const [searchTerm, setSearchTerm] = useState('');
    const handleChangeSearch = (event) => {
        const keyword = event.target.value.toLowerCase();
        setSearchTerm(keyword);
    
        if (keyword === '') {
        // Hiển thị tất cả phim nếu không có từ khóa
        setAdminAccounts(originalAdminAccounts);
        } else {
        // Lọc phim dựa trên từ khóa
        const filteredAccounts = originalAdminAccounts.filter((acc) =>
            acc.username?.toLowerCase().includes(keyword) || acc.fullname?.toLowerCase().includes(keyword)
        );
        setAdminAccounts(filteredAccounts);
        }
    };

    return (
        <div className="container-fluid access-control-container p-4">
            <div className="access-control-header pb-2 d-flex justify-content-between align-items-center mb-3">
                <h2 className='m-0'>Phân quyền quản trị</h2>

                <div className='right-header d-flex align-items-center'>
                    { sortConfig.key !== '' || searchTerm !== '' ? (
                        <button className='btn btn-outline-primary clear-filter-btn me-2' onClick={clearSortConfig}><i class="fa-solid fa-filter-circle-xmark"></i></button>
                    ) : null }

                    <div className="search-box me-2 rounded d-flex align-items-center">
                        <i class="search-icon me-2 fa-solid fa-magnifying-glass"></i>
                        <input
                            type="text"
                            className="search-input w-100"
                            placeholder="Tìm kiếm tài khoản..."
                            value={searchTerm}
                            onChange={handleChangeSearch}
                        />
                    </div>
                </div>
            </div>

            <div className='table-responsive access-control-table'>
                <table className="table table-hover tabble-bordered rounded">
                    <thead className="table-light">
                        <tr>
                            <th className='text-center'>#</th>
                            <th onClick={() => handleSort('username')} className='sort-header'>
                                Tên tài khoản
                                <i className={`fa-solid fa-sort ${
                                    sortConfig.key === 'username' 
                                        ? sortConfig.direction === 'asc'
                                        ? 'half-top' 
                                        : 'half-bottom'
                                        : ''
                                    } ms-2`} 
                                />
                            </th>
                            <th onClick={() => handleSort('fullname')} className='sort-header'>
                                Họ tên
                                <i className={`fa-solid fa-sort ${
                                    sortConfig.key === 'fullname' 
                                        ? sortConfig.direction === 'asc'
                                        ? 'half-top' 
                                        : 'half-bottom'
                                        : ''
                                    } ms-2`} 
                                />
                            </th>
                            <th className='text-center'>
                                Thống kê
                            </th>
                            <th className='text-center'>
                                Quản lý phim
                            </th>
                            <th className='text-center'>
                                Quản lý tài khoản
                            </th>
                            <th className='text-center'>
                                Phân quyền quản trị
                            </th>
                            <th className='text-center'>
                                Người dùng báo cáo
                            </th>
                            <th>
                                Thao tác
                            </th>
                        </tr>
                    </thead>
                    <tbody className='align-middle'>
                        {currentData.map((acc, index) => (
                            <tr key={acc._id}>
                                <td className='text-center'>{index + 1}</td>
                                <td>{acc.username}</td>
                                <td>{acc.fullname}</td>
                                <td className='text-center'>
                                    <input 
                                        class="form-check-input" 
                                        type="checkbox" 
                                        id={`flexCheck-${acc._id}`}
                                        onChange={() => onChangeAC('dashboard')}
                                        checked={idToChangeAccessControl && idToChangeAccessControl===acc._id ? preDashboard===true : acc.accessControl.dashboard===true}
                                        disabled={!idToChangeAccessControl || idToChangeAccessControl !== acc._id}
                                    />
                                </td>
                                <td className='text-center'>
                                    <input 
                                        class="form-check-input" 
                                        type="checkbox" 
                                        id={`flexCheck-${acc._id}`}
                                        onChange={() => onChangeAC('movies')}
                                        checked={idToChangeAccessControl && idToChangeAccessControl===acc._id ? preMovies===true : acc.accessControl.movies===true}
                                        disabled={!idToChangeAccessControl || idToChangeAccessControl !== acc._id}
                                    />
                                </td>
                                <td className='text-center'>
                                    <input 
                                        class="form-check-input" 
                                        type="checkbox" 
                                        id={`flexCheck-${acc._id}`} 
                                        onChange={() => onChangeAC('users')}
                                        checked={idToChangeAccessControl && idToChangeAccessControl===acc._id ? preUsers===true : acc.accessControl.users===true}
                                        disabled={!idToChangeAccessControl || idToChangeAccessControl !== acc._id}
                                    />
                                </td>
                                <td className='text-center'>
                                    <input 
                                        class="form-check-input" 
                                        type="checkbox" 
                                        id={`flexCheck-${acc._id}`} 
                                        onChange={() => onChangeAC('rolebased')}
                                        checked={idToChangeAccessControl && idToChangeAccessControl===acc._id ? preRolebased===true : acc.accessControl.rolebased===true}
                                        disabled={!idToChangeAccessControl || idToChangeAccessControl !== acc._id}
                                    />
                                </td>
                                <td className='text-center'>
                                    <input 
                                        class="form-check-input" 
                                        type="checkbox" 
                                        id={`flexCheck-${acc._id}`} 
                                        onChange={() => onChangeAC('reports')}
                                        checked={idToChangeAccessControl && idToChangeAccessControl===acc._id ? preReports===true : acc.accessControl.reports===true}
                                        disabled={!idToChangeAccessControl || idToChangeAccessControl !== acc._id}
                                    />
                                </td>
                                <td>
                                    {idToChangeAccessControl && idToChangeAccessControl===acc._id ? (
                                        <button 
                                            className='btn btn-sm btn-warning text-white send-btn me-2'
                                            onClick={changeAccessControl}
                                            disabled={preDashboard === acc.accessControl.dashboard && preMovies === acc.accessControl.movies && preUsers === acc.accessControl.users && preRolebased === acc.accessControl.rolebased && preReports === acc.accessControl.reports}
                                        >
                                            <i className={`fa-solid fa-check d-flex align-items-center justify-content-center`}></i>
                                        </button>                                        
                                    ) : (
                                        <button 
                                            className='btn btn-sm btn-warning text-white pre-change-btn me-2'
                                            onClick={() => preChangeAccessControl(acc._id, acc.accessControl.dashboard, acc.accessControl.movies, acc.accessControl.users, acc.accessControl.rolebased, acc.accessControl.reports)}
                                        >
                                            <i className={`fa-solid fa-pencil`}></i>
                                        </button>
                                    )}
                           
                                    <button 
                                        className='btn btn-sm btn-danger cancel-btn'
                                        onClick={cancelChangeAccessControl}
                                        disabled={!idToChangeAccessControl || idToChangeAccessControl !== acc._id}
                                    >
                                        <i className="fa-solid fa-xmark d-flex align-items-center justify-content-center"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {totalPages > 1 && (
                    <div className='d-flex justify-content-center'>
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                )}
      
            </div>

        </div>
    );
}

export default AccessControl;
