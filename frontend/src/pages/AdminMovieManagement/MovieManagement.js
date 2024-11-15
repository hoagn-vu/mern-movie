import React, { useState } from 'react';
import './MovieManagement.css';
import UploadForm from '../UploadForm/UploadForm';

const MovieManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isAddingMovie, setIsAddingMovie] = useState(false);

  const movies = [
    { id: 1, title: 'Movie 1', year: 2022, uploadDate: '2024-01-10', image: 'movie1.jpg', isVisible: true },
    { id: 2, title: 'Movie 2', year: 2023, uploadDate: '2024-02-11', image: 'movie2.jpg', isVisible: false },
    { id: 3, title: 'Movie 1', year: 2022, uploadDate: '2024-01-10', image: 'movie1.jpg', isVisible: true },
    { id: 4, title: 'Movie 1', year: 2022, uploadDate: '2024-01-10', image: 'movie1.jpg', isVisible: true },
    { id: 5, title: 'Movie 1', year: 2022, uploadDate: '2024-01-10', image: 'movie1.jpg', isVisible: true },
    { id: 6, title: 'Movie 1', year: 2022, uploadDate: '2024-01-10', image: 'movie1.jpg', isVisible: true },
    { id: 7, title: 'Movie 1', year: 2022, uploadDate: '2024-01-10', image: 'movie1.jpg', isVisible: true },
    { id: 8, title: 'Movie 1', year: 2022, uploadDate: '2024-01-10', image: 'movie1.jpg', isVisible: true },
    { id: 9, title: 'Movie 1', year: 2022, uploadDate: '2024-01-10', image: 'movie1.jpg', isVisible: true },
    { id: 10, title: 'Movie 1', year: 2022, uploadDate: '2024-01-10', image: 'movie1.jpg', isVisible: true },
    { id: 11, title: 'Movie 1', year: 2022, uploadDate: '2024-01-10', image: 'movie1.jpg', isVisible: true },
    { id: 12, title: 'Movie 1', year: 2022, uploadDate: '2024-01-10', image: 'movie1.jpg', isVisible: true },
    { id: 13, title: 'Movie 1', year: 2022, uploadDate: '2024-01-10', image: 'movie1.jpg', isVisible: true },
    { id: 14, title: 'Movie 1', year: 2022, uploadDate: '2024-01-10', image: 'movie1.jpg', isVisible: true },

    // Add more movies here (giả lập danh sách phim)
  ];

  const moviesPerPage = 10;
  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = movies.slice(indexOfFirstMovie, indexOfLastMovie);

  const totalPages = Math.ceil(movies.length / moviesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const toggleModal = (movie = null) => {
    setSelectedMovie(movie);
    setIsModalOpen(!isModalOpen);
  };

  const handleAddMovie = () => {
    setIsAddingMovie(!isAddingMovie);
  };

  const toggleDeleteConfirm = () => {
    setIsDeleteConfirmOpen(!isDeleteConfirmOpen);
  };

  return (
    <div className="container-fluid p-4">
      { !isAddingMovie ? (
        <div>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2>Movie Management</h2>
            <button className="btn btn-primary" onClick={() => handleAddMovie()}>Add Movie</button>
          </div>
  
          {/* Bảng danh sách phim */}
          <div className='table-responsive'>
            <table className="table table-hover tabble-bordered rounded">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Year</th>
                  <th>Upload Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className='align-middle'>
                {currentMovies.map((movie, index) => (
                  <tr key={movie.id}>
                    <td>{indexOfFirstMovie + index + 1}</td>
                    <td><img src={movie.image} alt={movie.title} className="movie-img" /></td>
                    <td>{movie.title}</td>
                    <td>{movie.year}</td>
                    <td>{movie.uploadDate}</td>
                    <td>
                      <div className="form-check form-switch">
                        <input 
                          className="form-check-input" 
                          type="checkbox" 
                          checked={movie.isVisible} 
                          onChange={() => {}} 
                        />
                        <label className="form-check-label">{movie.isVisible ? 'Visible' : 'Hidden'}</label>
                      </div>
                    </td>
                    <td>
                      <button className="btn btn-warning me-2" onClick={() => toggleModal(movie)}>Edit</button>
                      <button className="btn btn-danger" onClick={toggleDeleteConfirm}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
  
          {/* Pagination */}
          <nav aria-label="Page navigation bg-primary">
            <ul className="pagination justify-content-center">
              {[...Array(totalPages)].map((_, pageIndex) => (
                <li key={pageIndex} className={`page-item ${currentPage === pageIndex + 1 ? 'active' : ''}`}>
                  <button className="page-link custom-focus" onClick={() => handlePageChange(pageIndex + 1)}>
                    {pageIndex + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
  
          {/* Modal Thêm/Chỉnh sửa phim */}
          {isModalOpen && (
            <div className="modal d-block" onClick={() => toggleModal(null)}>
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">{selectedMovie ? 'Edit Movie' : 'Add Movie'}</h5>
                    <button className="close" onClick={() => toggleModal(null)}>&times;</button>
                  </div>
                  <div className="modal-body">
                    {/* Form thêm/chỉnh sửa phim */}
                    <form>
                      <div className="mb-3">
                        <label htmlFor="title" className="form-label">Title</label>
                        <input type="text" className="form-control" id="title" defaultValue={selectedMovie?.title || ''} />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="year" className="form-label">Year</label>
                        <input type="number" className="form-control" id="year" defaultValue={selectedMovie?.year || ''} />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="image" className="form-label">Image URL</label>
                        <input type="text" className="form-control" id="image" defaultValue={selectedMovie?.image || ''} />
                      </div>
                    </form>
                  </div>
                  <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={() => toggleModal(null)}>Close</button>
                    <button className="btn btn-primary">{selectedMovie ? 'Save Changes' : 'Add Movie'}</button>
                  </div>
                </div>
              </div>
            </div>
          )}
  
          {/* Modal confirm delete */}
          {isDeleteConfirmOpen && (
            <div className="modal d-block" onClick={toggleDeleteConfirm}>
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Delete Movie</h5>
                    <button className="close" onClick={toggleDeleteConfirm}>&times;</button>
                  </div>
                  <div className="modal-body">
                    Are you sure you want to delete this movie?
                  </div>
                  <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={toggleDeleteConfirm}>Cancel</button>
                    <button className="btn btn-danger">Delete</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div>
          <a className='back-button' onClick={() => handleAddMovie()}><i className="fas fa-angle-left"></i> Quay lại...</a>
          <UploadForm />
        </div>
      )}
    </div>
  );
};

export default MovieManagement;
