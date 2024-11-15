import React, { useEffect, useState, useCallback } from 'react';
import './UploadForm.css';
import axios from 'axios';
import api from '../../api/api';

import CustomInputTag from '../../components/CustomInputTag/CustomInputTag';

function UploadForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [movie, setMovie] = useState(null);
  const [banner, setBanner] = useState(null);
  const [bannerUrl, setBannerUrl] = useState(null);
  const [poster, setPoster] = useState(null);
  const [posterUrl, setPosterUrl] = useState(null);

  const [mainTitle, setMainTitle] = useState('');
  const [subTitle, setSubTitle] = useState('');
  const [releaseYear, setReleaseYear] = useState('');
  const [country, setCountry] = useState('');
  const [description, setDescription] = useState('');
  const [genres, setGenres] = useState([]);
  const [directors, setDirectors] = useState([]);
  const [casts, setCasts] = useState([]);

  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === 'movie') setMovie(files[0]);
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

  const handleUpdateGenres = useCallback((selectedItems) => {
    setGenres(selectedItems.map(item => item._id));
  }, []);

  const handleUpdateDirectors = useCallback((selectedItems) => {
    setDirectors(selectedItems.map(item => item._id));
  }, []);

  const handleUpdateActors = useCallback((selectedItems) => {
    setCasts(selectedItems.map(item => item._id));
  }, []);


  const handleUpload = async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append('mainTitle', mainTitle);
  formData.append('subTitle', subTitle);
  formData.append('releaseYear', releaseYear);
  formData.append('country', country);
  formData.append('description', description);
  formData.append('genres', genres);
  formData.append('directors', directors);
  formData.append('casts', casts);
  formData.append('movie', movie);
  formData.append('banner', banner);
  formData.append('poster', poster);
  

  // In ra formData sau khi append
  for (let [key, value] of formData.entries()) {
    console.log(key, ":", value);
  }

  try {
    console.log("Uploading...");
    const response = await api.post('/movies/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${localStorage.getItem('accessToken')}` },

      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(percentCompleted);
      }
      
    });
    // setUploadProgress(100);
    alert(response.data.message || 'Upload successful');
    setUploadProgress(0);
    
  } catch (error) {
    console.error('Error uploading:', error);
    alert('Upload failed');
    setUploadProgress(0);
  }
};


  const handleNext = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const isNextEnabled = () => {
    if (currentStep === 1) return movie;
    if (currentStep === 2) return banner && poster;
    if (currentStep === 3) {
      return (
        mainTitle &&
        subTitle &&
        releaseYear &&
        country &&
        description &&
        genres.length > 0 &&
        directors.length > 0 &&
        casts.length > 0
      );
    }
    return false;
  };

  return (
    <div className="card">
      <div className="card-header text-start d-flex align-items-center justify-content-between">
        <h3 className='m-0'>Upload Movie</h3>
        <div className="roadmap d-flex justify-content-between">
          <div className={`ps-2 pe-2 step ${currentStep >= 1 ? 'active-step' : ''}`}>
            <div className="step-number">Step 1</div>
            <span>Movie Upload</span>
            <div className="step-border"></div>
          </div>
          <div className={`ps-2 pe-2 step ${currentStep >= 2 ? 'active-step' : ''}`}>
            <div className="step-number">Step 2</div>
            <span>Poster Upload</span>
            <div className="step-border"></div>
          </div>
          <div className={`ps-2 step ${currentStep >= 3 ? 'active-step' : ''}`}>
            <div className="step-number">Step 3</div>
            <span>Movie Information</span>
            <div className="step-border"></div>
          </div>
        </div>
      </div>

      <div className="card-body">
      {currentStep === 1 && (
        <div className="upload-step">
          <div className="drag-drop text-center position-relative">
            <input type="file" accept="video/*" name='movie' onChange={handleFileChange} required/>
            <i className="fas fa-cloud-upload-alt"></i>
            <p>Drag & Drop</p>
            <p>- or -</p>
            <p>Click to Upload Video</p>
          </div>
          {movie && (
            <div className="progress mt-3">
              <div className="progress-bar progress-bar-striped" style={{ width: '100%' }}>
                100%
              </div>
            </div>
          )}
        </div>
      )}

      {currentStep === 2 && (
        <div className="poster-upload d-flex justify-content-between">
          <div className="drag-drop-horizontal position-relative text-center d-flex align-items-center justify-content-center">
            <input type="file" accept="image/*" name="banner" onChange={handleFileChange} required/>
            {banner ? (
              <img src={bannerUrl} alt="Horizontal Banner" className="img-fluid rounded" />
            ) : (
              <p>Upload Banner</p>
            )}
          </div>
          <div className="drag-drop-vertical position-relative text-center d-flex align-items-center justify-content-center">
            <input type="file" accept="image/*" name="poster" onChange={handleFileChange} required/>
            {poster ? (
              <img src={posterUrl} alt="Vertical Poster" className="img-fluid rounded" />
            ) : (
              <p>Upload Poster</p>
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
                  <label htmlFor="releaseYear">Release Year</label>
                  <select name="releaseYear" className="form-control" onChange={(e) => setReleaseYear(e.target.value)} required>
                    <option value="">Select year</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label htmlFor="country">Country</label>
                  <select name="country" className="form-control" onChange={(e) => setCountry(e.target.value)} required>
                    <option value="">Select country</option>
                    <option value="Vietnam">Vietnam</option>
                    <option value="America">America</option>
                    <option value="Korean">Korean</option>
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
              />
            </div>
            <div className="col-md-4">
              <label htmlFor="directors">Directors</label>
              <CustomInputTag 
                name="directors"
                onUpdate={handleUpdateDirectors} 
              />
            </div>
            <div className="col-md-4">
              <label htmlFor="actors">Casts</label>
              <CustomInputTag 
                name="actors"
                onUpdate={handleUpdateActors} 
              />
            </div>
          </div>

        </div>
        
      )}

        {uploadProgress > 0 && (
          <div className="progress mt-3">
            <div
              className="progress-bar progress-bar-striped"
              role="progressbar"
              style={{ width: `${uploadProgress}%` }}
              aria-valuenow={uploadProgress}
              aria-valuemin="0"
              aria-valuemax="100"
            >
              {uploadProgress}%
            </div>
          </div>
        )}

      </div>

      <div className="card-footer text-end">
        <button
          className="btn btn-secondary me-2"
          onClick={handlePrev}
          disabled={currentStep === 1}
        >
          Back
        </button>
        <button
          className="btn btn-primary"
          onClick={currentStep === 3 ? handleUpload : handleNext}
          disabled={!isNextEnabled()}
        >
          {currentStep === 3 ? 'Upload' : 'Next'}
        </button>

      </div>

    </div>
  );
}

export default UploadForm;


