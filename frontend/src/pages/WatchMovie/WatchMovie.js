import React, { useState, useEffect } from 'react';
// import SwiperType1 from '../../components/SwiperType1/SwiperType1';
import DefaultLayout from '../../layouts/DefaultLayout/DefaultLayout';
import PlayerAndDetails from '../../components/PlayerAndDetails/PlayerAndDetails';
import CommentBox from '../../components/CommentBox/CommentBox';
import './WatchMovie.css';
import { useParams } from "react-router-dom";
import api from '../../api/api';

const WatchMovie = ({ userData }) => {
  const { userId, movieId } = useParams();
  const [movie, setMovie] = useState(null);
  
  const [allUserActivities, setAllUserActivities] = useState([]);

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [contentReport, setContentReport] = useState('');

  const handleOpenReportModal = () => {
    setIsReportModalOpen(true);
  };

  const handleCloseReportModal = () => {
    setContentReport('');
    setIsReportModalOpen(false);
  }

  useEffect(() => {
    const getMovieToWatch = async () => {
      try {
        const response = await api.get(`/movies/${userId}/get/${movieId}`);
        setMovie(response.data);
        setAllUserActivities(response.data.userActivity);
      } catch (error) {
        console.error('Error fetching movie by id:', error);
      }
    };

    getMovieToWatch();
  }, [movieId, userId]);

  const handleReport = async () => {
    try {
      const newReport = {
        userId: userId,
        content: contentReport,
        createAt: new Date(),
      };

      await api.post(`/movies/${movieId}/report`, newReport);

      alert("Report sent");
      setContentReport('');
      setIsReportModalOpen(false);
    } catch (error) {
      console.error("Error sending comment:", error);
    }
  };


  return (
    <DefaultLayout userData={userData} >

      <PlayerAndDetails movie={movie} movieId={movieId} userData={userData} callOpenReportModal={handleOpenReportModal} />

      {/* <SwiperType1 title='Nội dung liên quan' moviesData={} /> */}

      <CommentBox userData={userData} comments={allUserActivities || []} movieId={movieId} />

      {isReportModalOpen && (
        <div className="modal report-modal d-block" onClick={handleCloseReportModal}>
            <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content bg-dark">
              <div className="modal-header report-modal-header d-flex justify-content-between">
                <h5 className='modal-title'>Báo lỗi</h5>
                <button
                  className="btn-close btn-close-white"
                  onClick={handleCloseReportModal}
                ></button>
              </div>
              <div className="modal-body report-modal-body text-white">
                <label htmlFor="reportTextarea" className="form-label">Mô tả lỗi gặp phải:</label>
                <textarea className="form-control" id="reportTextarea" rows="4" value={contentReport} onChange={(e) => setContentReport(e.target.value)}></textarea>
              </div>
              <div className="modal-footer report-modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={handleCloseReportModal}
                >
                  Hủy
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={handleReport}
                >
                  Gửi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </DefaultLayout>
  );
};

export default WatchMovie;
