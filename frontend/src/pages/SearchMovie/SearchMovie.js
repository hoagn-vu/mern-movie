import React, { useState, useEffect, useContext } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import './SearchMovie.css';
import DefaultLayout from '../../layouts/DefaultLayout/DefaultLayout';
import api from '../../api/api';
import { UserContext } from '../../UserContext';

import ImageWithSkeletonSearch from '../../components/ImageWithSkeletonSearch/ImageWithSkeletonSearch';

import Select, { components } from 'react-select';
import { countryOptions, yearOptions } from '../../data'

const SearchMovie = ({ userData, userFavorite, callChangeFavorite }) => {
    const [nameSearch, setNameSearch] = useState('');

    const [selectedGenre, setSelectedGenre] = useState(null);
    const [selectedYear, setSelectedYear] = useState(null);
    const [selectedCountry, setSelectedCountry] = useState(null);

    const [genreOptions, setGenreOptions] = useState([]);

    const [newestMovies, setNewestMovies] = useState([]);
    const [searchResult, setSearchResult] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    const { isAuthenticated } = useContext(UserContext);

    const checkAuth = (e , movieId) => {
      if (!isAuthenticated) {
        if (!(window.confirm('Bạn cần đăng nhập để xem phim'))) {
          e.preventDefault();
        } else {
          localStorage.setItem('chosenMovie', movieId);
        }
      }
    }

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await api.get('/genres/get');
                
                const options = response.data.map((genre) => ({
                    value: genre._id,
                    label: genre.name,
                }));

                setGenreOptions(options);
            } catch (error) {
                console.error('Error fetching genres:', error);
            }
        };
        fetchGenres();
    }, []);

    const sortOptions = [
        { value: "latest", label: "Mới nhất" },
        { value: "oldest", label: "Cũ nhất" },
    ];

    const fetchSomeNewestMovies = async () => {
        try {
            const response = await api.get('/movies/getSomeNewestMovies');
            setNewestMovies(response.data);
        } catch (error) {
            console.error('Error fetching movies:', error);
        }
    }

    // useEffect(() => {
    //     if (!isSearching) {
    //         fetchSomeNewestMovies()
    //     };
    // }, [isSearching]);

    const handleSort = (option) => {
        const sortedResults = [...searchResult]; // Tạo bản sao của searchResult
        if (option.value === 'latest') {
            sortedResults.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
        } else {
            sortedResults.sort((a, b) => new Date(a.releaseDate) - new Date(b.releaseDate));
        }
        setSearchResult(sortedResults); // Cập nhật state với danh sách đã sắp xếp
    };

    const handleToggleFavorite = async (movId) => {
        if (!isAuthenticated) {
            alert('Bạn cần đăng nhập để thêm vào danh sách yêu thích');
            return;
        }
        try {
          const response = await api.post(`/movies/${userData._id}/favorite/${movId}`);
          callChangeFavorite(response.data.favoriteList);
        } catch (error) {
          console.error('Lỗi khi thêm vào danh sách yêu thích:', error);
        }
    };
    





      
    const NoOptionsMessage = props => {
        return (
            <components.NoOptionsMessage {...props}>
                <span className="custom-css-class">Không tồn tại</span> 
            </components.NoOptionsMessage>
        );
    };

    const [topViewedMovies, setTopViewedMovies] = useState([]);
    const getTopMovies = async () => {
        try {
            const response = await api.get('/movies/getTopMovies');
            console.log('Top movies:', response.data);

            setTopViewedMovies(response.data);
        } catch (error) {
            console.error('Error fetching top movies:', error);
        }
    };
    useEffect(() => {
        if (isSearching===false) getTopMovies();
    }, [isSearching]);


    // const [isFirstSearch, setIsFirstSearch] = useState(true);
    // const [searchParams] = useSearchParams();

    // let genreId = '';
    // let nation = '';

    // if (isFirstSearch) {
    //     genreId = genreOptions.find((genre) => genre.label === searchParams.get('genre')) || '';
    //     nation = searchParams.get('nation') || '';
    //     setIsFirstSearch(false);
    // } else {
    //     genreId = selectedGenre?.value || '';
    //     nation = selectedCountry?.value || '';
    // }

    // useEffect(() => {
    //     if (isFirstSearch) {
    //         if (searchParams.get('genre')) {
    //             setSelectedGenre(genreOptions.find((genre) => genre.label === searchParams.get('genre')));
    //         } else if (searchParams.get('nation')) {
    //             setSelectedCountry(countryOptions.find((country) => country.label === searchParams.get('nation')));
    //         }
    //         handleSearch();
    //     }
    // }, [isFirstSearch]);

    // const handleSearch = async () => {
    //     // const genreId = selectedGenre?.value || searchParams.get('genre') || '';
    //     // const country = selectedCountry?.value || searchParams.get('nation') || '';
    //     // const year = selectedYear?.value || searchParams.get('year') || '';
    
    //     // if (!nameSearch && !genreId && !year && !country) {
    //     if (!nameSearch && !selectedGenre && !selectedYear && !selectedCountry) {
    //         alert('Vui lòng nhập thông tin tìm kiếm');
    //         return;
    //     }
    
    //     setIsSearching(true);
    
    //     try {
    //         const response = await api.post('/movies/search', {
    //             titleSearch: nameSearch || '',
    //             // genreIdSearch: selectedGenre?.value || '',
    //             genreIdSearch: genreId,
    //             yearSearch: selectedYear?.value || '',
    //             // nationSearch: selectedCountry?.value || '',
    //             nationSearch: nation,
    //         });
    //         setSearchResult(response.data);
    //         // console.log('movieSearched:', response.data);

    //     } catch (err) {
    //         console.error('Error:', err);
    //     }
    // };
    const [isFirstSearch, setIsFirstSearch] = useState(true);
    const [searchParams] = useSearchParams();
    const [displayTitle, setDisplayTitle] = useState('Kết quả tìm kiếm');

    useEffect(() => {
        if (isFirstSearch && genreOptions.length > 0) {
            const genreLabel = searchParams.get('genre');
            const nationLabel = searchParams.get('nation');
            const incomeTitle = searchParams.get('title');

            // Nếu có incomeTitle, hiển thị nó
            if (incomeTitle) {
                setDisplayTitle(incomeTitle);
            }

            // Chỉ set giá trị nếu searchParams có giá trị
            if (genreLabel && genreOptions.length > 0) {
                // console.log('genreLabel:', genreLabel);
                setSelectedGenre(genreOptions.find((genre) => genre.label === genreLabel) || null);
                // console.log('genreOptions:', genreOptions);
                // console.log('id genre label:', genreOptions.find((genre) => genre.label === genreLabel) || null);
            }
            if (nationLabel) {
                // console.log('nationLabel:', nationLabel);
                setSelectedCountry(countryOptions.find((country) => country.label === nationLabel) || null);
            }

            // Gọi handleSearch chỉ khi có tham số tìm kiếm
            if (genreLabel || nationLabel) {
                // setIncomeTitle(searchParams.get('title'));
                // console.log(searchParams.get('title'));

                handleSearch({
                    genreIdSearch: genreOptions.find((genre) => genre.label === genreLabel)?.value || '',
                    nationSearch: nationLabel || '',
                });
            }

            setIsFirstSearch(false); // Đánh dấu đã xử lý lần đầu
        }
    }, [isFirstSearch, searchParams, genreOptions]);

    const handleSearch = async (overrideParams = {}) => {
        const {
            genreIdSearch = selectedGenre?.value || '',
            nationSearch = selectedCountry?.value || '',
            titleSearch = nameSearch || '',
            yearSearch = selectedYear?.value || '',
        } = overrideParams;

        if (!titleSearch && !genreIdSearch && !yearSearch && !nationSearch) {
            alert('Vui lòng nhập thông tin tìm kiếm');
            return;
        }

        setIsSearching(true);

        try {
            const response = await api.post('/movies/search', {
                titleSearch,
                genreIdSearch,
                yearSearch,
                nationSearch,
            });
            setSearchResult(response.data);
            if (!isFirstSearch) {
                setDisplayTitle('Kết quả tìm kiếm');
            }
        } catch (err) {
            console.error('Error:', err);
        }
    };

  


    


    
    return (
        <DefaultLayout userData={userData}>
            <div className='container search-movie-container'>
                <form className='search-form rounded bg-dark p-3 mb-3'>
                <div className="row g-3">
                    {/* Ô nhập tên phim */}
                    <div className='col-md-6 col-lg-4 search-input-name d-flex align-items-center'>
                        <i className="fas fa-search me-2"></i>
                        <input 
                            type="text" 
                            className="form-control input-search text-white flex-grow-1" 
                            placeholder="Nhập tên phim..." 
                            value={nameSearch}
                            onChange={(e) => setNameSearch(e.target.value)}
                        />
                        <i 
                            className="fas fa-times ms-2 me-3" 
                            style={{ 
                                opacity: nameSearch ? 1 : 0, 
                                pointerEvents: nameSearch ? 'auto' : 'none', 
                                cursor: nameSearch ? 'pointer' : 'default',
                                transition: 'opacity 0.15s'
                            }}
                            onClick={() => setNameSearch('')}
                        ></i>
                    </div>

                    <div className='select-search col-md-6 col-lg-2'>
                        <Select
                            isSearchable
                            isClearable
                            options={genreOptions} 
                            placeholder="Thể loại"
                            components={{
                                IndicatorSeparator: () => null, NoOptionsMessage
                            }}
                            value={selectedGenre}
                            onChange={(option) => setSelectedGenre(option)}
                            classNamePrefix="react-select"
                            className='search-select'
                        />
                    </div>

                    <div className='select-search year-select-search col-md-6 col-lg-2'>
                        <Select
                            isSearchable
                            isClearable
                            options={yearOptions} 
                            placeholder="Năm chiếu"
                            components={{
                                IndicatorSeparator: () => null, NoOptionsMessage
                            }}
                            value={selectedYear}
                            onChange={(option) => setSelectedYear(option)}
                            classNamePrefix="react-select"
                            className='search-select'
                        />
                    </div>

                    <div className='select-search col-md-6 col-lg-2'>
                        <Select
                            isSearchable
                            isClearable
                            options={countryOptions} 
                            placeholder="Quốc gia"
                            components={{
                                IndicatorSeparator: () => null, NoOptionsMessage
                            }}
                            value={selectedCountry}
                            onChange={(option) => setSelectedCountry(option)}
                            classNamePrefix="react-select"
                            className='search-select'
                        />
                    </div>
                        <div className='col-12 col-lg-2 d-flex justify-content-center'>
                            <button type="button" className='btn btn-primary search-button w-75' onClick={handleSearch}>Tìm kiếm</button>
                        </div>
                    </div>
                </form>

                {!isSearching ? (
                    <div className='newest-movies text-white mb-3'>
                        <h2 className='mt-5 mb-3'>Phim thịnh hành</h2>
                        <div className='newest-movies-list row'>
                            {/* {newestMovies.map((movie, index) => ( */}
                            {topViewedMovies.map((movie, index) => (
                                <div key={index} className='col-12 col-md-12 col-lg-12 col-xl-6 mb-5'>
                                    <div className='search-result-movie d-flex'>
                                        <ImageWithSkeletonSearch
                                            src={`https://idev1-bucket.s3.ap-southeast-2.amazonaws.com/movies/${movie.source}/poster`} 
                                            alt={movie.subTitle} className="poster-result-fluid rounded me-3"     
                                            width="252px" 
                                            height="378px"  
                                        />
                                        <div className='movie-info-and-action text-white'>
                                            <div className='movie-result-infos'>
                                                <h3>{movie.mainTitle}</h3>
                                                <div className='row'>
                                                    <p>
                                                        <i className="fa-solid fa-star"></i> {movie.averageRate} 
                                                        <span className='ms-2 me-2 text-secondary'>|</span>
                                                        {movie.totalViewsLastThreeMonths} lượt xem
                                                        <span className='ms-2 me-2 text-secondary'>|</span>
                                                        {new Date(movie.releaseDate).getFullYear()}
                                                    </p>

                                                </div>
                                                <p>Thể loại: {movie.genres.join(', ')}</p>
                                                <p>Nội dung: {movie.description}</p>
                                            </div>
                                            <div className='movie-result-actions d-flex align-items-center'>
                                                <Link to={`/${userData._id}/watch/${movie.movieId}`} onClick={(e) => checkAuth(e, movie._id)}>
                                                    <button className='watch-button'>Xem ngay</button>                                            
                                                </Link>
                                                <button className="like-button" onClick={() => handleToggleFavorite(movie.movieId)}>
                                                    { userFavorite && userFavorite.includes(movie.movieId) ? <i className="fa-solid fa-heart liked"></i> : <i className="far fa-heart"></i> }
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                ) : (
                    <div className='search-result'>
                        <div className='search-result-header d-flex justify-content-between align-items-center text-white mb-3'>
                            <h2>{displayTitle} </h2>
                            <div className='search-result-sort d-flex align-items-center'>
                                <span className="me-2">Sắp xếp theo:</span>
                                <Select
                                    isSearchable={false}
                                    options={sortOptions} 
                                    components={{
                                        IndicatorSeparator: () => null,
                                    }}
                                    classNamePrefix="react-select"
                                    className='search-select'
                                    defaultValue={sortOptions[0]}
                                    styles={{
                                        control: (provided) => ({
                                            ...provided,
                                            minWidth: '120px', // Chiều rộng tối thiểu
                                            maxWidth: '120px', // Chiều rộng tối đa
                                        }),
                                        singleValue: (provided) => ({
                                            ...provided,
                                            whiteSpace: 'nowrap', // Ngăn xuống dòng
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis', // Nếu quá dài sẽ hiện dấu "..."
                                        }),
                                    }}
                                    onChange={(option) => handleSort(option)}
                                />
                            </div>
                        </div>


                        <div className='search-result-movies row'>
                            {searchResult.length > 0 ? searchResult.map((movie, index) => (
                                <div key={index} className='col-12 col-md-12 col-lg-12 col-xl-6 mb-5'>
                                    <div className='search-result-movie d-flex'>
                                        <ImageWithSkeletonSearch src={`https://idev1-bucket.s3.ap-southeast-2.amazonaws.com/movies/${movie.source}/poster`} alt={movie.subTitle} className="poster-result-fluid rounded me-3" />
                                        <div className='movie-info-and-action text-white'>
                                            <div className='movie-result-infos'>
                                                <h3>{movie.mainTitle}</h3>
                                                <p>Năm: {new Date(movie.releaseDate).getFullYear()}</p>
                                                <p>Thể loại: {movie.genres.join(', ')}</p>
                                                <p>Nội dung: {movie.description}</p>
                                            </div>
                                            <div className='movie-result-actions d-flex align-items-center'>
                                                <Link to={`/${userData._id}/watch/${movie._id}`} onClick={(e) => checkAuth(e, movie._id)}>
                                                    <button className='watch-button'>Xem ngay</button>                                            
                                                </Link>
                                                <button className="like-button" onClick={() => handleToggleFavorite(movie._id)}>
                                                    { userFavorite && userFavorite.includes(movie._id) ? <i className="fa-solid fa-heart liked"></i> : <i className="far fa-heart"></i> }
                                                    {/* <i className="far fa-heart"></i> */}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                            )) : (
                                <div className='no-result text-white'>Không tìm thấy kết quả phù hợp</div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </DefaultLayout>
    );
}

export default SearchMovie;
