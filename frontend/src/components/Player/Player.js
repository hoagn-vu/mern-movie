import React, { useRef, useEffect, useState } from "react";
import './Player.css';
import api from "../../api/api";
import { useParams } from "react-router-dom";

const Player = ({  movieSource, callOpenReportModal, history }) => {
    const { userId, movieId } = useParams();

    const playerContainerRef = useRef(null);
    const videoRef = useRef(null);
    const progressBarRef = useRef(null);
    const timelineRef = useRef(null);
    const volumeSliderRef = useRef(null);
  
    const [isPlaying, setIsPlaying] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [openMenu, setOpenMenu] = useState(null);
    const [currentSpeed, setCurrentSpeed] = useState(1);
    const [currentPerform, setCurrentPerform] = useState(1080);

    let inactivityTimeout = useRef(null);

    const showControls = () => {
        const container = playerContainerRef.current;
        if (container) {
            container.classList.add("show-controls");
            container.classList.remove("hide-cursor");
        }
    };

    const hideControls = () => {
        const container = playerContainerRef.current;
        const video = videoRef.current;
        if (video && container && !video.paused) {
            container.classList.remove("show-controls");
            if (isFullscreen) {
                container.classList.add("hide-cursor");
            }
        }
    };

    const resetInactivityTimer = () => {
        showControls();
        clearTimeout(inactivityTimeout.current);
        inactivityTimeout.current = setTimeout(() => {
            hideControls();
        }, 3000);
    };

    const handleMouseLeave = () => {
        clearTimeout(inactivityTimeout.current);
        hideControls();
    };

    const handleFullscreenChange = () => {
        resetInactivityTimer();
    };

    useEffect(() => {
        const container = playerContainerRef.current;
        const video = videoRef.current;

        if (container) {
            container.addEventListener("mousemove", resetInactivityTimer);
            container.addEventListener("mouseleave", handleMouseLeave);
        }

        if (video) {
            video.addEventListener("play", resetInactivityTimer);
            video.addEventListener("pause", showControls);
        }

        document.addEventListener("fullscreenchange", handleFullscreenChange);

        return () => {
            if (container) {
                container.removeEventListener("mousemove", resetInactivityTimer);
                container.removeEventListener("mouseleave", handleMouseLeave);
            }
            if (video) {
                video.removeEventListener("play", resetInactivityTimer);
                video.removeEventListener("pause", showControls);
            }
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
        };
    }, []);

    const formatTime = (time) => {
        let seconds = Math.floor(time % 60);
        let minutes = Math.floor(time / 60);
    
        seconds = seconds < 10 ? `0${seconds}` : seconds;
        minutes = minutes < 10 ? `0${minutes}` : minutes;
    
        return `${minutes}:${seconds}`;
        // let seconds = Math.floor(time % 60),
        //   minutes = Math.floor(time / 60) % 60,
        //   hours = Math.floor(time / 3600);
    
        // seconds = seconds < 10 ? `0${seconds}` : seconds;
        // minutes = minutes < 10 ? `0${minutes}` : minutes;
        // hours = hours > 0 && hours < 10 ? `0${hours}` : hours;
    
        // return hours ? `${hours}:${minutes}:${seconds}` : `${minutes}:${seconds}`;
    };
    
    const handlePlayPause = () => {
        const video = videoRef.current;

        if (video.paused) {
            video.play();
            setIsPlaying(true);
        } else {
            video.pause();
            setIsPlaying(false);

            saveWatchHistory();
        }
    };

    const handleFullscreen = () => {
        const playerContainer = playerContainerRef.current;
        if (!isFullscreen) {
            if (playerContainer.requestFullscreen) {
                playerContainer.requestFullscreen();
            } else if (playerContainer.webkitRequestFullscreen) {
                playerContainer.webkitRequestFullscreen();
            }
            setIsFullscreen(true);
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
            setIsFullscreen(false);
        }
    };

    useEffect(() => {
        const video = videoRef.current;

        video.addEventListener("click", handlePlayPause);

        return () => {
            video.removeEventListener("click", handlePlayPause);
        };
    }, []);

    // useEffect(() => {
    //     const handleKeyDown = (e) => {
    //         if (e.code === "Space") {
    //             e.preventDefault();
    //             handlePlayPause();
    //         }
    //     };

    //     document.addEventListener("keydown", handleKeyDown);
    //     return () => {
    //         document.removeEventListener("keydown", handleKeyDown);
    //     };
    // }, []);
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Kiểm tra nếu sự kiện xảy ra trong input, textarea, hoặc phần tử có thể chỉnh sửa (contenteditable)
            const target = e.target;
            const isInputField =
                target.tagName === "INPUT" ||
                target.tagName === "TEXTAREA" ||
                target.isContentEditable;
            // const isTargetVideo = target.tagName === "SOURCE" || target.tagName === "VIDEO";
    
            if (isInputField) {
                return;
            }
            if (isBuffering) {
                if (e.code === "Space") {
                    e.preventDefault();
                    return;
                }
                return;
            }
            // if (!isTargetVideo) {
            //     e.preventDefault();
            //     return;
            // }

            if (e.code === "Space") {
                e.preventDefault();
                handlePlayPause();
            } else if (e.code === "KeyF") {
                handleFullscreen();
            } else if (e.code === "ArrowRight") {
                handleSkip("forward");
            } else if (e.code === "ArrowLeft") {
                handleSkip("backward");
            } else if (e.code === "KeyM") {
                handleClickVolumeBtn(e);
            } else if (e.code === "KeyP") {
                handlePicInPic();
            }
        };
    
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);
    

    const handleSkip = (type) => {
        const video = videoRef.current;
        if (type === 'backward') {
            const newTime = video.currentTime - 10;
            setCurrentTime(newTime);
            // Hiển thị spinner nếu đoạn đó chưa được tải
            if (video.readyState < 3) {
                setIsBuffering(true);
            }
            video.currentTime = newTime;
        } else if (type === 'forward') {
            const newTime = video.currentTime + 10;
            setCurrentTime(newTime);
            if (video.readyState < 3) {
                setIsBuffering(true);
            }
            video.currentTime = newTime;
        }
    }

    const handleClickVolumeBtn = (event) => {
        const video = videoRef.current;
        const volumeSlider = volumeSliderRef.current;
        const volumeIcon = event.target.tagName === "I" ? event.target : event.target.querySelector(".volume-icon");
      
        if (!volumeIcon.classList.contains("fa-volume-high")) {
            video.volume = 1;
            volumeIcon.classList.replace("fa-volume-xmark", "fa-volume-high");
        } else {
            video.volume = 0;
            volumeIcon.classList.replace("fa-volume-high", "fa-volume-xmark");
        }
        setVolume(video.volume);
        const value = ((volumeSlider.value - volumeSlider.min) / (volumeSlider.max - volumeSlider.min)) * 100;
        volumeSlider.style.background = `linear-gradient(to right, #d3d3d3 ${value}%, #ff6500 ${value}%)`;
    };
    
    const handleVolumeChange = (e) => {
        const video = videoRef.current;
        const volumeSlider = volumeSliderRef.current;
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (video) {
          video.volume = newVolume;
        }
        const value = ((volumeSlider.value - volumeSlider.min) / (volumeSlider.max - volumeSlider.min)) * 100;
        volumeSlider.style.background = `linear-gradient(to right, #ff6500 ${value}%, #d3d3d3 ${value}%)`;
    };

    const handleTimeUpdate = () => {
        const video = videoRef.current;
        setCurrentTime(video.currentTime);
        if (progressBarRef.current) {
            const percent = (video.currentTime / video.duration) * 100;
            progressBarRef.current.style.width = `${percent}%`;
        }

        if (video) {
            const currentTime = video.currentTime;
            const duration = video.duration;

            if (currentTime >= duration - 1) {
                saveWatchHistory();
                // updateViews();
                // setViewUpdated(true); // Đảm bảo chỉ gọi API một lần
            }


        }
    };
    
    const handleLoadedData = () => {
        const video = videoRef.current;
        setDuration(video.duration);
        setIsBuffering(false);
    };

    const handlePlaybackMenuToggle = (menuType) => {
        if (openMenu === menuType) {
            setOpenMenu(null); // Đóng menu nếu đang mở
        } else {
            setOpenMenu(menuType); // Mở menu mới
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            const playbackContent = document.querySelector(".playback-content");
            if (playbackContent && !playbackContent.contains(event.target)) {
                setOpenMenu(null);
            }
        };
    
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    const handlePerformChange = (perform) => {
        setCurrentPerform(perform);
        alert(`Tạm thời chưa hỗ trợ\n(Coi như) Đã chuyển sang chất lượng ${perform}`)

        // Xóa class 'active' hiện tại
        document.querySelector(".perform-option.active")?.classList.remove("active");
    
        // Thêm class 'active' vào lựa chọn mới
        document.querySelector(`.perform-option[data-perform="${perform}"]`)?.classList.add("active");
    }
    
    const handleSpeedChange = (speed) => {
        const video = videoRef.current;
        video.playbackRate = parseFloat(speed);
        setCurrentSpeed(speed);
    
        // Xóa class 'active' hiện tại
        document.querySelector(".speed-option.active")?.classList.remove("active");
    
        // Thêm class 'active' vào lựa chọn mới
        document.querySelector(`.speed-option[data-speed="${speed}"]`)?.classList.add("active");
    };
    

    const handlePicInPic = () => {
        const mainVideo = videoRef.current;
        mainVideo.requestPictureInPicture();
    }

    const handleContainerDoubleClick = () => {
        // Chỉ xử lý thoát fullscreen nếu đang fullscreen
        if (isFullscreen) {
            handleFullscreen();
        } else {
            handleFullscreen();
        }
    };

    useEffect(() => {
        const video = videoRef.current;

        video.addEventListener("dblclick", handleContainerDoubleClick);

        return () => {
            video.removeEventListener("dblclick", handleContainerDoubleClick);
        };
    }, [isFullscreen]);



    const handleTimelineMouseMove = (e) => {
        const video = videoRef.current;
        const timelineWidth = timelineRef.current.offsetWidth;
        const offsetX = e.nativeEvent.offsetX;
        const newTime = (offsetX / timelineWidth) * video.duration;
    
        // Hiển thị tooltip
        const tooltip = progressBarRef.current.previousElementSibling;
        tooltip.style.left = `${offsetX}px`;
        tooltip.textContent = newTime < 0 ? "00:00" : formatTime(newTime);
    };
    
    const [isBuffering, setIsBuffering] = useState(true);

    const handleTimelineClick = (e) => {
        const video = videoRef.current;
        const timelineWidth = timelineRef.current.offsetWidth;
        const offsetX = e.nativeEvent.offsetX;
        const newTime = (offsetX / timelineWidth) * video.duration;
    
        setCurrentTime(newTime); // Cập nhật thanh tiến trình ngay lập tức
        progressBarRef.current.style.width = `${(newTime / video.duration) * 100}%`;
    
        video.currentTime = newTime;
    
        // Hiển thị spinner nếu đoạn đó chưa được tải
        if (video.readyState < 3) {
            setIsBuffering(true);
        }
    
        // Nếu video đang phát, tiếp tục phát
        if (isPlaying) {
            video.play();
        }
    };
    
    useEffect(() => {
        const video = videoRef.current;
    
        const handleWaiting = () => {
            setIsBuffering(true); // Hiển thị spinner khi video tải
        };
    
        const handleCanPlay = () => {
            setIsBuffering(false); // Ẩn spinner khi video sẵn sàng phát
        };
    
        video.addEventListener("waiting", handleWaiting);
        video.addEventListener("canplay", handleCanPlay);
    
        return () => {
            video.removeEventListener("waiting", handleWaiting);
            video.removeEventListener("canplay", handleCanPlay);
        };
    }, []);
    
    
    
    
    const handleTimelineMouseDown = (e) => {
        const timeline = timelineRef.current;
    
        const handleMouseMove = (event) => {
            const timelineWidth = timeline.offsetWidth;
            const offsetX = event.pageX - timeline.getBoundingClientRect().left;
            const clampedOffset = Math.max(0, Math.min(offsetX, timelineWidth));
            const percent = clampedOffset / timelineWidth;
            videoRef.current.currentTime = percent * videoRef.current.duration;
        };
    
        const handleMouseUp = () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };




    const saveWatchHistory = async () => {
        try {
            await api.post(`/movies/saveWatchHistory`, {
                userId: userId,
                movieId: movieId,
                timeWatched: videoRef.current.currentTime === videoRef.current.duration
                ? 0
                : videoRef.current.currentTime || 0,
            });
            console.log("Watch history saved");
        } catch (error) {
            console.error("Error saving watch history:", error);
        }
    };


    // const [viewUpdated, setViewUpdated] = useState(false);
    // const updateViews = async () => {
    //     try {
    //         await api.put(`/movies/${movieId}/updateViews`);
    //         console.log("Views updated");
    //     } catch (error) {
    //         console.error("Error updating views:", error);
    //     }
    // };


    // useEffect(() => {
        // const saveWatchHistory = async (e) => {
        //     e.preventDefault();
        //     try {
        //         await api.post(`/movies/saveWatchHistory`, {
        //             userId: userId,
        //             movieId: movieId,
        //             timeWatched: videoRef.current.currentTime || 1,
        //         });
        //         console.log("Watch history saved");
        //     } catch (error) {
        //         console.error("Error saving watch history:", error);
        //     }
    //     };

    //     window.addEventListener("beforeunload", saveWatchHistory);
    //     return () => {
    //         window.removeEventListener("beforeunload", saveWatchHistory);
    //     };
    // }, [ userId, movieId ]);
    // useEffect(() => {
    //     const saveWatchHistory = (e) => {
    //         // Dữ liệu cần gửi
    //         const data = {
    //             userId: userId,
    //             movieId: movieId,
    //             timeWatched: videoRef.current?.currentTime || 1,
    //         };
    
    //         // Gửi yêu cầu đồng bộ (navigator.sendBeacon)
    //         const url = `http://localhost:5001/api/movies/saveWatchHistory`;
    //         const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    
    //         navigator.sendBeacon(url, blob);
    
    //         console.log("Watch history saved with sendBeacon");
    
    //         e.preventDefault();
    //         e.returnValue = ""; // Hiển thị cảnh báo đóng trang (tùy chọn)
    //     };
    
    //     window.addEventListener("beforeunload", saveWatchHistory);
    
    //     return () => {
    //         window.removeEventListener("beforeunload", saveWatchHistory);
    //     };
    // }, [userId, movieId]);
    // useEffect(() => {
    //     const saveToLocalStorage = () => {
    //         const data = {
    //             userId: userId,
    //             movieId: movieId,
    //             timeWatched: videoRef.current?.currentTime || 1,
    //         };
    //         localStorage.setItem("unsavedWatchHistory", JSON.stringify(data));
    //     };
    
    //     window.addEventListener("beforeunload", saveToLocalStorage);
    
    //     return () => {
    //         window.removeEventListener("beforeunload", saveToLocalStorage);
    //     };
    // }, [userId, movieId]);
    // useEffect(() => {
    //     const handleBeforeUnload = () => {
    //         if (videoRef.current) {
    //             const currentTime = videoRef.current?.currentTime || 1;
    //             navigator.sendBeacon('http://localhost:5001/api/movies/saveWatchHistory', {
    //                 userId: userId,
    //                 movieId: movieId,
    //                 timeWatched: currentTime,
    //             });
    //         }
    //     };

    //     window.addEventListener('beforeunload', handleBeforeUnload);

    //     return () => {
    //         window.removeEventListener('beforeunload', handleBeforeUnload);
    //     };
    // }, [movieId, userId]);

    // Kiểm tra history và nếu có thì chuyển đến thời gian đã xem
    useEffect(() => {
        const historyData = history.find((item) => item.movieId === movieId);
        if (historyData) {
            if (window.confirm(`Bạn đã xem đến ${formatTime(historyData.timeWatched)}. Bạn có muốn tiếp tục xem không?`)) {
                videoRef.current.currentTime = historyData.timeWatched;
            }
        }
    }, [history, movieId]);
    
    


    
    
    return (
        <div className="player-container show-controls" ref={playerContainerRef}>
            <div className="player-wrapper">
                <div className="player-timeline-bar d-flex align-items-center ms-3 me-3">
                    <div className="player-timer text-white d-flex align-items-center me-2">
                        <p className="current-time">{formatTime(currentTime)}</p>
                        <p className="separator "> / </p>
                        <p className="player-duration">{formatTime(duration)}</p>
                    </div>
                    <div className="player-timeline d-flex align-items-center justify-content-center" ref={timelineRef}>
                        <div
                            className="progress-area rounded text-white"
                            onMouseMove={handleTimelineMouseMove}
                            onClick={handleTimelineClick}
                            onMouseDown={handleTimelineMouseDown}
                        >
                            <span>{formatTime(currentTime)}</span>
                            <div className="progress-bar-player" ref={progressBarRef}></div>
                        </div>
                    </div>

                </div>

                <ul className="player-controls d-flex align-items-center justify-content-between">
                    <li className="player-options options-left d-flex align-items-center justify-content-left">
                        <button className="play-pause" onClick={handlePlayPause}>
                            <i className={`fas ${isPlaying ? "fa-pause" : "fa-play"}`}></i>
                        </button>

                        <button className="skip-backward" onClick={() => handleSkip('backward')}>
                            <i className="fa-solid fa-arrow-rotate-left"></i>
                        </button>
                        <button className="skip-forward" onClick={() => handleSkip('forward')}>
                            <i className="fa-solid fa-arrow-rotate-right"></i>
                        </button>

                        <div className="volume-box d-flex align-items-center">
                            <button className="volume" onClick={handleClickVolumeBtn}>
                                <i
                                    className={`volume-icon fa-solid ${
                                    volume === 0
                                        ? "fa-volume-xmark"
                                        : volume <= 0.4
                                        ? "fa-volume-low"
                                        : "fa-volume-high"
                                    }`}
                                ></i>
                            </button>
                            <input
                                type="range"
                                className="custom-range"
                                min="0"
                                max="1"
                                step="any"
                                value={volume}
                                onChange={handleVolumeChange}
                                ref={volumeSliderRef}
                            />                    
                        </div>

                    </li>

                    <li className="player-options options-right d-flex align-items-center justify-content-right">
                        <div className="playback-content">
                            <button className="playback-report" onClick={callOpenReportModal}>
                                <i className="fa-solid fa-flag"></i>
                            </button>
                    
                            {/* <button className="playback-perform" onClick={() => handlePlaybackMenuToggle("perform")}>
                                <i className="fa-solid fa-sliders"></i>
                            </button>
                            <ul className={`perform-options ${openMenu === "perform" ? "show" : ""} shadow bg-black text-white`}>
                                {[1080, 720, 480, 360, 240, 144].map((perform) => (
                                    <li
                                        key={perform}
                                        data-perform={perform}
                                        className={`perform-option ${currentPerform === perform ? "active" : ""}`}
                                        onClick={() => handlePerformChange(perform)}
                                    >
                                        {perform}p
                                    </li>
                                ))}
                            </ul> */}
                            {/* <button className="playback-speed" onClick={() => handlePlaybackMenuToggle("speed")}>
                                <span className="material-symbols-rounded">slow_motion_video</span>
                            </button>
                            <ul className={`speed-options ${openMenu === "speed" ? "show" : ""} shadow bg-black text-white`}>
                                {["2", "1.5", "1", "0.75", "0.5"].map((speed) => (
                                    <li
                                        key={speed}
                                        data-speed={speed}
                                        className={`speed-option ${currentSpeed === parseFloat(speed) ? "active" : ""}`}
                                        onClick={() => handleSpeedChange(speed)}
                                    >
                                        {speed}x
                                    </li>
                                ))}
                            </ul> */}

                        </div>
                        <button className="pic-in-pic-btn" onClick={handlePicInPic}>
                            <span className="material-icons">picture_in_picture_alt</span>
                        </button>
                        <button className="fullscreen-btn" onClick={handleFullscreen}>
                            <i className={`fa-solid ${isFullscreen ? "fa-compress" : "fa-expand"} `}></i>
                        </button>
                    </li>
                </ul>
            </div>
            <div className="video-container position-relative">
                <video
                    ref={videoRef}
                    // src="demo-video.mp4"
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedData={handleLoadedData}
                >
                    <source
                        // src="demo-video.mp4"
                        // src={`https://d3os4gr4tudec8.cloudfront.net/movies/Parasite/movie`}
                        src={`https://d3os4gr4tudec8.cloudfront.net/movies/${movieSource}/movie`}
                        type="video/mp4"
                    />
                </video>
                {isBuffering && (
                    <div className="spinner-overlay">
                        <div className="spinner-border custom-spinner text-light" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Player;