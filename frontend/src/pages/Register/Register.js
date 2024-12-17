import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../UserContext';
import api from '../../api/api';
import './Register.css';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', fullname: '', email: '', password: '', confirmPassword: '' });
    const [errorMessage, setErrorMessage] = useState('');

    // const handleSubmit = async (e) => {
    //     e.preventDefault();

    //     if (formData.password !== formData.confirmPassword) {
    //         setErrorMessage("Passwords do not match");
    //         return;
    //     }

    //     setErrorMessage('');

    //     try {
    //         await api.post('/auth/register', {
    //             username: formData.username,
    //             email: formData.email,
    //             password: formData.password
    //         });
    //         alert('Registration successful');
    //         window.location.href = '/login';
    //     } catch (error) {
    //         console.log("Error during registration:", error);
    //         setErrorMessage(error.response?.data?.message || 'An unexpected error occurred');
    //     }
    // };

    // const toLogin = () => {
    //     window.location.href = '/login';
    // };

    const navigate = useNavigate();

    useEffect (() => {
        document.body.classList.add('background-page');

        return () => {
            document.body.classList.remove('background-page');
        };
    }, []);

    const { setIsAuthenticated } = useContext(UserContext);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            setIsAuthenticated(true);
        }
    }, [setIsAuthenticated]);

    const validateEmail = (email) => {
        const re = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/;
        return re.test(email);
    }
    
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        setErrorMessage('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateEmail(formData.email)) {
            setErrorMessage('Email không hợp lệ');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setErrorMessage("Mật khẩu không trùng khớp");
            return;
        }

        setErrorMessage('');

        try {
            await api.post('/auth/register', {
                username: formData.username,
                fullname: formData.fullname,
                email: formData.email,
                password: formData.password
            });
            alert('Đang ký thành công');
            navigate('/login');
        } catch (error) {
            console.log("Xảy ra lỗi khi đăng ký:", error);
            setErrorMessage(error.response?.data?.message || 'Xảy ra lỗi khi đăng ký!');
        }
    };

    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
      setShowPassword((prev) => !prev);
    };



    return (
        <div className="wrapper-register">
            <div className="form-wrapper">
                <div className="title">Đăng ký</div>
                <form  onSubmit={handleSubmit}>
                    <div className="register_input first-input">
                        <span className="icon-form-register fa fa-user" style={{ marginRight:'1px' }}></span>
                        <input type="text" name="username" onChange={handleChange} required />
                        <label htmlFor="">Tài khoản</label>
                    </div>
                    <div className="register_input">
                        <span className="icon-form-register fa-solid fa-signature"></span>
                        <input type="text" name="fullname" onChange={handleChange} required />
                        <label htmlFor="">Họ tên</label>
                    </div>
                    <div className="register_input">
                        <span className="icon-form-register fa-solid fa-envelope"></span>
                        <input type="text" name="email" onChange={handleChange} required />
                        <label htmlFor="">Email</label>
                    </div>
                    <div className="register_input">
                        <div className='icon-form-register d-flex align-items-center'>
                            <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'} me-3`} onClick={togglePasswordVisibility}></i>
                            <i className='fas fa-unlock-alt'></i>
                        </div>
                        
                        <input type={showPassword ? 'text' : 'password'} name="password" onChange={handleChange} required />
                        <label htmlFor="">Mật khẩu</label>
                    </div>
                    <div className="register_input last-input">
                        <div className='icon-form-register d-flex align-items-center'>
                            <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'} me-3`} onClick={togglePasswordVisibility}></i>
                            <i className='fas fa-unlock-alt'></i>
                        </div>
                        
                        <input type={showPassword ? 'text' : 'password'} name="confirmPassword" onChange={handleChange} required />
                        <label htmlFor="">Xác thực mật khẩu</label>
                    </div>
                    {/* <p className="text-danger text-left err-mess-register mb-0">hehe</p> */}
                    {errorMessage && <p className="text-danger text-left err-mess-register mb-0">{errorMessage}</p>}

                    <button type="submit" className="btn-register">Đăng ký</button>
                    <div className="login">
                        <p>Đã có tài khoản? <Link className='to_login' to="/login">Đăng nhập</Link></p>
                    </div>
                    

                </form>
            </div>
        </div>
        // <div className="container">
        //     <form className="mt-5" onSubmit={handleSubmit}>
        //         <h2 className="text-center mb-4">Register</h2>
        //         <div className="form-group">
        //             <input type="text" name="username" className="form-control" onChange={handleChange} placeholder="Username" required />
        //         </div>
        //         <div className="form-group">
        //             <input type="email" name="email" className="form-control" onChange={handleChange} placeholder="Email" required />
        //         </div>
        //         <div className="form-group">
        //             <input type="password" name="password" className="form-control" onChange={handleChange} placeholder="Password" required />
        //         </div>
        //         <div className="form-group">
        //             <input type="password" name="confirmPassword" className="form-control" onChange={handleChange} placeholder="Confirm Password" required />
        //         </div>
        //         {errorMessage && <p className="text-danger text-center">{errorMessage}</p>}
        //         <div className='form-group d-flex justify-content-between'>
        //             <button type="submit" className="btn btn-primary btn-block">Register</button>
        //             <button type="button" className="btn btn-secondary btn-block" onClick={toLogin}>to Login</button>
        //         </div>
        //     </form>
        // </div>
    );
};

export default Register;
