import React, { useContext } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/scrollbar';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import './SwiperType2.css';
import { Link } from 'react-router-dom';
import { UserContext } from '../../UserContext';

import ImageWithSkeletonSwiper from '../ImageWithSkeletonSwiper/ImageWithSkeletonSwiper';

const SwiperType2 = ({ userId, title, moviesData }) => {
  const { isAuthenticated } = useContext(UserContext);

  const checkAuth = (e, movieId) => {
    if (!isAuthenticated) {
      if (!(window.confirm('Bạn cần đăng nhập để xem phim'))) {
        localStorage.setItem('chosenMovie', movieId);
        e.preventDefault();
      }
    }
  }

  return (
    <div className="container movie-swiper-type-2-container text-white">
      <h2 className='mb-3'>{ title }</h2>
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        spaceBetween={10} // Khoảng cách giữa các slide
        slidesPerView={5} // Mặc định hiển thị 5 ảnh
        slidesPerGroup={5} // Chuyển cả 5 ảnh khi nhấn nút điều hướng
        navigation // Kích hoạt điều hướng
        breakpoints={{
          320: { slidesPerView: 2, slidesPerGroup: 2, },
          640: { slidesPerView: 2, slidesPerGroup: 2, },
          768: { slidesPerView: 3, slidesPerGroup: 3, },
          1024: { slidesPerView: 5, slidesPerGroup: 5, },
        }}
      >
        {moviesData.map((movie, index) => (
          <SwiperSlide key={index}>
            <Link to={`/${userId}/watch/${movie._id}`} className='text-white text-decoration-none swiper-type-2-content' onClick={() => checkAuth(movie._id)}> 
              <ImageWithSkeletonSwiper src={`https://idev1-bucket.s3.ap-southeast-2.amazonaws.com/movies/${movie.source}/poster`} alt={movie.mainTitle} className="poster-fluid rounded" />
              <h5>{movie.mainTitle}</h5>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default SwiperType2;