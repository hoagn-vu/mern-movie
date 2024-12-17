import React, { useState, useEffect } from "react";
import './Tpage.css';
import api from '../../api/api';

import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import ImageWithSkeleton from '../../components/ImageWithSkeletonSwiper/ImageWithSkeletonSwiper';

const Tpage = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
  
    const handleSendEmail = async () => {
        setMessage('Sending email...');
        try {
            const response = await api.post('/email/send' , { 
                email,
                code: randomCode(),
            });
            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Xảy ra lỗi khi gửi email!');
        }
    };

    const randomCode = () => {
        // Random code 6 digits containing numbers and letters
        const code = Math.random().toString(36).substring(2, 8).toUpperCase();
        return code;
    }


    const [sortChosen, setSortChosen] = useState('');
    const handleChooseSort = () => {
        if (sortChosen === 'asc') {
            setSortChosen('desc');
        } else if (sortChosen === 'desc') {
            setSortChosen('asc');
        } else {
            setSortChosen('asc');
        }
    }




    const [toggle, setToggle] = useState(false);

    const handleClick = () => {
      setToggle((prev) => !prev);
    };



    const [showToast, setShowToast] = useState(true);
    const handleShowToast = () => {
        setShowToast(true);
    };
    const closeToast = () => {
      setShowToast(false);
    };
    const [isUploading, setIsUploading] = useState(false);

    const movies = [{'id': 1, 'name': 'Movie 1 with title so long fasdf ádfa ưer d'}, {'id': 2, 'name': 'Movie 2'}, {'id': 3, 'name': 'Movie 3'}];

    const [progresses, setProgresses] = useState(
        movies.map(() => 0) // Tạo mảng progress với giá trị ban đầu là 0
    );
    useEffect(() => {
        if (showToast) {
            setIsUploading(true);
            const interval = setInterval(() => {
                setProgresses((prev) =>
                    prev.map((p) => (p < 100 ? p + 5 : 100)) // Tăng dần giá trị progress
                );
            }, 500); // Cập nhật mỗi 500ms
            return () => clearInterval(interval); // Clear interval khi component unmount
            
        }
    }, [showToast, isUploading]);
 

    return (
        <div className="container container-test">

            {/* <button className="btn btn-primary" onClick={handleShowToast}>Hiện Toast</button> */}
            {/* <button className="btn btn-primary" onClick={startUpload}>Start Upload</button> */}

            <div className="toast-container position-fixed bottom-0 end-0 pe-3" style={{ zIndex: 1055 }} >
                <div className={`toast upload-movie-toast align-items-center ${showToast ? "show" : ""}`} data-bs-autohide="false" >
                    <div className="toast-header">
                        <i className="fa-solid fa-upload me-2"></i>
                        <h5 className="me-auto mb-0"><strong>Đang tải</strong></h5>
                        <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close" onClick={closeToast}></button>
                    </div>
                    <div className="toast-body">
                        {isUploading ? (
                            <div className="uploading-alert">
                                <p className="mb-0">Vui lòng không chuyển trang tránh gián đoạn...</p>
                            </div>
                        ) : null }
                        {movies.map((movie, index) => (
                            <div className="movie-upload-row d-flex align-items-center" key={movie.id}>
                                <i className="upload-type-icon fa-solid fa-clapperboard me-3"></i>
                                <h6 className="me-auto mb-0">{movie.name}</h6>

                                {progresses[index] === 100 ? (
                                    <i className="fa-solid fa-check-circle text-success ms-3"></i>
                                ) : (
                                    // <i className="fa-solid fa-spinner fa-spin text-primary ms-3"></i>
                                    <div className=" d-flex align-items-center ms-3" style={{ width: 18, height: 18 }}>
                                        <CircularProgressbar
                                            value={progresses[index]}
                                            strokeWidth={12}
                                            // text={`${progresses[0]}%`}
                                            styles={buildStyles({
                                                textColor: '#000',
                                                pathColor: '#ff6500',
                                                trailColor: '#e5e7eb',
                                            })}
                                        />
                                    </div>


                                    // <div className="progress-circle ms-3">
                                    //     <svg viewBox="0 0 36 36" className="circular-chart">
                                    //     <path
                                    //         className="circle-bg"
                                    //         d="M18 2.0845
                                    //         a 15.9155 15.9155 0 0 1 0 31.831
                                    //         a 15.9155 15.9155 0 0 1 0 -31.831"
                                    //     />
                                    //     <path
                                    //         className="circle"
                                    //         strokeDasharray={`${progresses[index]}, 100`}
                                    //         d="M18 2.0845
                                    //         a 15.9155 15.9155 0 0 1 0 31.831
                                    //         a 15.9155 15.9155 0 0 1 0 -31.831"
                                    //     />
                                    //     </svg>
                                    // </div>
                                )}
                                
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <h1>Skeleton Loading Example</h1>
            <ImageWithSkeleton
                src="https://your-s3-path-to-image.amazonaws.com/your-image.jpg"
                alt="AWS S3 Image"
                width="300px"
                height="200px"
            />

            <hr />

            <h1>Test 2</h1>
            <i className={`fa-solid fa-sort ${toggle ? "half-bottom" : "half-top"}`} onClick={handleClick}></i>

            <div style={{ width: 19, height: 19 }}>
                <CircularProgressbar
                    value={progresses[0]}
                    // text={`${progresses[0]}%`}
                    styles={buildStyles({
                        textColor: '#000',
                        pathColor: '#ff6500',
                        trailColor: '#e5e7eb',
                    })}
                />
            </div>




            <hr />
            <div className="ms-5 ps-5 test-dropdown-ellipsis">
                <i className="fa-solid fa-ellipsis-vertical" ></i>

                <div className="dropdown ms-5">
                    <a className="dropdown-toggle ps-1 pe-1 border text-dark text-decoration-none" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <i className="fa-solid fa-ellipsis-vertical" ></i>
                    </a>
                    <ul className="dropdown-menu dropdown-menu-end">
                        <li>
                            <a className="dropdown-item delete-comment">Xóa bình luận</a>
                        </li>
                    </ul>
                </div>

            </div>
            

        </div>

        // <div className="container">
        //     <div className="mb-3">
        //         <label for="emailInput" className="form-label">Email address</label>
        //         <input 
        //             type="email"
        //             className="form-control" 
        //             id="emailInput" 
        //             placeholder="name@example.com"
        //             value={email}
        //             onChange={(e) => setEmail(e.target.value)}
        //         />
        //     </div>

        //     <button className="btn btn-primary m-0 mb-3" onClick={handleSendEmail}>
        //         Send Email
        //     </button>
        //     {message && (
        //         <p>{message}</p>
        //     )}
        // </div>

        // <div
        //     className="d-flex justify-content-center align-items-center"
        //     style={{
        //         position: 'fixed',
        //         top: 0,
        //         left: 0,
        //         width: '100vw',
        //         height: '100vh',
        //         backgroundColor: 'rgba(0, 0, 0, 0.1)',
        //         zIndex: '9999',
        //     }}
        // >
        //     <div
        //         className="spinner-border text-secondary"
        //         role="status"
        //         style={{ width: '3rem', height: '3rem' }}
        //     >
        //         <span className="visually-hidden">Loading...</span>
        //     </div>
        // </div>




    );
}

export default Tpage;
