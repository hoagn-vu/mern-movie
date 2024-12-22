import React, { useState, useCallback, useEffect } from 'react';
import './EditMovieForm.css';

import CustomInputTag from '../../components/CustomInputTag/CustomInputTag';

function EditMovieForm({ movieDataEdit, callCancelEditMovie, handleEditMovie }) {
    const [currentStep, setCurrentStep] = useState(1);
    const [movieId, setMovieId] = useState(null);
    const [movie, setMovie] = useState(null);
    const [movieUrl, setMovieUrl] = useState(null);
    const [banner, setBanner] = useState(null);
    const [bannerUrl, setBannerUrl] = useState(null);
    const [poster, setPoster] = useState(null);
    const [posterUrl, setPosterUrl] = useState(null);
    
    const [source, setSource] = useState('');

    const [mainTitle, setMainTitle] = useState('');
    const [subTitle, setSubTitle] = useState('');
    const [releaseDate, setReleaseDate] = useState('');
    const [duration, setDuration] = useState(0);
    const [country, setCountry] = useState('');
    const [description, setDescription] = useState('');
    const [genres, setGenres] = useState([]);
    const [directors, setDirectors] = useState([]);
    const [casts, setCasts] = useState([]);

    const [uploadProgress, setUploadProgress] = useState(0);

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

            setBannerUrl(`https://idev1-bucket.s3.ap-southeast-2.amazonaws.com/movies/${movieDataEdit.source}/banner`);
            setPosterUrl(`https://idev1-bucket.s3.ap-southeast-2.amazonaws.com/movies/${movieDataEdit.source}/poster`);
            setMovieUrl(`https://idev1-bucket.s3.ap-southeast-2.amazonaws.com/movies/${movieDataEdit.source}/movie`);
        }
    }, [movieDataEdit]);


    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (name === 'movie') {
            if (files && files[0]) {
                const url = URL.createObjectURL(e.target.files[0]);
                const videoPlayer = document.createElement("video");
                videoPlayer.src = url;
                videoPlayer.onloadedmetadata = () => {
                    setDuration(videoPlayer.duration);
                }

                setMovieUrl(url);
                setMovie(files[0]);
            }
        }
        if (name === 'banner') {
            if (files && files[0]) {
                const url = URL.createObjectURL(e.target.files[0]);
                setBannerUrl(url);
                setBanner(files[0]);
            }
        } 
        if (name === 'poster') {
            if (files && files[0]) {
                const url = URL.createObjectURL(e.target.files[0]);
                setPosterUrl(url);
                setPoster(files[0]);
            }
        }
    };

    const handleResetForm = () => {
        setMainTitle('');
        setSubTitle('');
        setReleaseDate('');
        setCountry('');
        setDescription('');
        setGenres([]);
        setDirectors([]);
        setCasts([]);
        setMovie(null);
        setBanner(null);
        setPoster(null);
        setBannerUrl(null);
        setPosterUrl(null);
        setCurrentStep(1);
    }

    const handleEditing = async () => {
        handleEditMovie(movieId, mainTitle, subTitle, releaseDate, duration, country, description, genres, directors, casts, movie, banner, poster, source)
        handleResetForm();
        callCancelEditMovie();
    };

    const handleUpdateGenres = useCallback((selectedItems) => {
        setGenres(selectedItems.map(item => item._id));
    }, []);

    const handleUpdateDirectors = useCallback((selectedItems) => {
        setDirectors(selectedItems.map(item => item._id));
    }, []);

    const handleUpdateActors = useCallback((selectedItems) => {
        setCasts(selectedItems.map(item => item._id));
    }, []);


    const handleNext = () => {
        if (currentStep < 3) setCurrentStep(currentStep + 1);
    };

    const handlePrev = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };


return (
    <div className="card mb-4">
    <div className="card-header upload-card-header text-start d-flex align-items-center justify-content-between">
        <h2 className='m-0 d-flex align-items-center'><i class="fa-solid fa-upload me-3"></i> Chỉnh sửa Phim</h2>

        <div className="roadmap d-flex justify-content-between">
        <div className={`ps-2 pe-2 step ${currentStep >= 1 ? 'active-step' : ''}`}>
            <div className="step-number">Bước 1</div>
            <span>Đăng tải phim</span>
            <div className="step-border"></div>
        </div>
        <div className={`ps-2 pe-2 step ${currentStep >= 2 ? 'active-step' : ''}`}>
            <div className="step-number">Bước2</div>
            <span>Đăng tải hình ảnh</span>
            <div className="step-border"></div>
        </div>
        <div className={`ps-2 step ${currentStep >= 3 ? 'active-step' : ''}`}>
            <div className="step-number">Bước3</div>
            <span>Thông tin phim</span>
            <div className="step-border"></div>
        </div>
        </div>
    </div>

    <div className="card-body">
    {currentStep === 1 && (
        <div className="upload-step">
        <div className="drag-drop text-center position-relative">
            <input type="file" accept="video/*" name='movie' onChange={handleFileChange} required/>
            {movieUrl ? (
            <video src={movieUrl} controls className="img-fluid rounded" />
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
            <input type="file" accept="image/*" name="banner" onChange={handleFileChange} required/>
            {bannerUrl ? (
                <img src={bannerUrl} alt="Horizontal Banner" className="img-fluid rounded" />
            ) : (
                <p>Đăng tải áp phích ngang</p>
            )}
        </div>
        <div className="drag-drop-vertical position-relative text-center d-flex align-items-center justify-content-center">
            <input type="file" accept="image/*" name="poster" onChange={handleFileChange} required/>
            {posterUrl ? (
                <img src={posterUrl} alt="Vertical Poster" className="img-fluid rounded" />
            ) : (
                <p>Đăng tải áp phích dọc</p>
            )}
        </div>
        </div>
    )}

    {currentStep === 3 && (
        <div>
        <div className="d-flex flex-column flex-md-row">
            <div className="col-md-6 p-2">
            <div className="text-center mb-3">
                {bannerUrl && (
                <img src={bannerUrl} alt="Banner" className="img-fluid rounded banner-image p-2" />
                )}
            </div>

            </div>

            <div className="col-md-6">
            <div className="row mb-3">
                <div className="col-md-6">
                <label htmlFor="title">Title</label>
                <input
                    type="text"
                    name="mainTitle"
                    className="form-control"
                    placeholder="Enter title"
                    value={mainTitle} 
                    onChange={(e) => setMainTitle(e.target.value)}
                    required
                />
                </div>
                <div className="col-md-6">
                <label htmlFor="subtitle">Subtitle</label>
                <input
                    type="text"
                    name="subTitle"
                    className="form-control"
                    placeholder="Enter subtitle"
                    value={subTitle}
                    onChange={(e) => setSubTitle(e.target.value)} 
                    required
                />
                </div>
            </div>

            <div className="row mb-3">
                <div className="col-md-6">
                <label htmlFor="releaseDate">Release Date</label>
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
                <div className="col-md-6">
                <label htmlFor="country">Country</label>
                <select name="country" value={country} className="form-control" onChange={(e) => setCountry(e.target.value)} required>
                    <option value="">Select country</option>
                    <option value="Việt Nam">Việt Nam</option>
                    <option value="Hoa Kỳ">Hoa Kỳ</option>
                    <option value="Hàn Quốc">Hàn Quốc</option>
                    <option value="Nhật Bản">Nhật Bản</option>
                    <option value="Trung Quốc">Trung Quốc</option>
                </select>
                </div>
            </div>

            <div className="mb-3">
                <label htmlFor="description">Description</label>
                <textarea
                name="description"
                className="form-control"
                placeholder="Enter description"
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                required 
                />
            </div>
            </div>
        </div>

        <div className="row mb-3">
            <div className="col-md-4">
            <label htmlFor="genres">Genres</label>
            <CustomInputTag 
                name="genres"
                onUpdate={handleUpdateGenres}
                valueInput={genres}
            />
            </div>
            <div className="col-md-4">
            <label htmlFor="directors">Directors</label>
            <CustomInputTag 
                name="directors"
                onUpdate={handleUpdateDirectors}
                valueInput={directors}
            />
            </div>
            <div className="col-md-4">
            <label htmlFor="actors">Casts</label>
            <CustomInputTag 
                name="actors"
                onUpdate={handleUpdateActors} 
                valueInput={casts}
            />
            </div>
        </div>

        </div>
        
    )}

    </div>

    <div className="card-footer upload-card-footer d-flex justify-content-between">
        <button
        className="btn btn-secondary me-2"
        onClick={callCancelEditMovie}
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
            onClick={()=>currentStep === 3 ? handleEditing() : handleNext()}
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


