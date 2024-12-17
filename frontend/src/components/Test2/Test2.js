import React, { useEffect, useState } from "react";
import "./Test2.css";
import api from "../../api/api";

const Test2 = () => {
  const [movies, setMovies] = useState([]);
  const [mDuration, setMDuration] = useState(0);

  const [msg, setMsg] = useState("");
  const [apiStatus, setApiStatus] = useState("");

  const [mIndex, setMIndex] = useState(0);
  const [isEditting, setIsEditting] = useState(false);

  useEffect(() => {
    const getMovieList = async () => {
      try {
        const response = await api.get("/movies/getMovieList");
        setMovies(response.data);
        setApiStatus(response.data?.message || "No status available");
      } catch (error) {
        console.error("Error fetching movies:", error);
        setMsg("Error fetching movies");
      }
    }
    getMovieList();
  }, []);

  // const updateDuration = async (id, duration) => {
  //   try {
  //     const response = await api.put("/movies/updateDuration", { 
  //       movieId: id,
  //       movieDuration: duration,
  //     });
  //     setMsg(`Duration updated`);
  //   } catch (error) {
  //     console.error("Error updating movie duration:", error);
  //     setMsg("Error updating duration");
  //   }
  // };  

  // const onChangeInput = (e) => {
  //   const video = e.target.files[0];
  //   if (!video) {
  //     setMsg("No video selected");
  //     setMDuration(0);
  //     return;
  //   }    

  //   const videoUrl = URL.createObjectURL(video);
  //   const videoPlayer = document.createElement("video");

  //   videoPlayer.src = videoUrl;
  //   videoPlayer.addEventListener("loadedmetadata", () => {
  //     setMDuration(videoPlayer.duration);
  //     updateDuration(movies[mIndex]?._id, videoPlayer.duration);

  //     setMovies((prev) =>
  //       prev.map((movie, index) =>
  //         index === mIndex ? { ...movie, duration: videoPlayer.duration } : movie
  //       )
  //     );
  //     handleNext();

  //     URL.revokeObjectURL(videoUrl);
  //     setIsEditting(false);
  //   });

  //   videoPlayer.onerror = () => {
  //     setMsg("Error loading video");
  //   }
  // }

  // const handleNext = () => {

  //   setMIndex((prevIndex) => (prevIndex + 1) % movies.length);
  //   setMDuration(0);
  //   setMsg('');
    
  // }

  useEffect(() => {
    if (isEditting === false) {
      if (movies[mIndex]?.duration > 0 && mIndex < movies.length - 1) {
        handleNext();
      }
    }
  }, [isEditting, movies, mIndex]);  

  // const handleEdit = (ind) => {
  //   setIsEditting(true);
  //   setMIndex(ind);
  // }



  const [colors, setColors] = useState({}); // Lưu trữ màu cho từng duration

  useEffect(() => {
    const getMovieList = async () => {
      try {
        const response = await api.get("/movies/getMovieList");
        setMovies(response.data);
        setApiStatus(response.data?.message || "No status available");
        assignColors(response.data); // Gán màu ban đầu
      } catch (error) {
        console.error("Error fetching movies:", error);
        setMsg("Error fetching movies");
      }
    };
    getMovieList();
  }, []);

  const assignColors = (movies) => {
    // Đếm số lần xuất hiện của mỗi duration
    const durationCount = {};
    movies.forEach((movie) => {
      durationCount[movie.duration] = (durationCount[movie.duration] || 0) + 1;
    });

    // Gán màu cho các duration trùng lặp
    const colorMap = {};
    Object.keys(durationCount).forEach((duration) => {
      if (durationCount[duration] > 1) {
        colorMap[duration] = getRandomColor();
      }
    });
    setColors(colorMap);
  };

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const updateDuration = async (id, duration) => {
    try {
      const response = await api.put("/movies/updateDuration", {
        movieId: id,
        movieDuration: duration,
      });
      setMsg(`Duration updated`);
    } catch (error) {
      console.error("Error updating movie duration:", error);
      setMsg("Error updating duration");
    }
  };

  // const onChangeInput = (e) => {
  //   const video = e.target.files[0];
  //   if (!video) {
  //     setMsg("No video selected");
  //     setMDuration(0);
  //     return;
  //   }
  
  //   const videoUrl = URL.createObjectURL(video);
  //   const videoPlayer = document.createElement("video");
  
  //   videoPlayer.src = videoUrl;
  //   videoPlayer.addEventListener("loadedmetadata", () => {
  //     setMDuration(videoPlayer.duration);
  //     updateDuration(movies[mIndex]?._id, videoPlayer.duration);
  
  //     setMovies((prev) => {
  //       const updatedMovies = prev.map((movie, index) =>
  //         index === mIndex ? { ...movie, duration: videoPlayer.duration } : movie
  //       );
  
  //       assignColors(updatedMovies); // Gán lại màu sau khi cập nhật
  //       return updatedMovies;
  //     });
  
  //     URL.revokeObjectURL(videoUrl);
  //     setIsEditting(false);
  //   });
  
  //   videoPlayer.onerror = () => {
  //     setMsg("Error loading video");
  //   };
  // };
  

  // const handleNext = () => {
  //   setMIndex((prevIndex) => (prevIndex + 1) % movies.length);
  //   setMDuration(0);
  //   setMsg("");
  // };

  useEffect(() => {
    if (!isEditting && movies[mIndex]?.duration > 0 && mIndex < movies.length - 1) {
      handleNext();
    }
  }, [isEditting, movies, mIndex]);

  const handleEdit = (ind) => {
    setIsEditting(true);
    setMIndex(ind);
  };

  const [autoNext, setAutoNext] = useState(false); // Thêm cờ để kiểm soát

  const handleNext = () => {
    if (!autoNext) return; // Chỉ chuyển tiếp khi autoNext được bật
    setMIndex((prevIndex) => (prevIndex + 1) % movies.length);
    setMDuration(0);
    setMsg("");
  };
  

  useEffect(() => {
    if (autoNext && !isEditting && movies[mIndex]?.duration > 0 && mIndex < movies.length - 1) {
      handleNext();
    }
  }, [autoNext, isEditting, movies, mIndex]);
  

  const [fileName, setFileName] = useState("");

  const onChangeInput = (e) => {
    const video = e.target.files[0];
    if (!video) {
      setMsg("No video selected");
      setFileName("");
      setMDuration(0);
      return;
    }
  
    setFileName(video.name);
  
    const videoUrl = URL.createObjectURL(video);
    const videoPlayer = document.createElement("video");
  
    videoPlayer.src = videoUrl;
    videoPlayer.addEventListener("loadedmetadata", () => {
      setMDuration(videoPlayer.duration);
      updateDuration(movies[mIndex]?._id, videoPlayer.duration);
  
      setMovies((prev) => {
        const updatedMovies = prev.map((movie, index) =>
          index === mIndex ? { ...movie, duration: videoPlayer.duration } : movie
        );
  
        assignColors(updatedMovies);
        return updatedMovies;
      });
  
      URL.revokeObjectURL(videoUrl);
      setIsEditting(false); // Kết thúc chỉnh sửa
    });
  
    videoPlayer.onerror = () => {
      setMsg("Error loading video");
    };
  };
  
  





//   return (
//     <div className="container test-container">
//         <div key={movies[mIndex]?._id}>
//           <h3>{movies[mIndex]?.subTitle} - {movies[mIndex]?.mainTitle}</h3>
//           <p>{mIndex}: {movies[mIndex]?._id }</p>
//           <input
//             className="form-control mb-3"
//             type="file" 
//             accept="video/*" 
//             onChange={onChangeInput}

//           />
//           <p className="m-0">Duration: {mDuration}</p>
//           <p className="m-0">Status: {msg}</p>
//           <p>API Status: {apiStatus}</p>

//           <button
//             className={`btn btn-primary ${(movies.length > 0 && mIndex < movies.length - 1) && mDuration > 0 ? "" : "disabled"}`}
//             onClick={() => handleNext()}
//           >
//             Next
//           </button>
//         </div>

//         <div className="mt-3">
//           <h3>Movie List</h3>
//           <ul>
//             {movies.map((movie, index) => (
//               <li key={movie._id} color={``}>
//                 Index {index}: {movie.mainTitle} <br /> - Dur: {movie.duration} <br /> - {movie._id}
//                 <br />
//                 <button className="btn btn-primary" onClick={() => handleEdit(index)}>
//                   Edit
//                 </button>
//               </li>
//             ))}
//           </ul>
//         </div>


//     </div>
//   );
// };
return (
  <div className="container test-container">
    <div key={movies[mIndex]?._id}>
      <h3>
        {movies[mIndex]?.subTitle} - {movies[mIndex]?.mainTitle}
      </h3>
      <p className="m-0">Selected File: {fileName || "No file selected"}</p>
      <p>
        {mIndex}: {movies[mIndex]?._id}
      </p>
      <input
        className="form-control mb-3"
        type="file"
        accept="video/*"
        onChange={onChangeInput}
      />
      <p className="m-0">Duration: {mDuration}</p>
      <p className="m-0">Status: {msg}</p>
      <p>API Status: {apiStatus}</p>

      <div className="d-flex justify-content-between">

        <button
          className={`btn btn-primary ${
            movies.length > 0 && mIndex < movies.length - 1 && mDuration > 0
              ? ""
              : "disabled"
          }`}
          onClick={handleNext}
        >
          Next
        </button>

        <button
          className="btn btn-secondary"
          onClick={() => setAutoNext((prev) => !prev)}
        >
          {autoNext ? "Disable Auto Next" : "Enable Auto Next"}
        </button>
      </div>

    </div>

    <div className="mt-3">
      <h3>Movie List</h3>
      <ul>
        {movies.map((movie, index) => (
          <li
            key={movie._id}
            style={{ backgroundColor: colors[movie.duration] }}
          >
            Index {index}: {movie.mainTitle} <br /> - Dur: {movie.duration}{" "}
            <br /> - {movie._id}
            <br />
            <button
              className="btn btn-primary"
              onClick={() => handleEdit(index)}
            >
              Edit
            </button>
          </li>
        ))}
      </ul>
    </div>
  </div>
);
};

export default Test2;
