import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import ReactPaginate from 'react-paginate';
import BarChart from '../../components/BarChart/BarChart';
import LineChart from '../../components/LineChart/LineChart';
import Pagination from '../../components/Pagination/Pagination';

import ImageWithSkeletonSwiper from '../../components/ImageWithSkeletonSwiper/ImageWithSkeletonSwiper';

const Dashboard = ({ userStats, totalGenres, movieStats }) => {
    const [modalChart, setModalChart] = useState('');
    const [isModalChartOpen, setIsModalChartOpen] = useState(false);
    const [modalRanking, setModalRanking] = useState('');
    const [isModalRankingOpen, setIsModalRankingOpen] = useState(false);

    const toggleModalChart = () => {
        setIsModalChartOpen((prev) => !prev);
    };

    const toggleModalRanking = () => {
        setIsModalRankingOpen((prev) => !prev);
    };

    const [totalViewsAllTime, setTotalViewsAllTime] = useState(0);
    const [totalViewsByMonth, setTotalViewsByMonth] = useState({});

    const [movieRankingByViews, setMovieRankingByViews] = useState([]);
    const [movieRankingByRating, setMovieRankingByRating] = useState([]);
    const [movieRankingByInteractions, setMovieRankingByInteractions] = useState([]);
    
    useEffect(() => {
        if (movieStats.length === 0) return;

        const moviesWithTotalViews = movieStats.map(movie => {
            const totalViews = movie.viewsPerMonth.reduce((sum, item) => sum + item.views, 0);
            return {
                ...movie,
                totalViews
            };
        });

        const totalViewsOfAllMovies = moviesWithTotalViews.reduce((sum, movie) => sum + movie.totalViews, 0);
        setTotalViewsAllTime(totalViewsOfAllMovies);

        const viewsByMonth = movieStats
            .flatMap(movie => movie.viewsPerMonth)
            .reduce((acc, { month, views }) => {
                acc[month] = (acc[month] || 0) + views;
                return acc;
            }, {});
        setTotalViewsByMonth(viewsByMonth);

        const currentMonth = new Date().toISOString().slice(0, 7); // Định dạng YYYY-MM
        const viewsForCurrentMonth = movieStats.map(movie => {
            const viewData = movie.viewsPerMonth.find(v => v.month === currentMonth);
            return {
                movieId: movie.movieId,
                mainTitle: movie.mainTitle,
                source: movie.source,
                views: viewData ? viewData.views : 0 // Nếu không có dữ liệu, trả về 0
            };
        });

        setMovieRankingByViews(viewsForCurrentMonth.sort((a, b) => b.views - a.views));
        setMovieRankingByRating(movieStats.sort((a, b) => b.averageRate - a.averageRate));
        setMovieRankingByInteractions(movieStats.sort((a, b) => b.totalComment - a.totalComment));
    }, [movieStats]);

  



    const generateMonthArray = (limit) => {
        const result = [];
        const now = new Date();
        let year = now.getFullYear();
        let month = now.getMonth() + 1;
        
        while (result.length < limit) {
        result.push(`${year}-${month.toString().padStart(2, "0")}`);
        month--;
        if (month < 1) {
            month = 12;
            year--;
        }
        }
    
        return result.sort();
    };

    const processDataForChart = (dataArr, labelArr) => {
        // Khởi tạo object đếm
        const counts = labelArr.reduce((acc, month) => {
        acc[month] = 0;
        return acc;
        }, {});
    
        // Duyệt qua data và đếm số lượng theo tháng
        dataArr.forEach(item => {
        const createdMonth = item.createdAt.slice(0, 7); // Lấy 'YYYY-MM' từ createdAt
        if (counts.hasOwnProperty(createdMonth)) {
            counts[createdMonth] += 1;
        }
        });
    
        // Trả về dữ liệu dưới dạng array
        return labelArr.map(month => counts[month]);
    };

    const processDataFromObject = (dataObject, monthsArray) => {
        // Tạo array data theo thứ tự của monthsArray
        return monthsArray.map(month => dataObject[month] || 0);
    };

    

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const getCurrentPageData = (data) => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return data.slice(startIndex, endIndex);
    };

    const currentData =
        modalRanking === 'views'
        ? getCurrentPageData(movieRankingByViews)
        : modalRanking === 'rate'
        ? getCurrentPageData(movieRankingByRating)
        : getCurrentPageData(movieRankingByInteractions);

    const totalPages = Math.ceil(
        (modalRanking === 'views'
        ? movieRankingByViews.length
        : modalRanking === 'rate'
        ? movieRankingByRating.length
        : movieRankingByInteractions.length) / itemsPerPage
    );

    





        



    return (
        <div className="container-fluid dashboard-container p-4 text-dark">
            <div className="row mb-3">
                <div className="col-12 col-md-6 col-lg-3 mb-3">
                    <div className="info-box d-flex align-items-center">
                        <i className="fas fa-film info-icon"></i>
                        <div className="info-content">
                            <h5>{movieStats.length}</h5>
                            <p>Bộ phim</p>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-6 col-lg-3 mb-3">
                    <div className="info-box d-flex align-items-center">
                        <i className="fa-solid fa-list info-icon"></i>
                        <div className="info-content">
                        <h5>{totalGenres}</h5>
                        <p>Thể loại</p>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-6 col-lg-3 mb-3">
                    <div className="info-box d-flex align-items-center">
                        <i className="fa-solid fa-eye info-icon"></i>
                        <div className="info-content">
                            <h5>{totalViewsAllTime}</h5>
                            <p>Lượt xem</p>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-6 col-lg-3 mb-3">
                    <div className="info-box d-flex align-items-center">
                        <i className="fas fa-user info-icon"></i>
                        <div className="info-content">
                            <h5>{userStats.length}</h5>
                            <p>Người dùng</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row mb-3">
                <div className="col-12 col-lg-6 mb-3">
                    <div className="chart-box p-3 pt-2">
                        <div className='chart-box-header d-flex justify-content-between align-items-center mb-1'>
                            <h5 className='m-0'>Người dùng đăng ký mới</h5>
                            <button 
                                className="btn btn-primary" 
                                onClick={() => {
                                toggleModalChart();
                                setModalChart('bar');
                                }}
                            >
                                {/* Xem chi tiết */}
                                <i class="fa-solid fa-ellipsis-vertical"></i>
                            </button>
                        </div>
                        <BarChart title={"Người dùng đăng ký"} labelInput={generateMonthArray(5)} dataInput={processDataForChart(userStats, generateMonthArray(5))} />
                    </div>
                </div>
                <div className="col-12 col-lg-6 mb-3">
                    <div className="chart-box p-3 pt-2">
                        <div className='chart-box-header d-flex justify-content-between align-items-center mb-1'>
                            <h5 className='m-0'>Lượt xem/Tháng</h5>
                            <button 
                            className="btn btn-primary" 
                            onClick={() => {
                                toggleModalChart();
                                setModalChart('line');
                            }}
                            >
                            {/* Xem chi tiết */}
                            <i class="fa-solid fa-ellipsis-vertical"></i>
                            </button>
                        </div>
                        <LineChart title={"Lượt xem/Tháng"} labelInput={generateMonthArray(5)} dataInput={processDataFromObject(totalViewsByMonth, generateMonthArray(5))} />

                        {/* <BarChart /> */}
                        {/* <LineChart /> */}
                    </div>
                </div>
            </div>

            {/* Modal xem chi tiết chart */}
            {isModalChartOpen && (
                <div className="modal d-block" onClick={toggleModalChart}>
                    <div className="modal-dialog modal-lg" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Chi tiết</h5>
                                <button className="btn-close" onClick={toggleModalChart}></button>
                            </div>
                            <div className="modal-body">
                                {modalChart === 'bar' ? (
                                <BarChart title={"Người dùng đăng ký"} labelInput={generateMonthArray(10)} dataInput={processDataForChart(userStats, generateMonthArray(10))} />
                                ) : (
                                <LineChart title={"Lượt xem/Tháng"} labelInput={generateMonthArray(10)} dataInput={processDataFromObject(totalViewsByMonth, generateMonthArray(10))} />
                                )}
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={toggleModalChart}>Đóng</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Hàng chứa 3 bảng xếp hạng */}
            <div className="row">
                <div className="col-md-12 col-lg-4">
                    <div className="ranking-box p-3 pt-2">
                        <div className='ranking-box-header d-flex justify-content-between align-items-center mb-1'>
                            <h5 className='mb-0 text-black'>Top lượt xem tháng {new Date().getMonth() + 1}</h5>
                            <button 
                                className="btn btn-primary" 
                                onClick={() => {
                                toggleModalRanking();
                                setModalRanking('views');
                                }}
                            >
                                <i class="fa-solid fa-ellipsis-vertical"></i>
                            </button>
                        </div>
                        <div className='table-responsive'>
                            <table className="table rounded m-0">
                                <tbody className='text-center align-middle'>
                                    {movieRankingByViews.slice(0, 3).map((movie, index) => (
                                        <tr key={movie.movieId}>
                                        <td>{index + 1}</td>
                                        <td><ImageWithSkeletonSwiper src={`https://idev1-bucket.s3.ap-southeast-2.amazonaws.com/movies/${movie.source}/poster`} alt={movie.mainTitle} className="movie-img" /></td>
                                        <td><div className='text-start'><strong>{movie.mainTitle}</strong><br/><small>{movie.views} lượt xem</small></div></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="col-md-12 col-lg-4">
                    <div className="ranking-box ranking-box-rate p-3 pt-2">
                        <div className='ranking-box-header d-flex justify-content-between align-items-center mb-1'>
                            <h5 className='mb-0 text-black'>Xếp hạng theo đánh giá</h5>
                            <button 
                                className="btn btn-primary" 
                                onClick={() => {
                                toggleModalRanking();
                                setModalRanking('rate');
                                }}
                            >
                                <i class="fa-solid fa-ellipsis-vertical"></i>
                            </button>
                        </div>
                        <div className='table-responsive'>
                            <table className="table rounded m-0">
                                <tbody className='text-center align-middle'>
                                    {movieRankingByRating.slice(0, 3).map((movie, index) => (
                                        <tr key={movie.movieId}>
                                        <td>{index + 1}</td>
                                        <td><ImageWithSkeletonSwiper src={`https://idev1-bucket.s3.ap-southeast-2.amazonaws.com/movies/${movie.source}/poster`} alt={movie.mainTitle} className="movie-img" /></td>
                                        <td><div className='text-start'><strong>{movie.mainTitle}</strong><br/><small>{movie.averageRate} / 5</small></div></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="col-md-12 col-lg-4">
                    <div className="ranking-box p-3 pt-2">
                        <div className='ranking-box-header d-flex justify-content-between align-items-center mb-1'>
                            <h5 className='text-black mb-0'>Xếp hạng theo tương tác</h5>
                            <button 
                                className="btn btn-primary" 
                                onClick={() => {
                                toggleModalRanking();
                                setModalRanking('interactions');
                                }}
                            >
                                <i class="fa-solid fa-ellipsis-vertical"></i>
                            </button>
                        </div>
                        <div className='table-responsive'>
                            <table className="table rounded m-0">
                                <tbody className='text-center align-middle'>
                                    {movieRankingByInteractions.slice(0, 3).map((movie, index) => (
                                        <tr key={movie.movieId}>
                                        <td>{index + 1}</td>
                                        <td><ImageWithSkeletonSwiper src={`https://idev1-bucket.s3.ap-southeast-2.amazonaws.com/movies/${movie.source}/poster`} alt={movie.mainTitle} className="movie-img" /></td>
                                        <td><div className='text-start'><strong>{movie.mainTitle}</strong><br/><small>{movie.totalComment} bình luận</small></div></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {isModalRankingOpen && (
                <div className="modal modal-ranking-movies d-block" onClick={toggleModalRanking}>
                    <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Chi tiết</h5>
                                <button className="btn-close" onClick={toggleModalRanking}></button>
                            </div>
                            <div className="modal-body ranking-modal-body d-flex flex-column">
                                <div className="table-responsive">
                                    <table className="table rounded m-0">
                                        <tbody className="text-center align-middle">
                                            {currentData.map((movie, index) => (
                                                <tr key={movie.movieId}>
                                                    <td className='index-table-modal-ranking'>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                                    <td>
                                                        <ImageWithSkeletonSwiper
                                                            src={`https://idev1-bucket.s3.ap-southeast-2.amazonaws.com/movies/${movie.source}/poster`}
                                                            alt={movie.mainTitle}
                                                            className="movie-img"
                                                        />
                                                    </td>
                                                    <td>
                                                    <div className="text-start">
                                                        <strong>{movie.mainTitle}</strong>
                                                        <br />
                                                        <small>
                                                        {modalRanking === 'views'
                                                            ? `${movie.views} lượt xem`
                                                            : modalRanking === 'rate'
                                                            ? `${movie.averageRate} / 5`
                                                            : `${movie.totalComment} bình luận`}
                                                        </small>
                                                    </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                />
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={toggleModalRanking}>
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
