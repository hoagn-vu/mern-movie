import React, { useState, useEffect } from 'react';
import './RequestHandling.css';
import api from '../../api/api';
import Pagination from '../../components/Pagination/Pagination';

const RequestHandling = () => {
    // const [reports, setReports] = useState([
    //   { id: 1, user: 'JohnDoe', movie: 'Movie 1', reason: 'Inappropriate content', date: '2024-10-01' },
    //   { id: 2, user: 'JaneDoe', movie: 'Movie 2', reason: 'Spam comments', date: '2024-10-02' },
    // ]);

    const [reports, setReports] = useState([]);
    const [selectedReport, setSelectedReport] = useState(null);

    const deleteReport = (reportId) => {
        setReports(reports.filter((report) => report.id !== reportId));
    };

    useEffect(() => {
        const getAllReports = async () => {
        try {
            const response = await api.get('/movies/getAllReports');
            setReports(response.data);
            console.log(response.data);
        } catch (error) {
            console.error('Error fetching reports:', error);
        }
        };

        getAllReports();
    }, []);

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



    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

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
            {/* <button className="btn btn-primary">Add Account</button> */}
        </div>
        <div className='table-responsive'>
            <table className="table table-hover tabble-bordered rounded">
            <thead className="table-light">
                <tr>
                <th>#</th>
                <th>Tài khoản</th>
                <th>Họ tên</th>
                <th>Báo cáo phim</th>
                <th>Nội dung báo cáo</th>
                <th>Thời gian</th>
                {/* <th>Thao tác</th> */}
                </tr>
            </thead>
            <tbody className='align-middle'>
                {currentData.map((report, index) => (
                    <tr key={index}>
                        <td className='text-center'>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td>{report.username ? report.username : 'Chưa thiết lập'}</td>
                        <td>{report.fullname}</td>
                        <td>{report.movieTitle}</td>
                        <td>{report.content}</td>
                        <td>{convertISODate(report.createAt)}</td>
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
        

        {/* Modal hiển thị chi tiết report */}
        {selectedReport && (
            <div className="modal d-block" onClick={() => setSelectedReport(null)}>
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Report Details</h5>
                        <button className="close" onClick={() => setSelectedReport(null)}>&times;</button>
                    </div>
                    <div className="modal-body">
                        <p><strong>User:</strong> {selectedReport.user}</p>
                        <p><strong>Movie:</strong> {selectedReport.movie}</p>
                        <p><strong>Reason:</strong> {selectedReport.reason}</p>
                        <p><strong>Date:</strong> {selectedReport.date}</p>
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={() => setSelectedReport(null)}>Close</button>
                    </div>
                    </div>
                </div>
            </div>
        )}
        </div>
    );
};

export default RequestHandling;

