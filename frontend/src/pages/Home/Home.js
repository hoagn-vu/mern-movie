import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DefaultLayout from '../../layouts/DefaultLayout/DefaultLayout';
import SwiperBanner from '../../components/SwiperBanner/SwiperBanner';
import SwiperHistory from '../../components/SwiperHistory/SwiperHistory';
import SwiperType1 from '../../components/SwiperType1/SwiperType1';
import SwiperType2 from '../../components/SwiperType2/SwiperType2';
import SwiperType3 from '../../components/SwiperType3/SwiperType3';
import api from '../../api/api';

const Home = ({ userData, userFavorite, callChangeFavorite }) => {
    const [moviesForBanner, setMoviesForBanner] = useState([]);
    const [actionMovies, setActionMovies] = useState([]);
    const [familyMovies, setFamilyMovies] = useState([]);
    const [cartoonMovies, setCartoonMovies] = useState([]);
    const [scientificMovies, setScientificMovies] = useState([]);
    const [horrorMovies, setHorrorMovies] = useState([]);
    const [romanticMovies, setRomanticMovies] = useState([]);
    const [vietnameseMovies, setVietnameseMovies] = useState([]);
    const [koreanMovies, setKoreanMovies] = useState([]);

    const [watchHistory, setWatchHistory] = useState([]);
    const [recommendedMovies, setRecommendedMovies] = useState([]);

    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchMoviesForBanner = async () => {
            try {
                const response = await api.get('/movies/getPromotedMovies');
                setMoviesForBanner(response.data);
            } catch (error) {
                console.error('Error fetching movies for banner:', error);
            }
        };

        fetchMoviesForBanner();
    }, []);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const action = await fetchMoviesByGenre('Hành động');
                setActionMovies(action);
    
                const family = await fetchMoviesByGenre('Gia đình');
                setFamilyMovies(family);
    
                const cartoon = await fetchMoviesByGenre('Hoạt hình');
                setCartoonMovies(cartoon);
    
                const horror = await fetchMoviesByGenre('Kinh dị');
                setHorrorMovies(horror);

                const scientific = await fetchMoviesByGenre('Khoa học viễn tưởng');
                setScientificMovies(scientific);

                const romantic = await fetchMoviesByGenre('Lãng mạn');
                setRomanticMovies(romantic);
                
                const vietnamese = await fetchMoviesByNation('Việt Nam');
                setVietnameseMovies(vietnamese);

                const korean = await fetchMoviesByNation('Hàn Quốc');
                setKoreanMovies(korean);

                if (userData && userData.history && userData.history.length > 0) {
                    const rcm = await getRecommendMovies();
                    setRecommendedMovies(rcm);

                    setWatchHistory(userData.history.slice(0, 15));
                }

                // if (userData && userData.history && userData.history.length > 0) {
                //     setWatchHistory(userData.history);
                // }
            } catch (error) {
                console.error('Error fetching movies by genre:', error);
            }
        };
    
        fetchMovies();
    }, [userData]);

    const getRecommendMovies = async () => {
        try {
            const response = await api.get(`/movies/recommend/${userData._id}`);
            // console.log('Recommended movies:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching recommended movies:', error);
            return [];
        }
    };

    // useEffect(() => {
    //     const getRecommendMovies = async () => {
    //         try {
    //             const response = await api.get(`/movies/recommend/${userData._id}`);
    //             setRecommendedMovies(response.data);
    //         } catch (error) {
    //             console.error('Error fetching recommended movies:', error);
    //         }
    //     };

    //     if (userData && userData.history && userData.history.length > 0) {
    //         getRecommendMovies();
    //     }
    // }, [userData]);

    
    const fetchMoviesByGenre = async (genreToSearch) => {
        try {
            const response = await api.get(`/movies/genre/${genreToSearch}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching movies with genre ${genreToSearch}:`, error);
            return [];
        }
    };

    const fetchMoviesByNation = async (nationToSearch) => {
        try {
            const response = await api.get(`/movies/country/${nationToSearch}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching movies with nation ${nationToSearch}:`, error);
            return [];
        }
    };

    function getRandomElements(array, n) {
        const shuffled = [...array];
        
        for (let i = shuffled.length - 1; i > 0; i--) {
          const randomIndex = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]];
        }
      
        return shuffled.slice(0, n);
    };

    // useEffect(() => {
    //     const cId = localStorage.getItem('chosenMovie');
    //     if (cId) {
    //         navigate(`/${userData._id}/watch/${cId}`);
    //         localStorage.removeItem('chosenMovie');
    //     }
    // }, [userData]);
    
    


    

    return (
        <DefaultLayout userData={userData}>
            <div className="container-fluid text-white">
                <SwiperBanner userId={userData._id} userFavorite={userFavorite} callChangeFavorite={callChangeFavorite} moviesData={moviesForBanner} />

                { userData && watchHistory.length>0 && (
                    <div className='mt-5'>
                        <SwiperHistory userId={userData._id} title="Tiếp Tục Xem" moviesData={watchHistory} />
                    </div>
                )}

                { userData && recommendedMovies.length>0  && (
                    <div className='mt-5'>
                        <SwiperType1 userId={userData._id} title="Có Thể Bạn Sẽ Thích" moviesData={recommendedMovies} displayOpenMore={false} />
                    </div>
                )}

                <div className='mt-5'>
                    <SwiperType1 
                        userId={userData._id} 
                        title="Phim Việt Nam" 
                        moviesData={getRandomElements(vietnameseMovies, 15)} 
                        queryType="nation"
                        queryValue="Việt Nam"
                    />
                </div>
                <div className='mt-5'>
                    <SwiperType2 
                        userId={userData._id} 
                        title="Hành Động Kịch Tính" 
                        moviesData={getRandomElements(actionMovies, 15)} 
                        queryType="genre"
                        queryValue="Hành động"
                    />
                </div>
                <div className='mt-5'>
                    <SwiperType1 
                        userId={userData._id} 
                        title="Phim Hàn Quốc" 
                        moviesData={getRandomElements(koreanMovies, 15)} 
                        queryType="nation"
                        queryValue="Hàn Quốc"
                    />
                </div>
                <div className='mt-5'>
                    <SwiperType2 
                    userId={userData._id} 
                    title="Khoa Học Viễn Tưởng" 
                    moviesData={getRandomElements(scientificMovies, 15)} 
                    queryType="genre"
                    queryValue="Khoa học viễn tưởng"
                />
                </div>
                <div className='mt-5'>
                    <SwiperType1 
                        userId={userData._id} 
                        title="Kinh Dị Giật Gân" 
                        moviesData={getRandomElements(horrorMovies, 15)} 
                        queryType="genre"
                        queryValue="Kinh dị"
                    />
                </div>
                <div className='mt-5'>
                    <SwiperType3 
                        userId={userData._id} 
                        title="Gia đình cùng thuởng thức" 
                        moviesData={getRandomElements(familyMovies, 15)} 
                        queryType="genre"
                        queryValue="Gia đình"
                    />
                </div>

                <div className='mt-5'>
                    <SwiperType2 
                    userId={userData._id} 
                    title="Tình Cảm Lãng Mạn" 
                    moviesData={getRandomElements(romanticMovies, 15)} 
                    queryType="genre"
                    queryValue="Lãng mạn"
                />
                </div>

                <div className='mt-5'>
                    <SwiperType2 
                        userId={userData._id} 
                        title="Hoạt Hình Vui Nhộn" 
                        moviesData={getRandomElements(cartoonMovies, 15)} 
                        queryType="genre"
                        queryValue="Hoạt hình"
                    />
                </div>




            </div>
        </DefaultLayout>
    );
};

export default Home;
