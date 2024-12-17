
import React, { useState, useEffect } from 'react';
import './PlayerAndDetails.css';
import api from '../../api/api';
import Player from '../Player/Player';

const PlayerAndDetails = ({ movie: initialMovie, movieId, userData, callOpenReportModal }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [movie, setMovie] = useState(initialMovie);
  
  const validRates = movie?.userActivity?.filter(activity => activity.rate >= 1 && activity.rate <= 5) || [];
  const countRate = validRates.length;
  const averageRate =
    countRate > 0
      ? validRates.reduce((sum, item) => sum + item.rate, 0) / countRate
      : 0;

  useEffect(() => {
    setMovie(initialMovie);
    if (initialMovie) {
      const userActivity = initialMovie.userActivity.find(activity => activity.userId === userData._id);
      setRating(userActivity?.rate || 0);
    }
  }, [initialMovie, userData._id]);

  const handleRating = async (value) => {
    setRating(value);
    try {
      await api.post(`/movies/${movieId}/rate`, { userId: userData._id, rate: value });

      const updatedUserActivity = movie.userActivity.map(activity =>
        activity.userId === userData._id ? { ...activity, rate: value } : activity
      );
      if (!updatedUserActivity.some(activity => activity.userId === userData._id)) {
        updatedUserActivity.push({ userId: userData._id, rate: value });
      }

      setMovie({
        ...movie,
        userActivity: updatedUserActivity,
      });

      alert('Rating success');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'An error occurred';
      alert(`Rating failed: ${errorMessage}`);
    }
  };

  const handleToggleFavorite = async () => {
    try {
      const response = await api.post(`/movies/${userData._id}/favorite/${movieId}`);
      const updatedFavoriteList = response.data.favoriteList || [];

      if (updatedFavoriteList.includes(movieId)) setMovie({ ...movie, isFavorite: true});
      else setMovie({...movie, isFavorite: false});

      alert(response.data.message);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'An error occurred';
      console.error(`Toggle favorite failed: ${errorMessage}`);
      alert(errorMessage);
    }
  };


  if (!movie) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container media-player-container">
      <Player userId={userData._id} movieId={movieId} movieSource={movie.source} callOpenReportModal={callOpenReportModal} />
      {/* <div className="media-player mb-3">
        <video width="100%" controls>
          <source
            src={`https://d3os4gr4tudec8.cloudfront.net/movies/${movie.source}/movie`}
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
      </div> */}

      <div className="movie-details row text-white mt-4">
        <div className="col-md-8">
          <h2 className="movie-title-vn">{movie.mainTitle}</h2>
          <h4 className="movie-title-en">{movie.subTitle}</h4>
          <div className="rating-section d-flex align-items-center mb-2">
            <span className="average-rating me-2 rounded bg-dark p-2 ps-3 pe-3">
              <strong>{averageRate.toFixed(1)} / 5 ({countRate})</strong>
            </span>
            <div className="star-rating">
              {[...Array(5)].map((star, index) => {
                index += 1;
                return (
                  <button
                    type="button"
                    key={index}
                    className={`btn p-0 ${index <= (hover || rating) ? 'on' : 'off'} star-rating-btn ${userData.role==='admin' ? 'disabled-rating-btn' : '' } `}
                    onClick={() => handleRating(index)}
                    onMouseEnter={() => setHover(index)}
                    onMouseLeave={() => setHover(rating)}
                    style={{ background: 'none', border: 'none' }}
                  >
                    <span className="star pe-1">&#9733;</span>
                  </button>
                );
              })}
            </div>
          </div>
          <p className="movie-description">{movie.description}</p>
        </div>

        <div className="col-md-4">
          <button 
            className={`favorite-btn ${movie.isFavorite ? "active-favorite-btn" : ""} p-2 ps-0 text-start text-white w-100 mb-2 d-flex align-items-center`}
            onClick={handleToggleFavorite}
          >
            <i className="fa-regular fa-heart me-2"> </i>
            <span>{movie.isFavorite ? "Đã thêm vào danh sách yêu thích" : "Thêm vào danh sách yêu thích"}</span>
          </button>

  
          <p className="directors">Đạo diễn: {movie.directors.join(', ')}</p>
          <p className="actors">Diễn viên: {movie.casts.join(', ')}</p>
          <p className="movie-genre">Thể loại: {movie.genres.join(', ')}</p>
        </div>
      </div>
    </div>
  );
};

export default PlayerAndDetails;
