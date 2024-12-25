import React, { useState, useEffect, useRef } from 'react';
import './EditMovieForm.css';
import api from '../../api/api';

import Select, { components } from 'react-select';
import makeAnimated from 'react-select/animated';
import { countryOptions } from '../../data';

function EditMovieForm({ movieDataEdit, callCancelEditMovie, callEditMovie }) {
    const [currentStep, setCurrentStep] = useState(1);
    const [movieId, setMovieId] = useState(null);
    const [movie, setMovie] = useState(null);
    const [movieUrl, setMovieUrl] = useState(null);
    const [banner, setBanner] = useState(null);
    const [bannerUrl, setBannerUrl] = useState(null);
    const [poster, setPoster] = useState(null);
    const [posterUrl, setPosterUrl] = useState(null);

    const [mainTitle, setMainTitle] = useState('');
    const [subTitle, setSubTitle] = useState('');
    const [releaseDate, setReleaseDate] = useState('');
    const [duration, setDuration] = useState(0);
    const [country, setCountry] = useState('');
    const [description, setDescription] = useState('');
    const [genres, setGenres] = useState([]);
    const [directors, setDirectors] = useState([]);
    const [casts, setCasts] = useState([]);
    const [source, setSource] = useState('');

    const selectGenreRef = useRef(null);
    const selectDirectorRef = useRef(null);
    const selectCastRef = useRef(null);

    useEffect(() => {
        if (movieDataEdit) {
            setMovieId(movieDataEdit._id);
            setMainTitle(movieDataEdit.mainTitle);
            setSubTitle(movieDataEdit.subTitle);
            setReleaseDate(movieDataEdit.releaseDate.split('T')[0]);
            setDuration(movieDataEdit.duration);
            setCountry(movieDataEdit.country);
            setDescription(movieDataEdit.description);
            setGenres(movieDataEdit.genres);
            setDirectors(movieDataEdit.directors);
            setCasts(movieDataEdit.casts);
            setSource(movieDataEdit.source);
            console.log('movieDataEdit:', movieDataEdit);

            setBannerUrl(`https://idev1-bucket.s3.ap-southeast-2.amazonaws.com/movies/${movieDataEdit.source}/banner?timestamp=${new Date().getTime()}`);
            setPosterUrl(`https://idev1-bucket.s3.ap-southeast-2.amazonaws.com/movies/${movieDataEdit.source}/poster?timestamp=${new Date().getTime()}`);
            setMovieUrl(`https://idev1-bucket.s3.ap-southeast-2.amazonaws.com/movies/${movieDataEdit.source}/movie?timestamp=${new Date().getTime()}`);
        }
    }, [movieDataEdit]);

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (name === 'movie') {
            if (files && files[0]) {
                const movieInput = document.getElementById('movieInput');
                const allowedVideoTypes = ['video/mp4'];
                const file = e.target.files[0];
                if (!allowedVideoTypes.includes(file.type)) {
                    alert('Chỉ hỗ trợ định dạng mp4. Vui lòng thử lại.');
                    movieInput.value = '';
                    return;
                }

                const url = URL.createObjectURL(e.target.files[0]);
                const videoPlayer = document.createElement("video");
                videoPlayer.src = url;
                videoPlayer.onloadedmetadata = () => {
                    setDuration(videoPlayer.duration);
                }

                setMovieUrl(url);
                setMovie(files);
            }
        }
        if (name === 'banner') {
            if (files && files[0]) {
                const bannerInput = document.getElementById('bannerInput');
                const allowedVideoTypes = ['image/jpeg', 'image/jpg', 'image/png'];
                const file = e.target.files[0];
                if (!allowedVideoTypes.includes(file.type)) {
                    alert('Chỉ hỗ trợ các định dạng png, jpg, jpeg. Vui lòng thử lại.');
                    bannerInput.value = '';
                    return;
                }
                // Đảm bảo width > height
                const image = new Image();
                image.src = URL.createObjectURL(e.target.files[0]);
                image.onload = () => {
                if (image.width < image.height) {
                    alert('Kích thuớc hình ảnh không hợp lệ. Vui lòng thử lại.');
                    bannerInput.value = '';
                    setBannerUrl(null);
                    setBanner(null);
                    return;
                }
            }

            const url = URL.createObjectURL(e.target.files[0]);
            setBannerUrl(url);
            setBanner(files[0]);
        }
        } 
        if (name === 'poster') {
            if (files && files[0]) {
                const posterInput = document.getElementById('posterInput');
                const allowedVideoTypes = ['image/jpeg', 'image/jpg', 'image/png'];
                const file = e.target.files[0];
                if (!allowedVideoTypes.includes(file.type)) {
                    alert('Chỉ hỗ trợ các định dạng png, jpg, jpeg. Vui lòng thử lại.');
                    posterInput.value = '';
                    return;
                }

                // Đảm bảo width < height
                const image = new Image();
                image.src = URL.createObjectURL(e.target.files[0]);
                image.onload = () => {
                    if (image.width > image.height) {
                        alert('Kích thuớc hình ảnh không hợp lệ. Vui lòng thử lại.');
                        posterInput.value = '';
                        setPosterUrl(null);
                        setPoster(null);
                        return;
                    }
                }

                const url = URL.createObjectURL(e.target.files[0]);
                setPosterUrl(url);
                setPoster(files[0]);
            }
        }
    };

    const handleUploading = async () => {
        callEditMovie(movieId, mainTitle, subTitle, releaseDate, duration, country, description, genres, directors, casts, movie, banner, poster, source);
        handleResetForm();
        callCancelEditMovie();
    };


    const handleNext = () => {
        if (currentStep < 3) setCurrentStep(currentStep + 1);
    };

    const handlePrev = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    // const isNextEnabled = () => {
    //     if (currentStep === 1) return movie && duration;
    //     if (currentStep === 2) return banner && poster;
    //     if (currentStep === 3) {
    //     return (
    //         mainTitle &&
    //         subTitle &&
    //         releaseDate &&
    //         duration &&
    //         country &&
    //         description &&
    //         genres.length > 0 &&
    //         directors.length > 0 &&
    //         casts.length > 0
    //     );
    //     }
    //     return false;
    // };

    const handleResetForm = () => {
        setMainTitle('');
        setSubTitle('');
        setReleaseDate('');
        setCountry('');
        setDescription('');
        setGenres([]);
        setDirectors([]);
        setCasts([]);
        setSource('');
        setMovie(null);
        setBanner(null);
        setPoster(null);
        setBannerUrl(null);
        setPosterUrl(null);
        setCurrentStep(1);
    }

    const handleCancel = () => {
        handleResetForm();
        callCancelEditMovie();
    };

    const NoOptionsMessage = props => {
        return (
        <components.NoOptionsMessage {...props}>
            <span className="custom-css-className">Không tồn tại</span> 
        </components.NoOptionsMessage>
        );
    };

    const animatedComponents = makeAnimated();

    const [genreOptions, setGenreOptions] = useState([]);
    const [directorOptions, setDirectorOptions] = useState([]);
    const [actorOptions, setActorOptions] = useState([]);

    const fetchOptions = async (endpoint, setOptions) => {
        try {
            const response = await api.get(endpoint);
            const data = response.data.map((item) => ({
                value: item._id,
                label: item.name,
            }));
            setOptions(data);
        } catch (error) {
            console.error(`Error fetching data from ${endpoint}:`, error);
        }
    };

    // Hàm chung để xử lý tạo mới và cập nhật danh sách
    const handleCreate = async (inputValue, endpoint, setOptions) => {
        try {
        const response = await api.post(endpoint, { name: inputValue });
        const newItem = response.data;
        const newOption = { value: newItem._id, label: newItem.name };
        setOptions((prev) => [...prev, newOption]);

        return newOption;
        } catch (error) {
        console.error(`Error creating item at ${endpoint}:`, error);
        return null;
        }
    };

    // Hàm chung để xử lý sự kiện Enter
    const removeVietnameseTones = (str) => {
        return str
        .normalize("NFD") // Tách các dấu ra khỏi ký tự gốc
        .replace(/[\u0300-\u036f]/g, "") // Loại bỏ toàn bộ dấu
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D")
        .toLowerCase();
    };
    
    const handleKeyDown = async (event, options, inputValue, ref, endpoint, setOptions, setValues) => {
        if (event.key === "Enter" && inputValue.trim()) {
        const normalizedInput = removeVietnameseTones(inputValue.trim());
    
        // Kiểm tra nếu inputValue không trùng với bất kỳ option nào (sau khi chuẩn hóa)
        const isDuplicate = options.some((opt) => {
            const normalizedOption = removeVietnameseTones(opt.label);
            return normalizedOption === normalizedInput || normalizedOption.includes(normalizedInput);
        });
    
        if (!isDuplicate) {
            const newOption = await handleCreate(inputValue.trim(), endpoint, setOptions);
    
            if (newOption) {
            setValues((prev) => [...prev, newOption.value]);
    
            // Cập nhật giá trị hiển thị trên react-select
            const currentValues = ref.current.getValue();
            ref.current.setValue([...currentValues, newOption]);
            }
        } else {
            console.warn("Input matches an existing option.");
        }
        }
    };
    

    const [currentInputSelectGenreValue, setCurrentInputSelectGenreValue] = useState("");
    const [currentInputSelectDirectorValue, setCurrentInputSelectDirectorValue] = useState("");
    const [currentInputSelectCastValue, setCurrentInputSelectCastValue] = useState("");

    const handleInputSelectChange = (value, setValue) => {
        setValue(value);
    };

    

    const handleChange = (selectedOptions, setValues) => {
        const values = selectedOptions ? selectedOptions.map((opt) => opt.value) : [];
        setValues(values);
    };

    // Fetch dữ liệu ban đầu
    useEffect(() => {
        fetchOptions("/genres/get", setGenreOptions);
        fetchOptions("/directors/get", setDirectorOptions);
        fetchOptions("/actors/get", setActorOptions);
    }, []);


  return (
    <div className="card mb-4">
        <div className="card-header upload-card-header text-start d-flex align-items-center justify-content-between">
            <h2 className='m-0 d-flex align-items-center'><i className="fa-solid fa-upload me-3"></i> Chỉnh sửa phim</h2>

            <div className="roadmap d-flex justify-content-between">
            <div className={`ps-2 pe-2 step ${currentStep >= 1 ? 'active-step' : ''}`}>
                <div className="step-number">Bước 1</div>
                <span>Đăng tải phim</span>
                <div className="step-border"></div>
            </div>
            <div className={`ps-2 pe-2 step ${currentStep >= 2 ? 'active-step' : ''}`}>
                <div className="step-number">Bước 2</div>
                <span>Đăng tải hình ảnh</span>
                <div className="step-border"></div>
            </div>
            <div className={`ps-2 step ${currentStep >= 3 ? 'active-step' : ''}`}>
                <div className="step-number">Bước 3</div>
                <span>Thông tin phim</span>
                <div className="step-border"></div>
            </div>
            </div>
        </div>

        <div className="card-body">
        {currentStep === 1 && (
            <div className="upload-step">
            <div className="drag-drop text-center position-relative">
                <input type="file" accept="video/*" id='movieInput' name='movie' onChange={handleFileChange} required/>
                {movieUrl ? (
                <video src={movieUrl} controls className="video-fluid rounded" />
                ) : (
                <div className='upload-icon-form'>
                    <i className="fas fa-cloud-upload-alt "></i>
                    <p>Kéo & Thả</p>
                    <p>- or -</p>
                    <p>Nhấn Để Đăng Tải</p>
                </div>
                )}
            </div>
            </div>
        )}

        {currentStep === 2 && (
            <div className="poster-upload d-flex justify-content-between">
                <div className="drag-drop-horizontal position-relative text-center d-flex align-items-center justify-content-center">
                    <input type="file" accept="image/*" id='bannerInput' name="banner" onChange={handleFileChange} required/>
                    {bannerUrl ? (
                        <img src={bannerUrl} alt="Horizontal Banner" className="img-fluid rounded" />
                    ) : (
                        <p>Đăng Tải Áp Phích Ngang</p>
                    )}
                </div>
                <div className="drag-drop-vertical position-relative text-center d-flex align-items-center justify-content-center">
                    <input type="file" accept="image/*" id='posterInput' name="poster" onChange={handleFileChange} required/>
                    {posterUrl ? (
                        <img src={posterUrl} alt="Vertical Poster" className="img-fluid rounded" />
                    ) : (
                        <p>Đăng Tải Áp Phích Dọc</p>
                    )}
                </div>
            </div>
        )}

        {currentStep === 3 && (
            <div className='step-three-upload'>
                <div className="d-flex flex-column flex-md-row">
                    <div className="col-md-6 p-2">
                        <div className="text-center mb-3">
                            {bannerUrl && (
                            <img src={bannerUrl} alt="Banner" className="img-fluid rounded banner-image p-2" />
                            )}
                        </div>
                    </div>

                    <div className="col-md-6 ">
                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label htmlFor="title">Tiêu đề phim</label>
                                <input
                                    type="text"
                                    name="mainTitle"
                                    className="form-control"
                                    placeholder="Nhập tiêu đề phim"
                                    value={mainTitle} 
                                    onChange={(e) => setMainTitle(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="subtitle">Tiêu đề phụ</label>
                                <input
                                    type="text"
                                    name="subTitle"
                                    className="form-control"
                                    placeholder="Nhập tiêu đề phụ"
                                    value={subTitle}
                                    onChange={(e) => setSubTitle(e.target.value)} 
                                    required
                                />
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col-md-6">
                        <label htmlFor="releaseDate">Ngày công chiếu</label>
                        <input 
                            type='date'
                            name="releaseDate"
                            className="form-control"
                            placeholder="Enter release year"
                            value={releaseDate}
                            onChange={(e) => setReleaseDate(e.target.value)}
                            required
                        />
                        </div>
                        <div className="col-md-6 upload-select-country">
                        <label htmlFor="country">Quốc gia</label>
                        <Select
                            isSearchable
                            isClearable
                            options={countryOptions} 
                            value={countryOptions.find(option => option.value === country)}
                            placeholder="Quốc gia"
                            components={{ NoOptionsMessage }}
                            name="country"
                            onChange={(selectedOption) => setCountry(selectedOption.value)}
                            classNamePrefix="react-select"
                        />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="description">Mô tả</label>
                        <textarea
                        name="description"
                        className="form-control"
                        placeholder="Nhập mô tả"
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                        required 
                        />
                    </div>
                </div>
            </div>

            <div className="row mb-3 multi-input-tag-box">
                <div className="col-md-4">
                <label htmlFor="genres">Thể loại</label>
                <Select
                    isClearable={false}
                    closeMenuOnSelect={false}
                    components={animatedComponents}
                    placeholder="Thể loại"
                    isMulti
                    options={genreOptions}
                    value={genreOptions.filter((option) => genres.includes(option.value))}
                    classNamePrefix="react-select"
                    onChange={(selectedOptions) => handleChange(selectedOptions, setGenres)}
                    onInputChange={(value) => handleInputSelectChange(value, setCurrentInputSelectGenreValue)}
                    onKeyDown={(e) =>
                        handleKeyDown(e, genreOptions, currentInputSelectGenreValue, selectGenreRef, "/genres/create", setGenreOptions, setGenres)
                    }
                    ref={selectGenreRef}
                />
            
                </div>
                <div className="col-md-4">
                <label htmlFor="directors">Đạo diễn</label>
                <Select
                    isClearable={false}
                    closeMenuOnSelect={false}
                    components={{ animatedComponents}}
                    placeholder="Đạo diễn"
                    isMulti
                    options={directorOptions}
                    value={directorOptions.filter((option) => directors.includes(option.value))}
                    classNamePrefix="react-select"
                    onChange={(selectedOptions) => handleChange(selectedOptions, setDirectors)}
                    onInputChange={(value) => handleInputSelectChange(value, setCurrentInputSelectDirectorValue)}
                    onKeyDown={(e) =>
                        handleKeyDown(e, directorOptions, currentInputSelectDirectorValue, selectDirectorRef, "/directors/create", setDirectorOptions, setDirectors)
                    }
                    ref={selectDirectorRef}

                />
                <br />


                </div>
                <div className="col-md-4">
                <label htmlFor="actors">Diễn viên</label>
                <Select
                    isClearable={false}
                    closeMenuOnSelect={false}
                    components={animatedComponents}
                    placeholder="Diễn viên"
                    isMulti
                    options={actorOptions}
                    value={actorOptions.filter((option) => casts.includes(option.value))}
                    classNamePrefix="react-select"
                    onChange={(selectedOptions) => handleChange(selectedOptions, setCasts)}
                    onInputChange={(value) => handleInputSelectChange(value, setCurrentInputSelectCastValue)}
                    onKeyDown={(e) =>
                        handleKeyDown(e, actorOptions, currentInputSelectCastValue, selectCastRef, "/actors/create", setActorOptions, setCasts)
                    }
                    ref={selectCastRef}

                />
                <br />


                </div>
            </div>

            </div>
            
        )}

        </div>

        <div className="card-footer upload-card-footer d-flex justify-content-between">
            <button
            className="btn btn-secondary me-2"
            onClick={()=>handleCancel()}
            >
            Hủy
            </button>
            <div>
            <button
                className="btn btn-secondary me-2"
                onClick={handlePrev}
                disabled={currentStep === 1}
            >
                Quay lại
            </button>
            <button
                className="btn btn-primary"
                onClick={ currentStep === 3 ? handleUploading : handleNext}
                // onClick={currentStep === 3 ? handleUpload : handleNext}
                // disabled={!isNextEnabled()}
            >
                {currentStep === 3 ? 'Đăng tải' : 'Tiếp theo'}
            </button>
            </div>

        </div>

    </div>
  );
}

export default EditMovieForm;


