import React, { useEffect, useState } from 'react';
// import Footer from '../../components/Footer/Footer';
import Sidebar from '../../components/Sidebar/Sidebar';
import { Outlet } from 'react-router-dom';
import './AdminLayout.css';
import api from '../../api/api';

const AdminLayout = ({userData}) => {
    // useEffect(() => {
    //   document.querySelector('main').classList.add('main-admin-layout');
    //   return () => {
    //     document.querySelector('main').classList.remove('main-admin-layout');
    //   };
    // }, []);
    const [uploadingQueue, setUploadingQueue] = useState([
        // {'id': 1, 'name': 'Movie 1', 'progress': 65, 'status': 'uploading'}, // Sample data
        // {'id': 2, 'name': 'Movie 2', 'progress': 100, 'status': 'done'}, // Sample data
        // {'id': 3, 'name': 'Movie 3', 'progress': 0, 'status': 'failed'}, // Sample data
    ]);

    const clearUploadingQueue = () => {
        if (uploadingQueue.filter((movie) => movie.status === 'uploading').length === 0) {
        setUploadingQueue([]);
        }
    };

    const handleUploadMovie = async (mainTitle, subTitle, releaseDate, duration, country, description, genres, directors, casts, movie, banner, poster) => {
        const formData = new FormData();
        formData.append('mainTitle', mainTitle);
        formData.append('subTitle', subTitle);
        formData.append('releaseDate', releaseDate);
        formData.append('duration', duration);
        formData.append('country', country);
        formData.append('description', description);
        formData.append('genres', genres);
        formData.append('directors', directors);
        formData.append('casts', casts);
        formData.append('movie', movie);
        formData.append('banner', banner);
        formData.append('poster', poster);

        setUploadingQueue((prev) => [
        ...prev,
        {
            id: (prev.length + 1),
            name: mainTitle,
            progress: 0,
            status: 'uploading',
        },
        ]);
    
        for (let [key, value] of formData.entries()) {
        console.log(key, ":", value);
        }

        try {
        console.log("Uploading...");
        const response = await api.post('/movies/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${localStorage.getItem('accessToken')}` },

            onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);

            setUploadingQueue((prev) =>
                prev.map((movie) =>
                movie.name === mainTitle
                    ? { ...movie, progress: percentCompleted }
                    : movie
                )
            );
            }
            
        });
        setUploadingQueue((prev) =>
            prev.map((movie) =>
            movie.name === mainTitle
                ? { ...movie, progress: 100, status: 'done' }
                : movie
            )
        );
        alert(response.data.message || 'Đăng tải phim thành công');

        // Cập nhật danh sách phim
        setMovies((prev) => [response.data.movie, ...prev]);
        setOriginalMovies((prev) => [response.data.movie, ...prev]);

        // return response.data.movie;
        
        } catch (error) {
        console.error('Lỗi khi đăng tải phim:', error);
        alert('Upload failed');
        setUploadingQueue((prev) =>
            prev.map((movie) =>
            movie.name === mainTitle
                ? { ...movie, progress: 0, status: 'failed' }
                : movie
            )
        );
        }
    };

    const [hideToastBody, setHideToastBody] = useState(false);
    const toggleToastBody = () => {
        setHideToastBody((prev) => !prev);
    };
    const toggleToastBodyFunc = (stt) => {
        setHideToastBody(stt);
    }



    const [movies, setMovies] = useState([]);
    const [originalMovies, setOriginalMovies] = useState([]);

    const getAllMovies = async () => {
        // if (movies) return;
        try {
        const response = await api.get('/movies/getAllMovies');
        setMovies(response.data);
        setOriginalMovies(response.data);
        console.log('Fetching movies');
        } catch (error) {
        console.error('Error fetching movies:', error);
        }
    };

    // useEffect(() => {
    //   getAllMovies();
    // }, []);

    return (
        // <div className="admin-layout">
        //   <Sidebar />
        //   <div className="content">
        //     <Outlet />
        //   </div>
        // </div>
        <Sidebar 
            userData={userData} 
            uploadingQueue={uploadingQueue} 
            callClearQueue={clearUploadingQueue} 
            hideToastBody={hideToastBody} 
            callHideToastBody={toggleToastBody} 
        >
            <Outlet context={{ handleUploadMovie, toggleToastBodyFunc, movies, setMovies, originalMovies, setOriginalMovies, getAllMovies }} />
        </Sidebar>
    );
};

export default AdminLayout;
