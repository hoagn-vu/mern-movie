import React, { useState } from 'react';
import './RequestHandling.css';

const RequestHandling = () => {
  const [reports, setReports] = useState([
    { id: 1, user: 'JohnDoe', movie: 'Movie 1', reason: 'Inappropriate content', date: '2024-10-01' },
    { id: 2, user: 'JaneDoe', movie: 'Movie 2', reason: 'Spam comments', date: '2024-10-02' },
    // Các report khác
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 10;

  const [selectedReport, setSelectedReport] = useState(null);

  const deleteReport = (reportId) => {
    setReports(reports.filter((report) => report.id !== reportId));
  };

  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = reports.slice(indexOfFirstReport, indexOfLastReport);

  const totalPages = Math.ceil(reports.length / reportsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Request Handling</h2>
        {/* <button className="btn btn-primary">Add Account</button> */}
      </div>
      <div className='table-responsive'>
        <table className="table table-hover tabble-bordered rounded">
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>User</th>
              <th>Movie</th>
              <th>Reason</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className='align-middle'>
            {currentReports.map((report, index) => (
              <tr key={report.id}>
                <td>{indexOfFirstReport + index + 1}</td>
                <td>{report.user}</td>
                <td>{report.movie}</td>
                <td>{report.reason}</td>
                <td>{report.date}</td>
                <td>
                  <button className="btn btn-info btn-sm me-2" onClick={() => setSelectedReport(report)}>View</button>
                  <button className="btn btn-danger btn-sm" onClick={() => deleteReport(report.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <nav>
        <ul className="pagination justify-content-center">
          {Array.from({ length: totalPages }, (_, index) => (
            <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
              <button className="page-link custom-focus" onClick={() => setCurrentPage(index + 1)}>
                {index + 1}
              </button>
            </li>
          ))}
        </ul>
      </nav>

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

