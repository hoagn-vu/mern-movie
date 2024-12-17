import React from 'react';
import './Pagination.css';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const renderPageNumbers = () => {
        const pages = [];
        if (totalPages <= 4) {
            // Nếu tổng số trang nhỏ hơn hoặc bằng 4, hiển thị toàn bộ các trang
            for (let i = 1; i <= totalPages; i++) {
              pages.push(
                <button
                  key={i}
                  className={`btn ${i === currentPage ? 'btn-primary' : 'btn-light'}`}
                  onClick={() => onPageChange(i)}
                >
                  {i}
                </button>
              );
            }
          } else {
    
        if (currentPage <= 3) {
        // Hiển thị thêm trang 4 khi ở vị trí 3
        for (let i = 1; i <= Math.min(currentPage === 3 ? 4 : 3, totalPages); i++) {
            pages.push(
            <button
                key={i}
                className={`btn ${i === currentPage ? 'btn-primary' : 'btn-light'}`}
                onClick={() => onPageChange(i)}
            >
                {i}
            </button>
            );
        }
        if (totalPages > 5) pages.push(<span key="dots-right">...</span>);
        if (totalPages > 4) {
            pages.push(
            <button
                key={totalPages - 1}
                className="btn btn-light"
                onClick={() => onPageChange(totalPages - 1)}
            >
                {totalPages - 1}
            </button>
            );
        }
        pages.push(
            <button
            key={totalPages}
            className="btn btn-light"
            onClick={() => onPageChange(totalPages)}
            >
            {totalPages}
            </button>
        );
        } else if (currentPage >= totalPages - 2) {
        // Hiển thị thêm trang 12 khi ở vị trí 13
        pages.push(
            <button key={1} className="btn btn-light" onClick={() => onPageChange(1)}>
            1
            </button>
        );
        if (totalPages > 5) pages.push(<span key="dots-left">...</span>);
        for (
            let i = Math.max(totalPages - (currentPage === 13 ? 3 : 2), 1);
            i <= totalPages;
            i++
        ) {
            pages.push(
            <button
                key={i}
                className={`btn ${i === currentPage ? 'btn-primary' : 'btn-light'}`}
                onClick={() => onPageChange(i)}
            >
                {i}
            </button>
            );
        }
        } else {
        // Các trang giữa
        pages.push(
            <button key={1} className="btn btn-light" onClick={() => onPageChange(1)}>
                1
            </button>
        );
        pages.push(<span key="dots-left">...</span>);
        for (
            let i = currentPage === 3
            ? currentPage
            : currentPage === 13
            ? currentPage - 1
            : currentPage - 1;
            i <= (currentPage === 3 || currentPage === 13 ? currentPage + 1 : currentPage + 1);
            i++
        ) {
            pages.push(
            <button
                key={i}
                className={`btn ${i === currentPage ? 'btn-primary' : 'btn-light'}`}
                onClick={() => onPageChange(i)}
            >
                {i}
            </button>
            );
        }
        pages.push(<span key="dots-right">...</span>);
        pages.push(
            <button
            key={totalPages}
            className="btn btn-light"
            onClick={() => onPageChange(totalPages)}
            >
            {totalPages}
            </button>
        );
        }
        }
    
        return pages;
    };

    return (
        <div className="pagination d-flex justify-content-between align-items-center mt-auto mb-2">
            <button
                className="btn btn-light"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                <i class="fa-solid fa-angle-left"></i>
            </button>
            {renderPageNumbers()}
            <button
                className="btn btn-light"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                <i class="fa-solid fa-angle-right"></i>
            </button>
        </div>
    );
};

export default Pagination;
