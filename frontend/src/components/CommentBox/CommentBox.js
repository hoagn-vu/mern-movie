import React, { useState, useEffect } from "react";
import api from "../../api/api";
import "./CommentBox.css";
import Select from 'react-select';

const CommentBox = ({ userData, movieId, comments: initialComments }) => {
    const [commentList, setCommentList] = useState(initialComments || []);

    const sortOptions = [
        { value: "latest", label: "Mới nhất" },
        { value: "oldest", label: "Cũ nhất" },
    ];

    useEffect(() => {
        setCommentList(initialComments || []);
    }, [initialComments]);

    const [currentPage, setCurrentPage] = useState(1);
    const [sortOrder, setSortOrder] = useState("latest");
    const commentsPerPage = 5;

    const flatComments = commentList.flatMap((userComment) =>
        userComment.comment.map((com) => ({
        userId: userComment.userId,
        fullname: userComment.fullname,
        avatar: userComment.avatar,
        role: userComment.role,
        cmtId: com._id,
        content: com.content,
        createAt: new Date(com.createAt),
        }))
    );

    const sortedComments = [...flatComments].sort((a, b) =>
        sortOrder === "latest" ? b.createAt - a.createAt : a.createAt - b.createAt
    );

    const indexOfLastComment = currentPage * commentsPerPage;
    const indexOfFirstComment = indexOfLastComment - commentsPerPage;
    const currentComments = sortedComments.slice(indexOfFirstComment, indexOfLastComment);

    const onChangeOrder = (selectedOption) => {
        setSortOrder(selectedOption.value); // selectedOption chứa { value, label }
        setCurrentPage(1);
    };  

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const [commentSent, setCommentSent] = useState("");

    const handleComment = async (e) => {
        if (e.key === "Enter") {
        try {
            const newComment = {
            userId: userData._id,
            content: commentSent,
            createAt: new Date(), // Tạo ngày gửi ngay lập tức
            };

            const reponse = await api.post(`/movies/${movieId}/comment`, newComment);
            const newCmt = reponse.data.newComment; 

            // alert("Comment sent");
            // setCommentList((prev) => [
            //   ...prev,
            //   { cmtId: newCmt._id , userId: userData._id, fullname: userData.fullname, role: userData.role, avatar: userData.avatar ,content: newCmt.content, createAt: new Date(newCmt.createAt) },
            // ]); // Cập nhật danh sách bình luận
            // Cập nhật danh sách bình luận
            setCommentList((prev) => {
            const newCommentList = [...prev];
            const userIndex = newCommentList.findIndex((user) => user.userId === userData._id);
            if (userIndex === -1) {
                newCommentList.push({
                userId: userData._id,
                fullname: userData.fullname,
                role: userData.role,
                avatar: userData.avatar,
                comment: [newCmt],
                });
            } else {
                newCommentList[userIndex].comment.push(newCmt);
            }
            return newCommentList;
            });

            setCommentSent("");
        } catch (error) {
            console.error("Error sending comment:", error);
        }
        }
    };

    const handleDeleteComment = async (userId, cmtId) => {
        if (!window.confirm("Xác nhận xóa bình luận này?")) {
        return;
        }

        try {
        await api.delete(`/movies/${movieId}/delete-comment/${userId}/${cmtId}`);
        setCommentList((prev) => {
            const newCommentList = [...prev];
            const userIndex = newCommentList.findIndex((user) => user.userId === userId);
            newCommentList[userIndex].comment = newCommentList[userIndex].comment.filter((cmt) => cmt._id !== cmtId);
            return newCommentList;
        });
        } catch (error) {
        console.error("Error deleting comment:", error);
        }
    }

    return (
        <div className="container comment-box-container mt-5 text-white">
        <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">Bình luận ({flatComments.length})</h5>
            <div className="d-flex  align-items-center comment-sort-box">
            <span className="me-2">Sắp xếp theo:</span>
            <Select 
                options={sortOptions} 
                components={{
                    IndicatorSeparator: () => null,
                }}
                classNamePrefix="react-select"
                className='search-select'
                defaultValue={sortOptions[0]}
                onChange={onChangeOrder}
                value={sortOptions.find((option) => option.value === sortOrder)} // Truyền đúng giá trị
            />
            </div>


            {/* <select
            className="form-select w-auto bg-dark text-white border-0"
            onChange={onChangeOrder}
            value={sortOrder}
            >
            <option value="latest">Mới nhất</option>
            <option value="oldest">Cũ nhất</option>
            </select> */}
        </div>

        <div className="d-flex align-items-center mb-3">
            <img
            src={`${userData.avatar}`}
            alt="avatar"
            className="rounded-circle me-2"
            width="50"
            height="50"
            />
            <input
            type="text"
            className="form-control bg-dark text-white border-0 comment-input"
            placeholder="Nhập bình luận..."
            value={commentSent}
            onChange={(e) => setCommentSent(e.target.value)}
            onKeyDown={handleComment}
            />
        </div>
        {currentComments.length > 0 && (
            <div className="bg-dark p-3 pb-0 rounded">
            {currentComments.map((com, index) => (
                <div key={index} className="d-flex align-items-center mb-3">
                <img
                    src={`${com.avatar}`}
                    alt="avatar"
                    className="rounded-circle me-2"
                    width="50"
                    height="50"
                />
                <div>
                    <strong>
                    {com.role === 'admin' ? (
                        <div className="d-flex align-items-center">
                        Quản trị viên <i className="fa-solid fa-user-shield admin-icon-comment ms-2"></i>
                        </div>
                    ) : (
                        com.fullname
                    )}
                    </strong>
                    <p className="mb-0">{com.content}</p>
                </div>
                
                {userData.role === 'admin' && (
                    <div className="dropstart ms-auto">
                    <a className="dropdown-toggle ps-1 pe-1 text-light text-decoration-none" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <i className="fa-solid fa-ellipsis-vertical" ></i>
                    </a>
                    <ul className="dropdown-menu dropdown-menu-end">
                        <li>
                        <a className="dropdown-item delete-comment" onClick={() => handleDeleteComment(com.userId, com.cmtId)}>Xóa bình luận</a>
                        </li>
                    </ul>
                    </div>
                )}

                </div>
            ))}

            <nav>
                <ul className="pagination justify-content-center pb-2">
                {Array(Math.ceil(flatComments.length / commentsPerPage))
                    .fill()
                    .map((_, index) => (
                    <li
                        key={index}
                        className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
                    >
                        <button onClick={() => paginate(index + 1)} className="page-link">
                        {index + 1}
                        </button>
                    </li>
                    ))}
                </ul>
            </nav>
            </div>
        )}

        </div>
    );
};

export default CommentBox;
