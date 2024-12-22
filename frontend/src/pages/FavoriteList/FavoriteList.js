import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './FavoriteList.css';
import DefaultLayout from '../../layouts/DefaultLayout/DefaultLayout';
import api from '../../api/api';

import ImageWithSkeletonSwiper from '../../components/ImageWithSkeletonSwiper/ImageWithSkeletonSwiper';

const FavoriteList = ({ userData, userFavorite, callChangeFavorite }) => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const [favoriteList, setFavoriteList] = useState([]);

    useEffect(() => {
        const getFavoriteList = async () => {
            try {
                const response = await api.get(`/movies/${userData._id}/getFavoriteList`);
                // setFavoriteList(response.data);
                setFavoriteList(Array.isArray(response.data) ? response.data : []);
            } catch (error) {
                console.error('Error during getting favorite list:', error);
            }
        };
        getFavoriteList();
    }, [userData._id]);

    const [isEditingFL, setIsEditingFL] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);

    const handleEditToggle = () => {
        if (isEditingFL) {
            // alert(`Selected items: ${selectedItems.join(', ')}`);
            if (selectedItems.length > 0) {
                if (window.confirm('Bạn có chắc chắn muốn xóa?')) {
                    handleDeleteSelected();
                }
            }
        }
        setIsEditingFL(!isEditingFL);
        if (!isEditingFL) setSelectedItems([]);
    };

    const handleLinkClick = (e) => {
        if (isEditingFL) {
            e.preventDefault();
        }
    };

    const handleCheckboxChange = (movieId) => {
        setSelectedItems((prev) =>
            prev.includes(movieId)
                ? prev.filter((id) => id !== movieId)
                : [...prev, movieId]
        );
    };
    

    const handleSelectAll = () => {
        if (selectedItems.length === favoriteList.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(favoriteList.map(item => item.movieId));
        }
    };

    const handleCancelEdit = () => {
        setSelectedItems([]);
        setIsEditingFL(false);
    };

    const handleDeleteSelected = async () => {
        try {
            const removedList = favoriteList.filter(item => !selectedItems.includes(item.movieId));
            await api.put(`/movies/${userData._id}/removeFavorites`, { movieIds: favoriteList.filter(item => selectedItems.includes(item.movieId)).map(item => item.movieId) });

            setFavoriteList(removedList);
            callChangeFavorite(removedList.map(item => item.movieId));

            setSelectedItems([]);
            setIsEditingFL(false);
            // alert('Đã xóa khỏi danh sách yêu thích');
        } catch (error) {
            console.error('Lỗi khi xóa phim khỏi danh sách yêu thích:', error);
        }
    };


    return (
        <DefaultLayout userData={userData}>
            <div className='container favorite-movie-container'>
                <div className='favorite-movie-header text-white mt-2 pb-2 d-flex align-items-center justify-content-between'>
                    <h2 className='m-0'>Danh sách yêu thích</h2>
                    <div className=''>
                        {isEditingFL && (
                            <button className='btn btn-outline-primary cancel-edit-favorite-btn me-2' onClick={handleCancelEdit}>
                                Hủy bỏ
                            </button>
                        )}
                        <button className={`btn btn-primary edit-favorite-btn ${(isEditingFL && selectedItems.length === 0) || favoriteList.length===0 ? 'disabled' : ''}`} onClick={handleEditToggle}>
                            {isEditingFL ? 'Xóa bỏ' : 'Chỉnh sửa'}
                        </button>
                    </div>
                </div>

                {isEditingFL && (
                    <div className='favorite-edit-bar text-white mt-3 d-flex align-items-center justify-content-end'>
                        <label htmlFor={`checkbox-select-all`} className='me-2'>Chọn tất cả</label>
                        <input
                            type="checkbox"
                            name={`favorite-select-all`}
                            id={`checkbox-select-all`}
                            className="favorite-checkbox checkbox-select-all"
                            checked={selectedItems.length === favoriteList.length && favoriteList.length > 0}
                            onChange={handleSelectAll}
                        />
                    </div>
                )}

                {favoriteList.length === 0 || !favoriteList ? (
                    <div className='text-white mt-3'>Danh sách yêu thích trống</div>
                ) : (
                    <div className='favorite-movie-list row mt-3'>
                        {favoriteList.map((item, index) => (
                            <div className="favorite-movie-item col-6 col-md-6 col-lg-4 col-xl-3 mb-4" key={item.movieId}>
                                {isEditingFL && (
                                <div
                                    className={`favorite-overlay ${isEditingFL ? 'show-overlay' : ''}`}
                                    onClick={(e) => {
                                        if (!e.target.classList.contains('favorite-checkbox')) {
                                            handleCheckboxChange(item.movieId);
                                        }
                                    }}
                                >
                                    <input
                                        type="checkbox" // Thay đổi từ radio sang checkbox
                                        name={`favorite-movie-${item.movieId}`}
                                        id={`checkbox-${item.movieId}`}
                                        className="favorite-checkbox"
                                        checked={selectedItems.includes(item.movieId)}
                                        onChange={(e) => {e.stopPropagation();handleCheckboxChange(item.movieId);}}
                                    />
                                </div>
                                )}
                                <Link
                                    to={`/${userData._id}/watch/${item.movieId}`}
                                    onClick={handleLinkClick}
                                    className={`favorite-movie-item-link text-decoration-none ${isEditingFL ? 'disabled' : ''}`}
                                >
                                    <div className="favorite-movie-item-content">
                                        <ImageWithSkeletonSwiper
                                            src={`https://idev1-bucket.s3.ap-southeast-2.amazonaws.com/movies/${item.source}/banner`}
                                            alt={item.mainTitle}
                                            className="favorite-movie-item-poster rounded"
                                        />
                                        {!isEditingFL && (
                                            // <i className="fa-regular fa-circle-play play-icon"></i>
                                            <i className="fa-solid fa-play play-icon"></i>
                                            // <i className="fa-solid fa-crosshairs play-icon d-flex align-items-center justify-content-center"></i>
                                        )}
                                        <h5 className="favorite-movie-title text-white mt-1">{item.mainTitle}</h5>
                                    </div>
                                </Link>
                            </div>
                        
                        ))}
                    </div>
                )}
            </div>
        </DefaultLayout>
    );
};

export default FavoriteList;
