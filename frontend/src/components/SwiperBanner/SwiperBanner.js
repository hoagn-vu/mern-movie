import React, { useContext, useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Link, useNavigate } from 'react-router-dom'; // Import Link for navigation
import 'swiper/css';
import 'swiper/css/navigation';
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay, A11y } from 'swiper/modules';
import './SwiperBanner.css';
import { UserContext } from '../../UserContext';
import api from '../../api/api';

import ImageWithSkeletonSwiper from '../ImageWithSkeletonSwiper/ImageWithSkeletonSwiper';

const SwiperBanner = ({ userId, userFavorite, callChangeFavorite, moviesData }) => {
  const { isAuthenticated } = useContext(UserContext);
  const navigate = useNavigate();

  const checkAuth = (e, movieId) => {
    e.preventDefault();
    if (!isAuthenticated) {
      if (window.confirm('Bạn cần đăng nhập để xem phim. Nhấn Ok để tiếp tục đăng nhập!')) {
        localStorage.setItem('chosenMovie', movieId);
        navigate('/login');
      }
    } else {
      navigate(`/${userId}/watch/${movieId}`);
    }
  }

  const handleToggleFavorite = async (movId) => {
    if (!isAuthenticated) {
      alert('Bạn cần đăng nhập để thêm vào danh sách yêu thích');
      return;
    }
    try {
      const response = await api.post(`/movies/${userId}/favorite/${movId}`);
      callChangeFavorite(response.data.favoriteList);

    } catch (error) {
      console.error('Lỗi khi thêm vào danh sách yêu thích:', error);
    }
  };

  return (
    <div className="swip-bn-cont container movie-swiper-detail-container">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, A11y]}
        spaceBetween={20}
        slidesPerView={1}
        slidesPerGroup={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={true}
        breakpoints={{
          320: { slidesPerView: 1, slidesPerGroup: 1, },
          768: { slidesPerView: 1, slidesPerGroup: 1, },
          1024: { slidesPerView: 1, slidesPerGroup: 1, },
        }}
      >
        {moviesData.map((movie, index) => (
          <SwiperSlide key={index}>
            <div className="swiper-slide-content">
              <div className='swiper-image container'>
                <ImageWithSkeletonSwiper 
                  src={`https://idev1-bucket.s3.ap-southeast-2.amazonaws.com/movies/${movie.source}/banner`} 
                  alt={movie.mainTitle} 
                  className="poster-fluid" 
                />
                <img 
                  src="https://i.imgur.com/r6KvOcj.png"
                  alt="Overlay Image"
                  className="overlay-image"
                />
              </div>
              <div className="slide-info">
                <h2>{movie.mainTitle}</h2>
                <p>{movie.genres.join(' • ')}</p>
                <div className="slide-actions">
                  <Link to={`${userId}/watch/${movie._id}`} onClick={(e)=>checkAuth(e, movie._id )}>
                    <button className="watch-button">Xem ngay</button>
                  </Link>
                  <button className="like-button" onClick={() => handleToggleFavorite(movie._id)}>
                    { userFavorite && userFavorite.includes(movie._id) ? <i className="fa-solid fa-heart liked"></i> : <i className="far fa-heart"></i> }
                  </button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default SwiperBanner;
