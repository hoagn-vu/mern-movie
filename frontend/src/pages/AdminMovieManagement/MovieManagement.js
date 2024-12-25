import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import './MovieManagement.css';
import UploadForm from '../UploadForm/UploadForm';
import EditMovieForm from '../EditMovieForm/EditMovieForm';
import Pagination from '../../components/Pagination/Pagination';
import api from '../../api/api';

import ImageWithSkeletonSwiper from '../../components/ImageWithSkeletonSwiper/ImageWithSkeletonSwiper';

const MovieManagement = ({}) => {
    const { handleUploadMovie, toggleToastBodyFunc } = useOutletContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [isAddingMovie, setIsAddingMovie] = useState(false);
    const [isEditingMovie, setIsEditingMovie] = useState(false);

    const [movieEdit, setMovieEdit] = useState(null);

    const { movies, setMovies, originalMovies, setOriginalMovies, getAllMovies } = useOutletContext();
    // const [movies, setMovies] = useState([]);
    // const [originalMovies, setOriginalMovies] = useState([]);
    // const getAllMovies = async () => {
    //   try {
    //     const response = await api.get('/movies/getAllMovies');
    //     setMovies(response.data);
    //     setOriginalMovies(response.data);
    //   } catch (error) {
    //     console.error('Error fetching movies:', error);
    //   }
    // };
    useEffect(() => {
        getAllMovies();
    }, []);

    const [moviePrePromote, setMoviePrePromote] = useState(null);
    const [startDatePromote, setStartDatePromote] = useState(new Date().toISOString().slice(0, 10));
    const [endDatePromote, setEndDatePromote] = useState(new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10));

    const handlePreSetMoviePromote = (currentPromoteStatus, endDate, movie) => {
        if (currentPromoteStatus === false || (currentPromoteStatus === true && new Date(endDate) < new Date())) {
            if (movie.status !== 'Available') {
                alert('Không thể thiết lập nổi bật cho phim bị ẩn!');
                return;
            }
            setMoviePrePromote(movie);
            toggleModal(true);
        } else if (currentPromoteStatus === true) {
            if (window.confirm(`Xác nhận hủy thiết lập nổi bật phim ${movie.mainTitle}?`)) {
                setMoviePromote(movie._id, false, '', '')
            }
        }
    };

    const setMoviePromote = async (id, isPromote, startDate, endDate) => {
        try {
            await api.put(`/movies/setPromote/${id}`, { isPromote, startDate, endDate });
            setMovies(movies.map(movie => {
                if (movie._id === id) {
                    return { ...movie, promote: { isPromote, startDate, endDate } };
                }
                    return movie;
            }));
            setOriginalMovies(originalMovies.map(movie => {
                if (movie._id === id) {
                    return { ...movie, promote: { isPromote, startDate, endDate } };
                }
            return movie;
        }));
        
        setMoviePrePromote(null);
        setStartDatePromote(new Date().toISOString().slice(0, 10));
        setEndDatePromote(new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10));
        setIsModalOpen(false);
        } catch (error) {
        console.error('Error setting movie promote:', error);
        }
    };

    const changeMovieStatus = async (id, name, status) => {
        // if (window.confirm(`Are you sure you want to ${status === "Available" ? 'show' : 'hide'} this movie?`)) {
        if (window.confirm(`Xác nhận ${status === "Available" ? 'hiển thị' : 'ẩn'} phim "${name}" với người dùng?`)) {
        try {
            console.log('Try to update movie status: ', id, status);
            await api.put(`/movies/updateInforMovie/${id}`, { status });
            // getAllMovies();
            setMovies(movies.map(movie => {
            if (movie._id === id) {
                if (status !== 'Available') {
                return { ...movie, status, promote: { isPromote: false, startDate: '', endDate: '' } };
                }
                return { ...movie, status };
            }
            return movie;
            }));
            console.log('Movie status updated: ', id, status);
        } catch (error) {
            console.error('Error updating movie status:', error);
        }
        }
    };

    const toggleModal = () => {
        setIsModalOpen((prev) => !prev);
    };

    const handleAddMovie = () => {
        setIsAddingMovie(true);
        toggleToastBodyFunc(true);
    };
    
    const afterEditOrAddMovie = () => {
        getAllMovies();
        toggleToastBodyFunc(false)
        setIsAddingMovie(false);
        setIsEditingMovie(false);
    };

    const handleClickEdit = (movie) => {
        setMovieEdit(movie);
        setIsEditingMovie(!isEditingMovie);
    };

    const cancelSettingPromote = () => {
        toggleModal(false);
        setMoviePrePromote(null);
        setStartDatePromote(new Date().toISOString().slice(0, 10));
        setEndDatePromote(new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10));
    }

    const toggleDeleteConfirm = ( mId = '' ) => {
        setMovieIdPreDelete(mId);
        setIsDeleteConfirmOpen(!isDeleteConfirmOpen);
    };

    const [movieIdPreDelete, setMovieIdPreDelete] = useState('');
    const handleDeleteMovie = async (movieName) => {
        if (window.confirm(`Xác nhận xóa phim ${movieName}?`)) {
            try {
                await api.delete(`/movies/delete/${movieIdPreDelete}`);
                setMovies(movies.filter((movie) => movie._id !== movieIdPreDelete));
                setOriginalMovies(originalMovies.filter((movie) => movie._id !== movieIdPreDelete));
                setIsDeleteConfirmOpen(false);
            } catch (error) {
                console.error('Lỗi khi xóa phim:', error);
            }
        }
    };




    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const getCurrentPageData = (data) => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return data.slice(startIndex, endIndex);
    };

    const currentData = getCurrentPageData(movies);
    const totalPages = Math.ceil(movies.length / itemsPerPage);



    const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
        direction = 'desc';
        }
        setSortConfig({ key, direction });
    
        const sortedMovies = [...movies].sort((a, b) => {
        if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
        if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
        return 0;
        });
        setSortConfigByPromote('asc');
        setMovies(sortedMovies);
    };

    const [sortConfigByPromote, setSortConfigByPromote] = useState('');
    const handleSortByPromote = () => {
        const sortedMovies = [...movies].sort((a, b) => {
        // Convert endDate to Date objects for comparison
        const endDateA = new Date(a.promote.endDate);
        const endDateB = new Date(b.promote.endDate);
    
        if (sortConfigByPromote === 'asc') {
            // Sort by isPromote first
            if (a.promote.isPromote !== b.promote.isPromote) {
            return a.promote.isPromote ? -1 : 1;
            }
            // If isPromote is equal, sort by endDate
            return endDateB - endDateA;
        } else {
            // Sort by isPromote first
            if (a.promote.isPromote !== b.promote.isPromote) {
            return a.promote.isPromote ? 1 : -1;
            }
            // If isPromote is equal, sort by endDate in descending order
            return endDateA - endDateB;
        }
        });
    
        setSortConfig({ key: '', direction: '' });
        setMovies(sortedMovies);
        setSortConfigByPromote(sortConfigByPromote === 'asc' ? 'desc' : 'asc');
    };

    const clearSortConfig = () => {
        setSortConfig({ key: '', direction: '' });
        setSortConfigByPromote('');
        setMovies(originalMovies);
        setSearchTerm('');
    };

    const [searchTerm, setSearchTerm] = useState('');
    const handleChangeSearch = (event) => {
        const keyword = event.target.value.toLowerCase();
        setSearchTerm(keyword);
    
        if (keyword === '') {
        // Hiển thị tất cả phim nếu không có từ khóa
        setMovies(originalMovies);
        } else {
        // Lọc phim dựa trên từ khóa
        const filteredMovies = originalMovies.filter((movie) =>
            movie.mainTitle.toLowerCase().includes(keyword)
        );
        setMovies(filteredMovies);
        }
    };

    // useEffect(() => {
    //   console.log('Return movie upload:', returnMovieUpload);
    //   if (returnMovieUpload.length > 0) {
    //     const newMovies = returnMovieUpload.filter(
    //       (movie) => !movies.some((m) => m._id === movie._id)
    //     );
    //     if (newMovies.length > 0) {
    //       setMovies((prevMovies) => [...prevMovies, ...newMovies]);
    //     }
    //   }
    // }, [returnMovieUpload, movies]);


  
  





  


  

  return (
    <div className="container-fluid movie-management-container p-4">
      { !isEditingMovie ? (
        !isAddingMovie ? (
          <div>
            <div className="movie-management-header pb-2 d-flex justify-content-between align-items-center mb-3">
              <h2 className='m-0'>Quản lý phim</h2>

              <div className='right-header d-flex align-items-center'>
                {/* <button className='btn btn-outline-primary clear-filter-btn me-2' onClick={clearSortConfig}><i className="fa-solid fa-filter-circle-xmark"></i></button> */}
                {sortConfig.key !== '' || sortConfigByPromote !== '' || searchTerm !== '' ? (
                  <button className='btn btn-outline-primary clear-filter-btn me-2' onClick={clearSortConfig}><i className="fa-solid fa-filter-circle-xmark"></i></button>
                  // <button className='btn btn-outline-primary me-2' onClick={clearSortConfig}><i className="fa-solid fa-filter-circle-xmark"></i></button>
                ) : null }
                <div className="search-box me-2 rounded d-flex align-items-center">
                  <i className="search-icon me-2 fa-solid fa-magnifying-glass"></i>
                  <input
                    type="text"
                    className="search-input w-100"
                    placeholder="Tìm kiếm phim..."
                    value={searchTerm}
                    onChange={handleChangeSearch}
                  />
                </div>
                <button className="btn btn-primary upload-btn" onClick={() => handleAddMovie()}><i className="fa-solid fa-upload me-2"></i> Đăng tải</button>
              </div>
            </div>



            {/* Bảng danh sách phim */}
            <div className='table-responsive table-movies'>
              <table className="table table-hover tabble-bordered rounded">
                <thead className="table-light">
                  <tr>
                    <th className='index-col-table-movies text-center'>#</th>
                    <th className='poster-col-table-movies'></th>
                    <th className="sort-header title-col-table-movies" onClick={() => handleSort('mainTitle')}>
                      Tên phim
                      <i className={`fa-solid fa-sort ${
                        sortConfig.key === 'mainTitle' 
                          ? sortConfig.direction === 'asc'
                            ? 'half-top' 
                            : 'half-bottom'
                          : ''
                        } ms-2`} 
                      />
                    </th>
                    <th className="sort-header release-date-col-table-movies" onClick={() => handleSort('releaseDate')}>
                      Công chiếu
                      <i className={`fa-solid fa-sort ${
                        sortConfig.key === 'releaseDate' 
                          ? sortConfig.direction === 'asc'
                            ? 'half-top' 
                            : 'half-bottom'
                          : ''
                        } ms-2`} 
                      />
                    </th>
                    <th className="sort-header upload-date-col-table-movies" onClick={() => handleSort('createdAt')}>
                      Ngày đăng tải
                      <i className={`fa-solid fa-sort ${
                        sortConfig.key === 'createdAt' 
                          ? sortConfig.direction === 'asc'
                            ? 'half-top' 
                            : 'half-bottom'
                          : ''
                        } ms-2`} 
                      />
                    </th>
                    <th className="sort-header status-col-table-movies" onClick={() => handleSort('status')}>
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
                    <th className="sort-header promote-col-table-movies" onClick={handleSortByPromote}>
                      Thiết lập nổi bật
                      <i
                        className={`sort-icon fa-solid  fa-sort ${
                          sortConfig.key === '' && sortConfigByPromote !== ''
                            ? sortConfigByPromote === 'asc'
                              ? 'half-top' 
                              : 'half-bottom'
                            : ''
                        } ms-2`}
                      ></i>
                    </th>
                    <th className='action-col-table-movies'>Thao tác</th>
                  </tr>
                </thead>
                <tbody className='align-middle'>
                  {currentData.map((movie, index) => (
                    <tr key={movie._id}>
                      <td className='text-center'>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td>
                        <ImageWithSkeletonSwiper 
                          src={`https://idev1-bucket.s3.ap-southeast-2.amazonaws.com/movies/${movie.source}/poster`} 
                          alt={movie.subTitle} 
                          className="movie-img" 
                        />
                      </td>
                      <td>{movie.mainTitle}</td>
                      <td>
                        {movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : ''}
                      </td>
                      <td>
                        {movie.createdAt ? (() => {
                          const createdAt = new Date(movie.createdAt);
                          return `${createdAt.getDate()}/${createdAt.getMonth() + 1}/${createdAt.getFullYear()}`;
                        })() : ''}
                      </td>
                      <td>
                        <div className="form-check form-switch">
                          <input 
                            className="form-check-input custom-switch" 
                            type="checkbox"
                            role="switch"
                            id="flexSwitchMovieStatus"
                            checked={movie.status==='Available'} 
                            onChange={() => changeMovieStatus(movie._id, movie.mainTitle, (movie.status === 'Available' ? 'Invisible' : 'Available'))}
                          />
                          <label className="form-check-label">{movie.status === 'Available' ? 'Khả dụng' : 'Đã ẩn'}</label>
                        </div>
                      </td>
                      <td>
                        <div className="form-check form-switch">
                          <input 
                            className="form-check-input custom-switch" 
                            type="checkbox"
                            role="switch"
                            id="flexSwitchMoviePromote"
                            checked={movie.promote.isPromote && new Date(movie.promote.endDate) > new Date()}
                            onChange={() => handlePreSetMoviePromote(movie.promote.isPromote, movie.promote.endDate, movie)}
                          />
                          <label className="form-check-label">
                            {movie.promote.isPromote && new Date(movie.promote.endDate) > new Date() ? movie.promote.endDate.slice(0, 10) : 'Thiết lập'}
                          </label>
                        </div>
                      </td>
                      <td>
                      <button className="btn btn-warning me-2" onClick={() => handleClickEdit(movie)}>
                        <i className="fas fa-edit text-white"></i>
                      </button>
                        {/* <button className="btn btn-danger" onClick={() => toggleDeleteConfirm(movie._id)}> */}
                        <button className="btn btn-danger" onClick={()=>handleDeleteMovie(movie.mainTitle)}>
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </td>
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
    
            {/* Modal Thiết lập nổi bật*/}
            {isModalOpen && (
              <div className="modal d-block modal-promote-setting" onClick={() => toggleModal(false)}>
                <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-content modal-promote-setting-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Thiết Lập Nổi Bật</h5>
                      <button
                        className="btn-close"
                        onClick={() => toggleModal(false)}
                      ></button>
                    </div>
                    <div className="modal-body">
                      <h5>Phim: {moviePrePromote.mainTitle}</h5>
                      <div className='row'>
                        <div className="col-6 form-group">
                          <label htmlFor="startDate">Ngày bắt đầu</label>
                          <input type="date" className="form-control mt-1" id="startDate" value={startDatePromote} onChange={(e)=>setStartDatePromote(e.target.value)} />
                        </div>

                        <div className="col-6 form-group">
                          <label htmlFor="endDate">Ngày kết thúc</label>
                          <input type="date" className="form-control mt-1" id="endDate" value={endDatePromote} onChange={(e)=>setEndDatePromote(e.target.value)} />
                        </div>
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button className="btn btn-secondary" onClick={cancelSettingPromote}>Hủy</button>
                      <button className="btn btn-primary" onClick={() => setMoviePromote(moviePrePromote._id, true, startDatePromote, endDatePromote) } >Lưu</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
    
            {/* Modal confirm delete */}
            {isDeleteConfirmOpen && (
              <div className="modal d-block" onClick={toggleDeleteConfirm}>
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Delete Movie</h5>
                      <button className="close" onClick={toggleDeleteConfirm}>&times;</button>
                    </div>
                    <div className="modal-body">
                      Are you sure you want to delete this movie?
                    </div>
                    <div className="modal-footer">
                      <button className="btn btn-secondary" onClick={toggleDeleteConfirm}>Hủy</button>
                      <button className="btn btn-danger">Xóa</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <UploadForm callCancelAddMovie={afterEditOrAddMovie} callUploadMovie={handleUploadMovie} />
          </div>
        )
      ) : (
        <EditMovieForm movieDataEdit={movieEdit} callCancelEditMovie={afterEditOrAddMovie}/>
      )}
    </div>
  );
};

export default MovieManagement;
