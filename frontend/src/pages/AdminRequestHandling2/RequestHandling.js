import React, { useState, useEffect } from 'react';
import './RequestHandling.css';
import api from '../../api/api';
import Pagination from '../../components/Pagination/Pagination';

const RequestHandling = ({ reports, setReports, originalReports, setOriginalReports, getAllReports }) => {

    const convertISODate = (isoDate) => {
        const date = new Date(isoDate);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Tháng bắt đầu từ 0
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');

        return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    };

    const handleChangeStatus = async (movieId, userId, reportId, status, curStatus) => {
        if (curStatus==='pending' && window.confirm('Xác nhận đã xử lý báo cáo?')) {
            try {
                await api.put(`/movies/${movieId}/change/${userId}/${reportId}`, { status });
                setReports((prev) =>
                    prev.map((report) =>
                        report.reportId === reportId && 
                        report.movieId === movieId && 
                        report.userId === userId
                            ? { ...report, status }
                            : report
                    )
                );
                setOriginalReports((prev) =>
                    prev.map((report) =>
                        report.reportId === reportId && 
                        report.movieId === movieId && 
                        report.userId === userId
                            ? { ...report, status }
                            : report
                    )
                );
            } catch (error) {
                console.error('Lỗi khi thay đổi trạng thái báo cáo:', error);
            }
        }
    };

    const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
        
        setSortConfig({ key, direction });
    
        const sortedReports = [...reports].sort((a, b) => {
            if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
            if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
            return 0;
        });
        setReports(sortedReports);
    };

    const clearSortConfig = () => {
        setSortConfig({ key: '', direction: '' });
        setReports(originalReports);
        setSearchTerm('');
    };

    const [searchTerm, setSearchTerm] = useState('');
    const handleChangeSearch = (event) => {
        const keyword = event.target.value.toLowerCase();
        setSearchTerm(keyword);
    
        if (keyword === '') {
            setReports(originalReports);
        } else {
            const filteredAccounts = originalReports.filter((rep) =>
                rep.username?.toLowerCase().includes(keyword) || rep.fullname?.toLowerCase().includes(keyword) || rep.email?.toLowerCase().includes(keyword) || rep.movieTitle?.toLowerCase().includes(keyword) || rep.content?.toLowerCase().includes(keyword)
            );
            setReports(filteredAccounts);
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

    const currentData = getCurrentPageData(reports);
    const totalPages = Math.ceil(reports.length / itemsPerPage);

    return (
        <div className="container-fluid handle-request-container p-4">
            <div className="request-handling-header pb-2 d-flex justify-content-between align-items-center mb-3">
                <h2 className='m-0'>Người dùng phản hồi</h2>
                <div className='right-header d-flex align-items-center'>
                    { sortConfig.key !== '' || searchTerm !== '' ? (
                        <button className='btn btn-outline-primary clear-filter-btn me-2' onClick={clearSortConfig}><i class="fa-solid fa-filter-circle-xmark"></i></button>
                    ) : null }

                    <div className="search-box me-2 rounded d-flex align-items-center">
                        <i class="search-icon me-2 fa-solid fa-magnifying-glass"></i>
                        <input
                        type="text"
                        className="search-input w-100"
                        placeholder="Tìm kiếm báo cáo..."
                        value={searchTerm}
                        onChange={handleChangeSearch}
                        />
                    </div>
                </div>
            </div>
            <div className='table-responsive'>
                <table className="table table-hover tabble-bordered rounded">
                    <thead className="table-light">
                        <tr>
                            <th>#</th>
                            <th className='sort-header' onClick={() => handleSort('username')}>
                                Tài khoản
                                <i className={`fa-solid fa-sort ${
                                    sortConfig.key === 'username' 
                                        ? sortConfig.direction === 'asc'
                                        ? 'half-top' 
                                        : 'half-bottom'
                                        : ''
                                    } ms-2`} 
                                />
                            </th>
                            <th className='sort-header' onClick={() => handleSort('fullname')}>
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
                            <th className='sort-header' onClick={() => handleSort('email')}>
                                Email
                                <i className={`fa-solid fa-sort ${
                                    sortConfig.key === 'email' 
                                        ? sortConfig.direction === 'asc'
                                        ? 'half-top' 
                                        : 'half-bottom'
                                        : ''
                                    } ms-2`} 
                                />
                            </th>
                            <th className='sort-header' onClick={() => handleSort('movieTitle')}>
                                Báo cáo phim
                                <i className={`fa-solid fa-sort ${
                                    sortConfig.key === 'movieTitle' 
                                        ? sortConfig.direction === 'asc'
                                        ? 'half-top' 
                                        : 'half-bottom'
                                        : ''
                                    } ms-2`} 
                                />
                            </th>
                            <th className='sort-header' onClick={() => handleSort('content')}>
                                Nội dung báo cáo
                                <i className={`fa-solid fa-sort ${
                                    sortConfig.key === 'content' 
                                        ? sortConfig.direction === 'asc'
                                        ? 'half-top' 
                                        : 'half-bottom'
                                        : ''
                                    } ms-2`} 
                                />
                            </th>
                            <th className='sort-header' onClick={() => handleSort('createAt')}>
                                Thời gian
                                <i className={`fa-solid fa-sort ${
                                    sortConfig.key === 'createAt' 
                                        ? sortConfig.direction === 'asc'
                                        ? 'half-top' 
                                        : 'half-bottom'
                                        : ''
                                    } ms-2`} 
                                />
                            </th>
                            <th className='sort-header' onClick={() => handleSort('status')}>
                                Trạng thái
                                <i className={`fa-solid fa-sort ${
                                    sortConfig.key === 'status' 
                                        ? sortConfig.direction === 'asc'
                                        ? 'half-top' 
                                        : 'half-bottom'
                                        : ''
                                    } ms-2`} 
                                />
                            </th>
                            {/* <th>Thao tác</th> */}
                        </tr>
                    </thead>
                    <tbody className='align-middle'>
                        {currentData.map((report, index) => (
                            <tr key={index}>
                                <td className='text-center'>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                <td>{report.username ? report.username : 'Chưa thiết lập'}</td>
                                <td>{report.fullname}</td>
                                <td>{report.email}</td>
                                <td>{report.movieTitle}</td>
                                <td>{report.content}</td>
                                <td>{convertISODate(report.createAt)}</td>
                                <td>
                                    <button 
                                        type="button" 
                                        class={`status-report-btn btn btn-sm ${report.status === 'processed' ? 'btn-success ' : 'btn-warning'}`}
                                        onClick={() => handleChangeStatus(report.movieId, report.userId, report.reportId, 'processed', report.status)}
                                    >
                                        {report.status === 'processed' ? 'Đã xử lý' : 'Chưa xử lý'}
                                    </button>
                                </td>
                                {/* <td>
                                
                                <button className="btn btn-info btn-sm me-2" onClick={() => setSelectedReport(report)}>View</button>
                                <button className="btn btn-danger btn-sm" onClick={() => deleteReport(report.id)}>Delete</button>
                                </td> */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

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
    );
};

export default RequestHandling;

