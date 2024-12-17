import React, { useState, useEffect } from 'react';
import './Profile.css';
import api from '../../api/api';
import DefaultLayout from '../../layouts/DefaultLayout/DefaultLayout';

const Profile = ({ userData, callGetUserData }) => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const [tempFullName, setTempFullName] = useState('');
    const [selectedAvatar, setSelectedAvatar] = useState('');

    useEffect(() => {
        setTempFullName(userData.fullname);
        setSelectedAvatar(userData.avatar);
    }, [userData]);
    
    const avatarList = [
        'https://i.imgur.com/0ODZkGf.png', // default
        'https://i.imgur.com/1ECC7nM.png', // no face
        'https://i.imgur.com/aXUJ1pU.png', // harley quinn
        'https://i.imgur.com/zw9YVOE.png', // g1
        'https://i.imgur.com/ANKWJ49.png', // g2
        'https://i.imgur.com/GIKfQyy.png', // saclo
        'https://i.imgur.com/lLG8JG1.png', // batman
        'https://i.imgur.com/2SE9PzZ.png', // einstein
        'https://i.imgur.com/39BA4wd.png', // jason 6 13th
        'https://i.imgur.com/GQx4l1e.png', // walter white
    ];

    const [isModalPersonalOpen, setIsModalPersonalOpen] = useState(false);
    const [isModalAccountOpen, setIsModalAccountOpen] = useState(false);
    const [editingField, setEditingField] = useState('');

    const toggleModalPersonal = () => {
        setIsModalPersonalOpen((prev) => !prev);
    };
    const toggleModalAccount = (field) => {
        setEditingField(field);
        setIsModalAccountOpen((prev) => !prev);
    };

    const handleSelectAvatar = (avatarUrl) => {
        setSelectedAvatar(avatarUrl);
    };

    const handleSaveChanges = async () => {
        if (tempFullName === '') {
            alert('Họ tên không được để trống');
            return;
        }
    
        try {
            await api.put(`/account/update-avatar-fullname/${userData._id}`, {
                fullname: tempFullName,
                avatar: selectedAvatar,
            });
            callGetUserData();
            toggleModalPersonal();
        } catch (error) {
            console.error('Error during updating user data:', error);
        }
    };

    const [errorMessage, setErrorMessage] = useState('');

    const [showPassword, setShowPassword] = useState({
        oldPassword: false,
        newPassword: false,
        confirmPassword: false,
    });
      
    const togglePasswordVisibility = (field) => {
        setShowPassword((prevState) => ({
            ...prevState,
            [field]: !prevState[field],
        }));
    };

    const [newUsername, setNewUsername] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const saveChangeAccountInfo = async () => {
        if (editingField === "username") {
            if (newUsername === '' || newPassword === '' || confirmPassword === '') {
                setErrorMessage('Vui lòng điền đầy đủ thông tin');
                return;
            }
            if (newPassword !== confirmPassword) {
                setErrorMessage('Mật khẩu không trùng khớp');
                return;
            }
            try {
                await api.put(`/account/update-username-password/${userData._id}`, {
                    username: newUsername,
                    password: newPassword,
                });
                callGetUserData();
                toggleModalAccount();
                alert('Cập nhật thông tin đăng nhập thành công');
            } catch (error) {
                console.error('Error during updating user data:', error);
                setErrorMessage(error.response?.data?.message || 'Xảy ra lỗi khi cập nhật!');
            }
        } else if (editingField === "password") {
            if (newPassword === '' || confirmPassword === '') {
                setErrorMessage('Vui lòng điền đầy đủ thông tin');
                return;
            }
            if (newPassword !== confirmPassword) {
                setErrorMessage('Mật khẩu không trùng khớp');
                return;
            }
            try {
                await api.put(`/account/change-password/${userData._id}`, {
                    oldPassword: oldPassword,
                    newPassword: newPassword,
                });
                // callGetUserData();
                toggleModalAccount();
                alert('Thay đổi mật khẩu thành công');
            } catch (error) {
                console.error('Error during updating user data:', error);
                setErrorMessage(error.response?.data?.message || 'Xảy ra lỗi khi cập nhật!');
            }
        }
 
    };

      


    return (
        <DefaultLayout userData={userData}>
            <div className="container user-profile-container">
                <div className='user-profile-header text-white mt-2 mb-3 pb-2 d-flex align-items-center justify-content-center'>
                    <h2 className='m-0'>Hồ Sơ Người Dùng</h2>
                </div>

                <p className="box-title text-white" >Thông tin cá nhân:</p>
                <div className="first-profile-box text-white bg-dark rounded p-3 ps-4 pe-4 mb-3 mt-1">
                    <div className="d-flex justify-content-between align-items-center ">
                        <div className="user-information-box d-flex justify-content-start align-items-center">
                            <img 
                                src={`${userData.avatar}`}
                                alt="User Avatar" 
                                className="user-avatar img-fluid me-3" 
                            />
                            <div className="user-information">
                                <h4 className="mb-0">{userData.fullname}{userData.role==='admin' && ' - Quản trị viên'}</h4>
                                <p className="register-date">Ngày tham gia: {userData.createdAt.slice(0, 10) }</p>
                            </div>
                        </div>
                        
                        <button className="edit-infor-button text-decoration-none" onClick={toggleModalPersonal}>
                            <strong>Chỉnh sửa</strong>
                        </button>
                    </div>
                </div>

                <p className="box-title text-white">Thông tin tài khoản:</p>
                <div className="second-profile-box text-white bg-dark rounded pb-4 ps-4 pe-4 mt-1">
                    <div className="profile-row d-flex justify-content-between align-items-center">
                        <div className="d-flex justify-content-start align-items-center pt-4 pb-4">
                            <p className="me-3 profile-row-title">Tên tài khoản:</p>
                            <p>{userData.username ? userData.username : 'Chưa thiết lập' }</p>
                        </div>
                        {/* <button className={`setting-button text-decoration-none `} onClick={() => toggleModalAccount("username")}> */}
                        <button className={`setting-button text-decoration-none ${userData.username ? ' disabled-button-profile' : ''}`} onClick={() => toggleModalAccount("username")}>
                            <strong>{userData.username ? 'Đã thiết lập' : 'Thiết lập'}</strong>
                        </button>
                    </div>
                    <div className="profile-row d-flex justify-content-between align-items-center">
                        <div className="d-flex justify-content-start align-items-center pt-4 pb-4">
                            <p className="me-3 profile-row-title">Email:</p>
                            <p>{userData.email ? userData.email : 'Chưa thiết lập'}</p>
                        </div>
                        
                        {userData.email ? (
                            userData.emailVerified === false ? (
                                <button className="setting-button text-decoration-none" onClick={() => toggleModalAccount("emailVerify")}>
                                    <strong>Chưa xác thực</strong>
                                </button>
                            ) : (
                                <button className="setting-button text-decoration-none disabled-button-profile" disabled>
                                    <strong>Đã xác thực</strong>
                                </button>
                            )
                        ) : (
                            <button className="setting-button text-decoration-none" onClick={() => toggleModalAccount("email")}>
                                <strong>Thiết lập</strong>
                            </button>
                        )}
                    </div>

                    <div className="profile-row d-flex justify-content-between align-items-center">
                        <div className="d-flex justify-content-start align-items-center pt-4 pb-4">
                            <p className="me-3 profile-row-title">Mật khẩu:</p>
                            <p>{userData.username && userData.hasPassword===true ? '••••••••' : 'Chưa thiết lập'}</p>
                        </div>
                        <button className={`setting-button text-decoration-none ${userData.hasPassword ? '' : 'disabled-button-profile'}`}  onClick={() => toggleModalAccount("password")}>
                            <strong>Thay đổi</strong>
                        </button>
                    </div>
                </div>

                {/* Modal */}
                {isModalPersonalOpen && (
                    <div className="modal-overlay personal-edit-modal-overlay">
                        <div className="modal-content personal-edit-modal-content bg-dark text-white p-4 rounded">
                            <h5>Chỉnh sửa thông tin cá nhân</h5>
                            <form className="edit-infor-form">
                                <div className="edit-infor-box d-flex align-items-center mb-3 pb-3">
                                    <div className="me-3">
                                        <img 
                                            src={`${selectedAvatar ? selectedAvatar : userData.avatar}`}
                                            alt="User Avatar" 
                                            className="user-avatar img-fluid" 
                                        />
                                    </div>
                                    <div className="fullname-input">
                                        <span className="icon-fullname fa-solid fa-address-card"></span>
                                        <input 
                                            type="text"
                                            id="fullnameFloatingInput"
                                            name="fullname"
                                            value={tempFullName}
                                            onChange={(e) => setTempFullName(e.target.value)}
                                            required
                                        />
                                        <label htmlFor="fullnameFloatingInput">Họ tên:</label>
                                    </div>
                                </div>

                                <p>Chọn ảnh đại diện:</p>
                                <div className="avatar-list row mt-2 mb-2">
                                    {avatarList.map((avatarUrl, index) => (
                                        <div
                                            className="avatar-col position-relative d-flex justify-content-center mb-3"
                                            key={index}
                                            onClick={() => handleSelectAvatar(avatarUrl)}
                                        >
                                            <img 
                                                src={`${avatarUrl}`}
                                                alt="User Avatar"
                                                className={`avatar-option img-fluid me-2 ${
                                                    selectedAvatar === avatarUrl ? "selected-avatar" : ""
                                                }`}
                                            />
                                            {selectedAvatar === avatarUrl && (
                                                <i className="fa-solid fa-check selected-icon position-absolute"></i>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <div className="edit-button-box d-flex justify-content-end">
                                    <button 
                                        type="button" 
                                        className="btn btn-secondary me-2"
                                        onClick={toggleModalPersonal}
                                    >
                                        Hủy
                                    </button>
                                    <button 
                                        type="button" 
                                        className="btn btn-primary"
                                        onClick={handleSaveChanges}
                                    >
                                        Lưu
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {isModalAccountOpen && (
                    <div className="modal-overlay account-edit-modal-overlay">
                        <div className="modal-content account-edit-modal-content bg-dark text-white p-4 rounded">
                            <h5>
                                {editingField === "username" ? "Thiết lập tài khoản đăng nhập" : "Đổi mật khẩu"}
                            </h5>
                            <form className="edit-infor-form">
                                <div className="edit-infor-box d-flex align-items-center mb-3 pb-3">
                                    <div className="me-3">
                                        <img 
                                            src={`${selectedAvatar ? selectedAvatar : userData.avatar}`}
                                            alt="User Avatar" 
                                            className="user-avatar img-fluid" 
                                        />
                                    </div>
                                    <div className="fullname-input">
                                        <span className="icon-fullname fa-solid fa-address-card"></span>
                                        <input 
                                            type="text"
                                            id="fullnameFloatingInput"
                                            name="fullname"
                                            value={tempFullName}
                                            readonly
                                        />
                                        <label htmlFor="fullnameFloatingInput">Họ tên:</label>
                                    </div>
                                </div>

                                {editingField === "username" && (
                                    <div className='edit-account-profile'>
                                        <div className="register_input">
                                            <span className="icon-form-register fa-solid fa-user"></span>
                                            <input 
                                                type="text" 
                                                name="username" 
                                                required
                                                value={newUsername}
                                                onChange={(e) => {setNewUsername(e.target.value);setErrorMessage('');}}
                                            />
                                            <label htmlFor="">Tên tài khoản</label>
                                        </div>
                                        <div className="register_input">
                                            <div className='icon-form-register d-flex align-items-center'>
                                                <i className={`fa-solid ${showPassword.newPassword  ? 'fa-eye-slash' : 'fa-eye'} me-3`} onClick={() => togglePasswordVisibility('newPassword')}></i>
                                                <i className='fas fa-unlock-alt'></i>
                                            </div>
                                            
                                            <input 
                                                type={showPassword.newPassword  ? 'text' : 'password'} 
                                                name="password" 
                                                required
                                                value={newPassword}
                                                onChange={(e) => {setNewPassword(e.target.value);setErrorMessage('');}}
                                            />
                                            <label htmlFor="">Mật khẩu</label>
                                        </div>
                                        <div className="register_input last-input">
                                            <div className='icon-form-register d-flex align-items-center'>
                                                <i className={`fa-solid ${showPassword.confirmPassword  ? 'fa-eye-slash' : 'fa-eye'} me-3`} onClick={() => togglePasswordVisibility('confirmPassword')}></i>
                                                <i className='fas fa-unlock-alt'></i>
                                            </div>
                                            
                                            <input 
                                                type={showPassword.confirmPassword  ? 'text' : 'password'} 
                                                name="confirmPassword" 
                                                required
                                                value={confirmPassword}
                                                onChange={(e) => {setConfirmPassword(e.target.value);setErrorMessage('');}}
                                            />
                                            <label htmlFor="">Xác thực mật khẩu</label>
                                        </div>

                                        {/* <p className="text-danger text-left err-mess-register mb-0">hehee</p> */}
                                        {errorMessage && <p className="text-danger text-left err-mess-register mb-0">{errorMessage}</p>}

                                        <div className="edit-button-box d-flex justify-content-end">
                                            <button 
                                                type="button" 
                                                className="btn btn-secondary me-2"
                                                onClick={toggleModalAccount}
                                            >
                                                Hủy
                                            </button>
                                            <button 
                                                type="button" 
                                                className="btn btn-primary"
                                                onClick={saveChangeAccountInfo}
                                            >
                                                Lưu
                                            </button>
                                        </div>
                                    </div>
                                )}
                                {editingField === "password" && (
                                    <div className='edit-password-profile'>
                                        <div className="register_input">
                                            <div className='icon-form-register d-flex align-items-center'>
                                                <i className={`fa-solid ${showPassword.oldPassword  ? 'fa-eye-slash' : 'fa-eye'} me-3`} onClick={() => togglePasswordVisibility('oldPassword')}></i>
                                                <i className='fas fa-unlock-alt'></i>
                                            </div>
                                            
                                            <input 
                                                type={showPassword.oldPassword  ? 'text' : 'password'} 
                                                name="password" 
                                                required 
                                                value={oldPassword}
                                                onChange={(e) => {setOldPassword(e.target.value);setErrorMessage('');}}
                                            />
                                            <label htmlFor="">Mật khẩu cũ</label>
                                        </div>
                                        <div className="register_input">
                                            <div className='icon-form-register d-flex align-items-center'>
                                                <i className={`fa-solid ${showPassword.newPassword  ? 'fa-eye-slash' : 'fa-eye'} me-3`} onClick={() => togglePasswordVisibility('newPassword')}></i>
                                                <i className='fas fa-unlock-alt'></i>
                                            </div>
                                            
                                            <input 
                                                type={showPassword.newPassword  ? 'text' : 'password'} 
                                                name="password" 
                                                required 
                                                value={newPassword}
                                                onChange={(e) => {setNewPassword(e.target.value);setErrorMessage('');}}
                                            />
                                            <label htmlFor="">Mật khẩu mới</label>
                                        </div>
                                        <div className="register_input last-input">
                                            <div className='icon-form-register d-flex align-items-center'>
                                                <i className={`fa-solid ${showPassword.confirmPassword  ? 'fa-eye-slash' : 'fa-eye'} me-3`} onClick={() => togglePasswordVisibility('confirmPassword')}></i>
                                                <i className='fas fa-unlock-alt'></i>
                                            </div>
                                            
                                            <input 
                                                type={showPassword.confirmPassword  ? 'text' : 'password'} 
                                                name="confirmPassword" 
                                                required
                                                value={confirmPassword}
                                                onChange={(e) => {setConfirmPassword(e.target.value);setErrorMessage('');}}
                                            />
                                            <label htmlFor="">Xác thực mật khẩu</label>
                                        </div>

                                        {/* <p className="text-danger text-left err-mess-register mb-0">hehe</p> */}
                                        {errorMessage && <p className="text-danger text-left err-mess-register mb-0">{errorMessage}</p>}

                                        <div className="edit-button-box d-flex justify-content-end">
                                            <button 
                                                type="button" 
                                                className="btn btn-secondary me-2"
                                                onClick={toggleModalAccount}
                                            >
                                                Hủy
                                            </button>
                                            <button 
                                                type="button" 
                                                className="btn btn-primary"
                                                onClick={saveChangeAccountInfo}
                                            >
                                                Lưu
                                            </button>
                                        </div>
                                    </div>
                                )}



                            </form>

                        </div>
                    </div>
                )}
            </div>
        </DefaultLayout>
    );
};

export default Profile;
