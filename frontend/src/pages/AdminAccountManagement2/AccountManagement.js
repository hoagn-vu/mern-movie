import React, { useState, useEffect } from 'react';
import './AccountManagement.css';
import api from '../../api/api';
import Pagination from '../../components/Pagination/Pagination';

const AccountManagement = ({ accounts, setAccounts, originalAccounts, setOriginalAccounts, getAccounts }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [idToDelete, setIdToDelete] = useState("");
    const [formData, setFormData] = useState({
        username: "",
        fullname: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "User",
    });
    const [errorMessage, setErrorMessage] = useState('');

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrorMessage('');
    };

    const validateForm = () => {
        const { username, role, fullname, email, password, confirmPassword, _id } = formData;
    
        // Kiểm tra các trường bắt buộc (trừ password khi chỉnh sửa)
        if (!username || !fullname || !email || !role || username.trim() === "" || fullname.trim() === "" || role.trim() === "" || username.length < 6) {
            return false;
        }
    
        // Khi tạo tài khoản mới (_id không tồn tại), password và confirmPassword là bắt buộc
        if (!_id && (!password || !confirmPassword)) {
            return false;
        }
    
        // Nếu nhập password, confirmPassword phải khớp
        if (password && password.length < 6 && password !== confirmPassword) {
            return false;
        }
    
        return true;
    };
    
    
    let response;
    const handleSave = async () => {
        if (!validateForm()) {
        alert("Vui lòng đảm bảo điền đầy đủ thông tin và tên tài khoản cũng như mật khẩu ít nhất 6 ký tự.");
        return;
        }
    
        try {
            const { _id, confirmPassword, ...data } = formData;
        
            if (_id && !formData.password) {
                delete data.password;
            }

            console.log('Data to save:', data);
        
            if (_id) {
                if (window.confirm("Xác nhận cập nhật tài khoản?")) {
                    response = await api.put(`/account/update/${_id}`, data);
                }
            } else {
                response = await api.post("/account/create", data);
            }
        
            setIsModalOpen(false);
            getAccounts();
            setFormData({ username: "", fullname: "", email: "", password: "", confirmPassword: "", role: "User" });
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Xảy ra lỗi khi thao tác với tài khoản";
            setErrorMessage(errorMessage);
            console.error("Lỗi khi tạo tài khoản", error);
        }
    };
    

    const handleEdit = (account) => {
        setFormData({ ...account });
        setIsModalOpen(true);
    };

    const handleDelete = async (username, idToDelete) => {
        if (window.confirm(`Xác nhận xóa tài khoản ${username}?`)) {
            try {
                await api.delete(`/account/delete/${idToDelete}`);
                setAccounts(accounts.filter((account) => account._id !== idToDelete));
            } catch (error) {
                console.error("Error deleting account:", error);
            }
        }
    };

    const changeStatus = async (id, status) => {
        if (window.confirm(`Xác nhận ${status==="locked" ? "tạm khóa" : "mở khóa"} tài khoản?`)) {
            try {
                await api.put(`/account/update/${id}`, { status });
                // getAccounts();
                setAccounts(accounts.map((account) => (account._id === id ? { ...account, status: status } : account)));
                setOriginalAccounts(accounts.map((account) => (account._id === id ? { ...account, status: status } : account)));
            } catch (error) {
                console.error("Error changing status:", error);
            }
        }
    };

    useEffect(() => {
        if (isModalOpen === false) {
            setFormData({ username: "", fullname: "", password: "", confirmPassword: "", role: "User" });
        }
    }, [isModalOpen]);



    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const getCurrentPageData = (data) => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return data.slice(startIndex, endIndex);
    };

    const currentData = getCurrentPageData(accounts);
    const totalPages = Math.ceil(accounts.length / itemsPerPage);



    const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
        direction = 'desc';
        }
        setSortConfig({ key, direction });
    
        const sortedAccounts = [...accounts].sort((a, b) => {
        if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
        if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
        return 0;
        });
        setAccounts(sortedAccounts);
    };

    const clearSortConfig = () => {
        setSortConfig({ key: '', direction: '' });
        setAccounts(originalAccounts);
        setSearchTerm('');
    };

    const [searchTerm, setSearchTerm] = useState('');
    const handleChangeSearch = (event) => {
        const keyword = event.target.value.toLowerCase();
        setSearchTerm(keyword);
    
        if (keyword === '') {
        // Hiển thị tất cả phim nếu không có từ khóa
        setAccounts(originalAccounts);
        } else {
        // Lọc phim dựa trên từ khóa
        const filteredAccounts = originalAccounts.filter((acc) =>
            acc.username?.toLowerCase().includes(keyword) || acc.fullname?.toLowerCase().includes(keyword) || acc.email?.toLowerCase().includes(keyword)
        );
        setAccounts(filteredAccounts);
        }
    };

    return (
        <div className="container-fluid account-management-container p-4">
            <div className="account-management-header pb-2 d-flex justify-content-between align-items-center mb-3">
                <h2 className='m-0'>Quản lý tài khoản</h2>

                <div className='right-header d-flex align-items-center'>
                    { sortConfig.key !== '' || searchTerm !== '' ? (
                        <button className='btn btn-outline-primary clear-filter-btn me-2' onClick={clearSortConfig}><i class="fa-solid fa-filter-circle-xmark"></i></button>
                    ) : null }

                    <div className="search-box me-2 rounded d-flex align-items-center">
                        <i class="search-icon me-2 fa-solid fa-magnifying-glass"></i>
                        <input
                            type="text"
                            className="search-input w-100"
                            placeholder="Tìm kiếm tài khoản..."
                            value={searchTerm}
                            onChange={handleChangeSearch}
                        />
                    </div>


                    <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                        <i class="fa-solid fa-user-plus me-2"></i>Cấp tài khoản
                    </button>
                </div>
            </div>

            <div className='table-responsive'>
                <table className="table table-hover tabble-bordered rounded">
                    <thead className="table-light">
                        <tr>
                            <th className='index-table-accounts text-center'>#</th>
                            <th className="sort-header title-col-table-movies" onClick={() => handleSort('username')}>
                                Tên tài khoản
                                <i className={`fa-solid fa-sort ${
                                    sortConfig.key === 'username' 
                                        ? sortConfig.direction === 'asc'
                                        ? 'half-top' 
                                        : 'half-bottom'
                                        : ''
                                    } ms-2`} 
                                />
                            </th>
                            <th className="sort-header title-col-table-movies" onClick={() => handleSort('fullname')}>
                                Họ tên
                                <i className={`fa-solid fa-sort ${
                                    sortConfig.key === 'fullname' 
                                        ? sortConfig.direction === 'asc'
                                        ? 'half-top' 
                                        : 'half-bottom'
                                        : ''
                                    } ms-2`} 
                                />
                            </th>
                            <th className="sort-header title-col-table-movies" onClick={() => handleSort('email')}>
                                Email
                                <i className={`fa-solid fa-sort ${
                                    sortConfig.key === 'email' 
                                        ? sortConfig.direction === 'asc'
                                        ? 'half-top' 
                                        : 'half-bottom'
                                        : ''
                                    } ms-2`} 
                                />
                            </th>
                            <th className="sort-header title-col-table-movies" onClick={() => handleSort('role')}>
                                Vai trò
                                <i className={`fa-solid fa-sort ${
                                    sortConfig.key === 'role'
                                        ? sortConfig.direction === 'asc'
                                        ? 'half-top' 
                                        : 'half-bottom'
                                        : ''
                                    } ms-2`} 
                                />
                            </th>
                            <th className="sort-header title-col-table-movies text-center" onClick={() => handleSort('createdAt')}>
                                Ngày đăng ký
                                <i className={`fa-solid fa-sort ${
                                    sortConfig.key === 'createdAt' 
                                        ? sortConfig.direction === 'asc'
                                        ? 'half-top' 
                                        : 'half-bottom'
                                        : ''
                                    } ms-2`} 
                                />
                            </th>
                            <th className="sort-header title-col-table-movies" onClick={() => handleSort('status')}>
                                Trạng thái
                                <i className={`fa-solid fa-sort ${
                                    sortConfig.key === 'status' 
                                        ? sortConfig.direction === 'asc'
                                        ? 'half-top' 
                                        : 'half-bottom'
                                        : ''
                                } ms-2`} 
                                />
                            </th>
                            <th className='text-center'>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className='align-middle'>
                        {currentData.map((account, index) => (
                            <tr key={account._id}>
                                <td className='text-center'>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                <td>{account.username ? account.username : 'Chưa thiết lập'}</td>
                                <td>{account.fullname}</td>
                                <td>{account.email ? account.email : 'Chưa thiết lập'}</td>
                                <td>{account.role.toLowerCase() === 'user' ? 'Người dùng' : 'QTV'}</td>
                                <td className=' text-center'>{new Date(account.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <div className="form-check form-switch">
                                        <input 
                                        className="form-check-input custom-switch" 
                                        type="checkbox"
                                        role="switch"
                                        id="flexSwitchRole"
                                        checked={!(account.status === 'locked')} 
                                        onChange={() => changeStatus(account._id, (account.status === 'locked' ? 'active' : 'locked'))}
                                        />
                                        <label className="form-check-label" htmlFor="flexSwitchRole">{account.status === 'locked' ? 'Tạm khóa' : 'Khả dụng'}</label>
                                    </div>
                                </td>
                                <td className='text-center'>
                                    <button
                                        className="btn btn-sm btn-warning me-2"
                                        onClick={() => handleEdit(account)}
                                    >
                                        <i className="fas fa-edit text-white"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className='d-flex justify-content-center'>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}

            {/* Modal for adding/editing account */}
            {isModalOpen && (
                <div className="modal d-block" onClick={() => setIsModalOpen(false)}>
                    <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-content">
                            <div className="modal-header d-flex justify-content-between">
                                <h5 className='modal-title'>{formData._id ? "Chỉnh sửa thông tin" : "Cấp tài khoản mới"}</h5>
                                <button
                                className="btn-close"
                                onClick={() => setIsModalOpen(false)}
                                ></button>
                            </div>
                            <div className="modal-body account-manage-input-modal-body">
                                <form>
                                    <div className="form-floating mb-3">
                                        <input type="text" className="form-control custom-focus" name='fullname' id="fullnameInput" placeholder="Họ tên" value={formData.fullname} onChange={handleInputChange} readOnly={formData._id} />
                                        <label htmlFor="fullnameInput">Họ tên</label>
                                    </div>
                                    <div className="form-floating mb-3">
                                        <input type="text" className="form-control custom-focus" name='email' id="emailInput" placeholder="Email" value={formData.email} onChange={handleInputChange} readOnly={formData._id} />
                                        <label htmlFor="emailInput">Email</label>
                                    </div>
                                    <div className="form-floating mb-3">
                                        <input type="text" className="form-control custom-focus" name='username' id="usernameInput" placeholder="Tên tài khoản" value={formData.username} onChange={handleInputChange} readOnly={formData._id} />
                                        <label htmlFor="usernameInput">Tên tài khoản</label>
                                    </div>

                                    <div className="form-floating mb-3">
                                        <input type="password" className="form-control custom-focus" name='password' id="passwordInput" placeholder="Mật khẩu" value={formData.password} onChange={handleInputChange} />
                                        <label htmlFor="passwordInput">Mật khẩu</label>
                                    </div>
                                    <div className="form-floating mb-3">
                                        <input type="password" className="form-control custom-focus" name='confirmPassword' id="confirmPasswordInput" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleInputChange} />
                                        <label htmlFor="confirmPassword">Xác thực mật khẩu</label>
                                    </div>
                                    <div className="form-floating mb-3">
                                        <select className="form-select custom-focus" name='role' id="roleSelect" aria-label="Select Role" value={formData.role} onChange={handleInputChange} >
                                            <option value="User">Người dùng</option>
                                            <option value="admin">Quản trị viên</option>
                                        </select>
                                        <label htmlFor="roleSelect">Vai trò</label>
                                    </div>
                                </form>
                                {errorMessage && <p className="text-danger mb-0">{errorMessage}</p>}
                            </div>
                            <div className="modal-footer">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Hủy
                                </button>
                                <button className="btn btn-primary save-account-btn" onClick={handleSave}>
                                    Lưu
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}


            {/* Modal for confirm delete */}
            {isDeleteConfirmOpen && (
                <div className="modal d-block" onClick={() => setIsDeleteConfirmOpen(false)}>
                    <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-content">
                            <div className="modal-header d-flex justify-content-between">
                                <h5 className="modal-title">Xác nhận xóa</h5>
                                <button
                                className="btn-close"
                                onClick={() => setIsDeleteConfirmOpen(false)}
                                ></button>
                            </div>
                            <div className="modal-body text-center ">
                                <p></p>
                                <p></p>
                                <h5>Xác nhận xóa tài khoản?</h5>
                                <p></p>
                                <p></p>
                            </div>
                            <div className="modal-footer">
                                <button
                                className="btn btn-secondary"
                                onClick={() => setIsDeleteConfirmOpen(false)}
                                >
                                Cancel
                                </button>
                                <button className="btn btn-danger" >
                                Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AccountManagement;
