import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DefaultLayout from '../../layouts/DefaultLayout/DefaultLayout';
import './WatchHistory.css';
import api from '../../api/api';

import ImageWithSkeletonSwiper from '../../components/ImageWithSkeletonSwiper/ImageWithSkeletonSwiper';

const WatchHistory = ({ userData }) => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    
    const [watchHistory, setWatchHistory] = useState([]);

    useEffect(() => {
        const fetchWatchHistory = async () => {
            try {
                const response = await api.get(`/movies/${userData._id}/getWatchHistory`);
                setWatchHistory(response.data.sort((a, b) => new Date(b.at) - new Date(a.at)));
            } catch (error) {
                console.error('Error fetching watch history:', error);
            }
        };

        fetchWatchHistory();
    }, [userData._id]);

    const groupedData = watchHistory.reduce((acc, item) => {
        const dateKey = new Date(item.at).toLocaleDateString('vi-VN');
        if (!acc[dateKey]) {
            acc[dateKey] = [];
        }
        acc[dateKey].push(item);
        return acc;
    }, {});
        

    return (
        <DefaultLayout userData={userData}>
            <div className='container watch-history-container'>
                <div className='watch-history-header text-white mt-2 pb-2 d-flex align-items-center justify-content-center'>
                    <h2 className='m-0'>Lịch sử xem phim</h2>
                </div>

                { watchHistory.length > 0 ? Object.keys(groupedData).map((dateKey, index) => (
                    <div className='watch-history-date-section' key={index}>
                        <div className='watch-history-date text-white mt-3 mb-3'>
                            <h4>
                                {dateKey === new Date().toLocaleDateString('vi-VN') 
                                    ? 'Hôm nay:' 
                                    : dateKey === new Date(Date.now() - 86400000).toLocaleDateString('vi-VN') 
                                        ? 'Hôm qua:' 
                                        : dateKey + ':'}
                            </h4>
                        </div>

                        <div className='row'>
                            {groupedData[dateKey].map((item, itemIndex) => (
                                <div className='watch-history-item col-6 col-md-4 col-lg-3 mb-3' key={itemIndex}>
                                    <Link to={`/watch/${item.movieId}`} className='watch-history-link text-decoration-none text-white'>
                                        <div className='watch-history-thumbnail'>
                                            <ImageWithSkeletonSwiper 
                                                src={`https://idev1-bucket.s3.ap-southeast-2.amazonaws.com/movies/${item.source}/banner`}
                                                alt={`${item.mainTitle}`} 
                                                className='watch-history-img rounded'
                                            />
                                            {/* <i className="fa-solid fa-crosshairs play-icon"></i> */}
                                            <i className="fa-solid fa-play play-icon"></i>
                                            <div className='watch-history-duration rounded'>
                                                <div className='watch-history-duration-progress rounded' style={{ width: `${(item.timeWatched / item.duration) * 100}%` }}></div>
                                            </div>
                                        </div>
                                        <h5 className='watch-history-title mt-1'>{item.mainTitle}</h5>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                )) : (
                    <div className='watch-history-empty text-white text-center mt-5'>
                        <h4>Chưa có dữ liệu lịch sử xem phim</h4>
                    </div>
                )
            }
            </div>
        </DefaultLayout>
    );
};

export default WatchHistory;
