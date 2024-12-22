import React, { useContext, useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/scrollbar';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import './SwiperType1.css';
import { Link } from 'react-router-dom';
import { UserContext } from '../../UserContext';

import ImageWithSkeletonSwiper from '../ImageWithSkeletonSwiper/ImageWithSkeletonSwiper';

const SwiperType1 = ({ userId, title, moviesData, queryType, queryValue, displayOpenMore = true }) => {
    const { isAuthenticated } = useContext(UserContext);

    const navigate = useNavigate();

    // useEffect(() => {
    //     const titleWidth = document.querySelector('.movie-swiper-type-1-container .swiper-content-title').offsetWidth;
    //     document.querySelectorAll('.movie-swiper-type-1-container .swiper-button-next, .movie-swiper-type-1-container .swiper-button-prev').forEach(button => {
    //         button.style.top = `calc(50% - ${titleWidth / 2}px)`;
    //     });
    // }, []);
    // useEffect(() => {
    //     const updateButtonPosition = () => {
    //         const titleElement = document.querySelector('.movie-swiper-type-1-container .swiper-content-title');
    //         if (titleElement) {
    //             const titleWidth = titleElement.offsetWidth;
    //             document.querySelectorAll('.movie-swiper-type-1-container .swiper-button-next, .movie-swiper-type-1-container .swiper-button-prev').forEach(button => {
    //                 button.style.top = `calc(50% - ${titleWidth/2}px)`;
    //             });
    //         }
    //     };
    
    //     updateButtonPosition(); // Gọi lần đầu để thiết lập vị trí
    
    //     window.addEventListener('resize', updateButtonPosition);
    //     return () => {
    //         window.removeEventListener('resize', updateButtonPosition);
    //     };
    // }, []);

    // const [isBeginning, setIsBeginning] = useState(true);
    // const [isEnd, setIsEnd] = useState(false);
    // const prevRef = useRef(null);
    // const nextRef = useRef(null);


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

    let queryParams = new URLSearchParams({  }).toString();
    if (queryType && queryValue) {
        queryParams = new URLSearchParams({ [queryType]: queryValue }).toString();
    }


    return (
        <div className="container movie-swiper-type-1-container text-white">
            <div className="d-flex justify-content-between align-items-center mb-2">
                <h2 className='mb-0'>{ title }</h2>
                {displayOpenMore && (
                    <Link to={`/search?${queryParams}&title=${title}`} className='open-more text-secondary text-decoration-none'>Xem thêm</Link>
                )}
            </div>
            <Swiper
                modules={[Navigation, Pagination, Scrollbar, A11y]}
                spaceBetween={10}
                slidesPerView={5}
                slidesPerGroup={5}
                navigation
                // navigation={{
                //     prevEl: prevRef.current,
                //     nextEl: nextRef.current,
                // }}
                // onSlideChange={(swiper) => {
                //     setIsBeginning(swiper.isBeginning);
                //     setIsEnd(swiper.isEnd);
                // }}
                // onSwiper={(swiper) => {
                //     setIsBeginning(swiper.isBeginning);
                //     setIsEnd(swiper.isEnd);
                // }}

                breakpoints={{
                    320: { slidesPerView: 2, slidesPerGroup: 2, },
                    640: { slidesPerView: 2, slidesPerGroup: 2, },
                    768: { slidesPerView: 3, slidesPerGroup: 3, },
                    1024: { slidesPerView: 5, slidesPerGroup: 5, },
                }}
            >
            {moviesData.map((movie, index) => (
                <SwiperSlide key={index}>
                    <Link to={`/${userId}/watch/${movie._id}`} className='text-white text-decoration-none swiper-type-1-content' onClick={(e)=>checkAuth(e, movie._id )}>
                        <ImageWithSkeletonSwiper src={`https://idev1-bucket.s3.ap-southeast-2.amazonaws.com/movies/${movie.source}/banner`} alt={movie.mainTitle} className="poster-fluid rounded" />
                        <h5 className='swiper-content-title '>{movie.mainTitle}</h5>
                    </Link>
                </SwiperSlide>
            ))}
            </Swiper>
        </div>
    );
};

export default SwiperType1;
