import React, { useState, useEffect, useContext } from 'react';
import api from '../../api/api';
import { UserContext } from '../../UserContext';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const navigate = useNavigate();

    useEffect (() => {
        document.body.classList.add('background-page');

        return () => {
            document.body.classList.remove('background-page');
        };
    }, []);

    const [formData, setFormData] = useState({ username: '', password: '' });
    const [rememberMe, setRememberMe] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
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
    const handleRememberMe = () => setRememberMe(!rememberMe);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // if (!validateEmail(formData.email)) {
        //     setErrorMessage('Email is invalid');
        //     return;
        // }
        try {
            const response = await api.post('/auth/login', {
                ...formData,
                rememberMe,
            });

            localStorage.setItem('accessToken', response.data.accessToken);
            setIsAuthenticated(true);

            const chosenMovie = localStorage.getItem('chosenMovie');
            if (!chosenMovie) {
                if (response.data.role.toLowerCase() === 'admin') {
                    navigate('/admin/dashboard');
                } else {
                    if (response.data.emailVerified === false) {
                        navigate('/verify');
                    } else {
                        navigate('/');
                    }
                }
            } else {
                navigate(`/${response.data.userId}/watch/${chosenMovie}`);
                localStorage.removeItem('chosenMovie');
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'An unexpected error occurred');
            console.log('Error during login: ', error);
        }
    };

    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    const handleLoginWithGoogle = async (e) => {
        e.preventDefault();
        window.location.href = 'http://localhost:5001/auth/google';
        // navigate('http://localhost:5001/auth/google');
    };

    

    return (
        <div className="wrapper-login">
            <div className="form-wrapper">
                <div className="title">Đăng nhập</div>
                <form  onSubmit={handleSubmit}>
                    <div className="user_input">
                        <span className="icon-form-login fa fa-user"></span>
                        <input type="text" name="username" onChange={handleChange} required />
                        <label htmlFor="">Tài khoản</label>
                    </div>
                    <div className="user_input">
                        <div className='icon-form-login d-flex align-items-center'>
                            <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'} me-3`} onClick={togglePasswordVisibility}></i>
                            <i className='fas fa-unlock-alt'></i>
                        </div>
                        {/* <span className="icon fa-regular fa-eye"><i className='fas fa-unlock-alt'></i></span> */}
                        {/* <span className="icon fas fa-unlock-alt"> <i onClick={togglePasswordVisibility}>{showPassword ? '👁️' : '👁️‍🗨️'}</i> </span> */}
                        
                        <input type={showPassword ? 'text' : 'password'} name="password" onChange={handleChange} required />
                        <label htmlFor="">Mật khẩu</label>
                    </div>
                    {errorMessage && <p className="text-danger text-left">{errorMessage}</p>}
                    <div className="remember_forget">
                        <label htmlFor="rememberMe">
                            <input type="checkbox" id="rememberMe" checked={rememberMe} onChange={handleRememberMe} />
                            <span>Ghi nhớ đăng nhập</span>
                        </label>
                        <Link className='to-forgot' to="/forgot">Quên mật khẩu?</Link>
                    </div>

                    <button type="submit" className="btn-login">Đăng nhập</button>
                    <div className="register">
                        <p>Chưa có tài khoản? <Link className='to_register' to="/register">Đăng ký</Link></p>
                    </div>
                    
                    <div className="separate">
                        <div className="line"></div>
                        <div className="or">Hoặc đăng nhập với</div>
                        <div className="line"></div>
                    </div>
                    <div className="d-flex align-items-center justify-content-center">
                        <button className="btn-login-with" onClick={(e) => handleLoginWithGoogle(e)}><i className="fab fa-google-plus-g"></i></button>
                    </div>
                </form>
            </div>
        </div>


    );
};

export default Login;

