import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AdminPage.css";
import api from "../../api/api";
import Sidebar2 from "../../components/Sidebar2/Sidebar2";

import Dashboard from "../../pages/AdminDashboard2/Dashboard";
import MovieManagement from "../../pages/AdminMovieManagement2/MovieManagement";
import AccountManagement from "../../pages/AdminAccountManagement2/AccountManagement";
import AccessControl from "../../pages/AdminAccessControlManagenment/AccessControl";
import RequestHandling from "../../pages/AdminRequestHandling2/RequestHandling";

const AdminPage = ({ userData }) => {
    // 1. Sidebar
    const [inSite, setInSite] = useState('welcome');
    const handleActive = (e, section) => {
        e.preventDefault();
        switch (section) {
            case 'welcome':
                setInSite(section);
                break;
            case 'dashboard':
                setInSite(section);
                break;
            case 'movies':
                setInSite(section);
                break;
            case 'accounts':
                setInSite(section);
                break;
            case 'rolebased':
                setInSite(section);
                break;
            case 'requests':
                setInSite(section);
                break;
            default:
                break;
        }
    };

    // 2. Dashboard
    const [userStats, setUserStats] = useState([]);
    const [totalGenres, setTotalGenres] = useState(0);
    const [movieStats, setMovieStats] = useState([]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/movies/statistic');
                setUserStats(response.data.totalUsers);
                setTotalGenres(response.data.totalGenres);
                setMovieStats(response.data.movieDetails);
            } catch (error) {
                console.error('Fetch stats error: ', error);
            }
        };

        fetchStats();
    }, []);

    // 3. Quản lý phim
    // 3.1. getAllMovies
    const [movies, setMovies] = useState([]);
    const [originalMovies, setOriginalMovies] = useState([]);

    const getAllMovies = async () => {
        try {
            const response = await api.get('/movies/getAllMovies');
            setMovies(response.data);
            setOriginalMovies(response.data);
            console.log('Fetching movies');
        } catch (error) {
            console.error('Error fetching movies:', error);
        }
    };

    useEffect(() => {
        getAllMovies();
    }, []);

    // 3.2. Đăng tải phim
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
            alert('Lỗi khi đăng tải phim!');
            setUploadingQueue((prev) =>
                prev.map((movie) =>
                movie.name === mainTitle
                    ? { ...movie, progress: 0, status: 'failed' }
                    : movie
                )
            );
        }
    };

    // 3.3. Danh sách phim đang đăng tải
    const [hideToastBody, setHideToastBody] = useState(false);
    const toggleToastBody = () => {
        setHideToastBody((prev) => !prev);
    };
    const toggleToastBodyFunc = (stt) => {
        setHideToastBody(stt);
    }

    // 3.4. Chỉnh sửa phim
    const handleEditMovie = async (movieId, mainTitle, subTitle, releaseDate, duration, country, description, genres, directors, casts, movie, banner, poster) => {
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
        
        for (let [key, value] of formData.entries()) {
            console.log(key, ":", value);
        }

        setUploadingQueue((prev) => [
            ...prev,
            { id: movieId, name: mainTitle, progress: 0, status: 'uploading' },
        ]);        

        try {
            console.log("Đang tải...");
            const response = await api.put(`movies/update/${movieId}`, formData, {
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
            setMovies((prev) => (prev.map((movie) => movie._id === movieId ? response.data.movie : movie)));
            setOriginalMovies((prev) => (prev.map((movie) => movie._id === movieId ? response.data.movie : movie)));
        } catch (error) {
            console.error('Lỗi khi đăng tải phim:', error);
            alert('Lỗi khi đăng tải phim!');
            setUploadingQueue((prev) =>
                prev.map((movie) =>
                movie.name === mainTitle
                    ? { ...movie, progress: 0, status: 'failed' }
                    : movie
                )
            );
        }
    };

    // 4. Tài khoản
    // 4.1. getAccounts
    const [accounts, setAccounts] = useState([]);
    const [originalAccounts, setOriginalAccounts] = useState([]);

    const getAccounts = async () => {
        try {
            const response = await api.get("/account/get");
            setAccounts(response.data);
            setOriginalAccounts(response.data);
            setAdminAccounts(response.data.filter((account) => account.role === 'admin'));
            setOriginalAdminAccounts(response.data.filter((account) => account.role === 'admin'));
            console.log('Đã tải danh sách tài khoản');
        } catch (error) {
            console.error("Error fetching accounts:", error);
        }
    };

    useEffect(() => {
        getAccounts();
    }, []);

    // 5. Phân quyền
    const [adminAccounts, setAdminAccounts] = useState([]);
    const [originalAdminAccounts, setOriginalAdminAccounts] = useState([]);

    // useEffect(() => {
    //     if (accounts.length > 0) {
    //         setAdminAccounts(accounts.filter((account) => account.role === 'admin'));
    //         setOriginalAdminAccounts(accounts.filter((account) => account.role === 'admin'));
    //     }
    // }, [accounts]);

    // 6. getAllReports
    const [reports, setReports] = useState([]);
    const [originalReports, setOriginalReports] = useState([]);

    const getAllReports = async () => {
        try {
            const response = await api.get('/movies/getAllReports');
            setReports(response.data);
            setOriginalReports(response.data);
        } catch (error) {
            console.error('Error fetching reports:', error);
        }
    };
    useEffect(() => {
        getAllReports();
    }, []);








    return (
        <Sidebar2
            userData={userData} 
            uploadingQueue={uploadingQueue} 
            callClearQueue={clearUploadingQueue} 
            hideToastBody={hideToastBody} 
            callHideToastBody={toggleToastBody} 

            inSite={inSite}
            activeSite={handleActive}
        >
            {inSite === 'welcome' && (
                <div className="container-fluid welcome-admin-container d-flex flex-column justify-content-center align-items-center p-0 position-relative"
                    style={{ height: "90vh" }}
                >
                    <img
                        src="https://i.imgur.com/IJpV9Qi.png"
                        alt="Welcome to Lovie Admin"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <div className="text-overlay position-absolute text-center"
                        style={{
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        // color: "white",
                        // textShadow: "2px 2px 5px rgba(0, 0, 0, 0.7)",
                        }}
                    >
                        <h1>Chào mừng trở lại, {userData.fullname}!</h1>
                        <h2>Hãy chọn một mục để bắt đầu</h2>
                    </div>
                </div>

            )}
            {inSite === 'dashboard' && (
                <Dashboard 
                    userStats={userStats} 
                    totalGenres={totalGenres} 
                    movieStats={movieStats} 
                />
            )}
            {inSite === 'movies' && (
                <MovieManagement
                    movies={movies}
                    setMovies={setMovies}
                    originalMovies={originalMovies}
                    setOriginalMovies={setOriginalMovies}
                    getAllMovies={getAllMovies}
                    handleUploadMovie={handleUploadMovie}
                    toggleToastBodyFunc={toggleToastBodyFunc}
                    handleEditMovie={handleEditMovie}
                />
            )}
            {inSite === 'accounts' && (
                <AccountManagement
                    accounts={accounts}
                    setAccounts={setAccounts}
                    originalAccounts={originalAccounts}
                    setOriginalAccounts={setOriginalAccounts}
                    getAccounts={getAccounts}
                />
            )}
            {inSite === 'rolebased' && (
                <AccessControl
                    adminAccounts={adminAccounts}
                    setAdminAccounts={setAdminAccounts}
                    originalAdminAccounts={originalAdminAccounts}
                    setOriginalAdminAccounts={setOriginalAdminAccounts}
                />
            )}
            {inSite === 'requests' && (
                <RequestHandling 
                    reports={reports}
                    setReports={setReports}
                    originalReports={originalReports}
                    setOriginalReports={setOriginalReports}
                    getAllReports={getAllReports}
                />
            )}
        </Sidebar2>  
    );
}

export default AdminPage;
