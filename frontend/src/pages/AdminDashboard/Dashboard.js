import React, { useState } from 'react';
import './Dashboard.css';
// import BarChart from '../../components/BarChart/BarChart';
// import LineChart from '../../components/LineChart/LineChart';

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="container-fluid p-4 text-dark">
      {/* Hàng chứa 4 khối div */}
      <div className="row mb-4">
        <div className="col-12 col-md-6 col-lg-3 mb-3">
          <div className="info-box d-flex align-items-center">
            <i className="fas fa-film info-icon"></i>
            <div className="info-content">
              <h5>200</h5>
              <p>Movies</p>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6 col-lg-3 mb-3">
          <div className="info-box d-flex align-items-center">
            <i className="fas fa-user info-icon"></i>
            <div className="info-content">
              <h5>150</h5>
              <p>Users</p>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6 col-lg-3 mb-3">
          <div className="info-box d-flex align-items-center">
            <i className="fas fa-comment info-icon"></i>
            <div className="info-content">
              <h5>320</h5>
              <p>Comments</p>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6 col-lg-3 mb-3">
          <div className="info-box d-flex align-items-center">
            <i className="fas fa-chart-line info-icon"></i>
            <div className="info-content">
              <h5>50</h5>
              <p>New Signups</p>
            </div>
          </div>
        </div>
      </div>

      {/* Hàng chứa 2 khối div với chart */}
      <div className="row mb-4">
        <div className="col-12 col-lg-6 mb-3">
          <div className="chart-box p-3">
            <div className='chart-box-header d-flex justify-content-between align-items-center mb-2'>
              <h5 className='m-0'>Movies Growth</h5>
              <button className="btn btn-primary" onClick={toggleModal}>View Details</button>
            </div>
            {/* <BarChart /> */}
          </div>
        </div>
        <div className="col-12 col-lg-6 mb-3">
          <div className="chart-box p-3">
              <div className='chart-box-header d-flex justify-content-between align-items-center mb-2'>
                <h5 className='m-0'>User Activity</h5>
                <button className="btn btn-primary" onClick={toggleModal}>View Details</button>          
              </div>
            {/* <LineChart /> */}
          </div>
        </div>
      </div>

      {/* Modal xem chi tiết chart */}
      {isModalOpen && (
        <div className="modal d-block" onClick={toggleModal}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Chart Details</h5>
                <button className="close" onClick={toggleModal}>&times;</button>
              </div>
              <div className="modal-body">
                {/* <BarChart />  */}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={toggleModal}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hàng chứa 3 bảng xếp hạng */}
      <div className="row">
        <div className="col-12 col-md-4">
          <div className="ranking-box p-3">
            <h5>Top Movies</h5>
            <div className='table-responsive'>
              <table className="table table-bordered rounded m-0">
                <tbody className='text-center align-middle'>
                  <tr>
                    <td>1</td>
                    <td><img src="movie1.jpg" alt="Movie 1" className="movie-img" /></td>
                    <td><div className='text-start'><strong>Movie 1</strong><br/><small>2023</small></div></td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td><img src="movie2.jpg" alt="Movie 2" className="movie-img" /></td>
                    <td><div className='text-start'><strong>Movie 2</strong><br/><small>2022</small></div></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="ranking-box p-3">
            <h5>Top Users</h5>
            <div className='table-responsive'>
              <table className="table table-bordered rounded m-0">
                <tbody className='text-center align-middle'>
                  <tr>
                    <td>1</td>
                    <td><img src="user1.jpg" alt="User 1" className="movie-img" /></td>
                    <td><div className='text-start'><strong>User 1</strong><br/><small>Joined 2023</small></div></td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td><img src="user2.jpg" alt="User 2" className="movie-img" /></td>
                    <td><div className='text-start'><strong>User 2</strong><br/><small>Joined 2022</small></div></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="ranking-box p-3">
            <h5>Top Comments</h5>
            <div className='table-responsive'>
              <table className="table table-bordered rounded m-0">
                <tbody className='text-center align-middle'>
                  <tr>
                    <td>1</td>
                    <td><img src="comment1.jpg" alt="Comment 1" className="movie-img" /></td>
                    <td><div className='text-start'><strong>Comment 1</strong><br/><small>2023</small></div></td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td><img src="comment2.jpg" alt="Comment 2" className="movie-img" /></td>
                    <td><div className='text-start'><strong>Comment 2</strong><br/><small>2022</small></div></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
