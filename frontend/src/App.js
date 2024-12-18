import React, { useContext, useEffect, useState } from 'react';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import Register from './pages/Register/Register';
import VerifyEmail from './pages/VerifyEmail/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import Login from './pages/Login/Login';
import Home from './pages/Home/Home';
import Profile from './pages/Profile/Profile';
import AccountManagement from './pages/AccountManagement/AccountManagement';
import WatchMovie from './pages/WatchMovie/WatchMovie';

import AdminLayout from './layouts/AdminLayout/AdminLayout';
import Dashboard from './pages/AdminDashboard/Dashboard';
import MovieManagement from './pages/AdminMovieManagement/MovieManagement';
import AccountManagement2 from './pages/AdminAccountManagement/AccountManagement';
import RequestHandling from './pages/AdminRequestHandling/RequestHandling';

import SearchMovie from './pages/SearchMovie/SearchMovie';
import FavoriteList from './pages/FavoriteList/FavoriteList';
import WatchHistory from './pages/WatchHistory/WatchHistory';

import { UserContext } from './UserContext';
import api from './api/api';

import Test2 from './components/Test2/Test2';
import Tpage from './pages/Tpage/Tpage';

const App = () => {
    const { isAuthenticated } = useContext(UserContext);
    const [userData, setUserData] = useState({});
    const navigate = useNavigate();

    const ProtectedRoute = ({ isAuthenticated, userData, children }) => {
        // return isAuthenticated ? children : <Navigate to={redirectPath} />;
        // if (!isAuthenticated) {
        //     return <Navigate to="/login" />;
        // } else {
        //     if (userData.role === 'admin') {
        //         return <Navigate to="/admin/dashboard" />;
        //     } else {
        //         if (userData.emailVerified === true || userData.googleId ) {
        //             return children;
        //         } else {
        //             return <Navigate to="/verify" />;
        //         }
        //     }
        // }
        if (!isAuthenticated) {
            return <Navigate to="/login" />;
        } 
        return children;
    };

    const VerifyRoute = ({ isAuthenticated, userData, children }) => {
        if (!isAuthenticated) {
            return <Navigate to="/login" />;
        }

        if (userData.emailVerified) {
            return <Navigate to="/" />;
        }

        return children;
    }
      
    const AdminRoute = ({ isAuthenticated, userData, children }) => {
        if (!isAuthenticated) {
            return <Navigate to="/login" />;
        }

        if (!userData.role) {
            return <div class="d-flex justify-content-center align-items-center">
                        <div class="spinner-grow text-light" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                    </div>;
        }

        if (userData.role !== 'admin') {
            // alert('You do not have permission to access this page.\nYour role: ' + userData.role);
            return <Navigate to="/" />;
        }

        return children;
    };
    
    // useEffect(() => {
    //     const tabbableElements = document.querySelectorAll('[tabindex]');
    //     tabbableElements.forEach((element) => {
    //         element.setAttribute('tabindex', '-1'); // Vô hiệu hóa tabindex
    //     });
    // }, []);

    // const getUserDataRecall = async () => {
    //     try {
    //         const response = await api.get('/auth/profile', {
    //             headers: {
    //                 Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    //             },
    //         });
    //         setUserData(response.data);
    //         console.log('Recall fetching user profile');
    //     } catch (error) {
    //         console.error('Error during getting user data:', error);
    //     }
    // };
    const getUserData = async () => {
        try {
            const response = await api.get('/auth/profile', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            });
            setUserData(response.data);
            setUserFavorite(response.data.favoriteList);
            console.log('Fetching user profile');
            console.log(response.data);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                console.log('Token expired. Redirecting to login.');
                localStorage.removeItem('accessToken');
                // Thêm điều hướng nếu cần
            } else {
                console.error('Error during getting user data:', error);
            }                
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            getUserData();

        }
    }, [isAuthenticated]);

    useEffect(() => {
        if (userData && userData.emailVerified === false) {
            navigate('/verify');
        }
        const cId = localStorage.getItem('chosenMovie');
        if (cId) {
            navigate(`/${userData._id}/watch/${cId}`);
            localStorage.removeItem('chosenMovie');
        }
    }, [userData]);

    const [userFavorite, setUserFavorite] = useState([]);
    // useEffect(() => {
    //     setUserFavorite(userData.favoriteList);
    // }, [userData]);
    const onChangeFavorite = (updated) => {
        setUserFavorite(updated);
    };



    // useEffect(() => {
    //     const getGenres = async () => {
    //         try {
    //             const response = await api.get('/genres/get');
    //             setGenresData(response.data);
    //         } catch (error) {
    //             console.error('Error during getting genres:', error);
    //         }
    //     }
    //     getGenres();
    // }, []);



    // const location = useLocation();

    // useEffect(() => {
    //     const checkLocalStorageAndSave = async () => {
    //         const unsavedData = localStorage.getItem("unsavedWatchHistory");
    //         if (unsavedData) {
    //             const parsedData = JSON.parse(unsavedData);

    //             try {
    //                 // Gọi API để lưu dữ liệu
    //                 await api.post("/movies/saveWatchHistory", parsedData);
    //                 console.log("Watch history saved after route change");
    //                 localStorage.removeItem("unsavedWatchHistory"); // Xóa dữ liệu sau khi lưu thành công
    //             } catch (error) {
    //                 console.error("Error saving watch history:", error);
    //             }
    //         }
    //     };

    //     // Gọi hàm kiểm tra mỗi khi URL thay đổi
    //     checkLocalStorageAndSave();
    // }, [location]);


    return (
        <Routes>
            <Route path="/" element={<Home userData={userData} userFavorite={userFavorite} callChangeFavorite={onChangeFavorite} />} />
            <Route path='/search' element={<SearchMovie userData={userData} userFavorite={userFavorite} callChangeFavorite={onChangeFavorite} />} />

            <Route 
                path='/favorite' 
                element={
                    <ProtectedRoute isAuthenticated={isAuthenticated} userData={userData}>
                        <FavoriteList userData={userData} />
                    </ProtectedRoute>
                } 
            />
            <Route 
                path='/history' 
                element={
                    <ProtectedRoute isAuthenticated={isAuthenticated} userData={userData}>
                        <WatchHistory userData={userData} />
                    </ProtectedRoute>
                } 
            />

            <Route path="/register" element={<Register />} />
            <Route 
                path="/verify" 
                element={
                    <VerifyRoute isAuthenticated={isAuthenticated} userData={userData}>
                        <VerifyEmail mail={userData.email} isVerified={userData.emailVerified}/>
                    </VerifyRoute>
                } 
            />

            <Route path="/forgot" element={<ForgotPassword />} />

            <Route path="/login" element={<Login />} />

            <Route path="/tp" element={<Tpage />} />
            <Route path="/tp2" element={<Test2 />} />
            <Route
                path="/profile"
                element={
                    <ProtectedRoute isAuthenticated={isAuthenticated} userData={userData}>
                        <Profile userData={userData} callGetUserData={getUserData} />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/accounts"
                element={
                    <AdminRoute isAuthenticated={isAuthenticated} userData={userData}>
                        <AccountManagement />
                    </AdminRoute>
                }
            />
            <Route 
                path="/:userId/watch/:movieId" 
                element={
                    <ProtectedRoute isAuthenticated={isAuthenticated} userData={userData}>
                        <WatchMovie userData={userData} />
                    </ProtectedRoute>
                }
            />
            {/* <Route 
                path='/admin/accounts' 
                element={userData.role==='admin' ? <AccountManagement /> : <Navigate to="/login" />} 
            /> */}

            {/* <Route path="/testpage" element={<TestPage />} /> */}
            <Route 
                path="/admin" 
                element={
                    <AdminRoute isAuthenticated={isAuthenticated} userData={userData}>
                        <AdminLayout userData={userData} />
                    </AdminRoute>
                }
            >
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="movies" element={<MovieManagement />} />
                <Route path="accounts2" element={<AccountManagement2 />} />
                <Route path="requests" element={<RequestHandling />} />
            </Route>

        </Routes>
    );
};

export default App;
