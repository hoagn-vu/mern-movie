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

    const [formData, setFormData] = useState({ email: '', password: '' });
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
        if (!validateEmail(formData.email)) {
            setErrorMessage('Email is invalid');
            return;
        }
        try {
            const response = await api.post('/auth/login', {
                ...formData,
                rememberMe, // gửi giá trị rememberMe cùng dữ liệu đăng nhập
            });

            localStorage.setItem('accessToken', response.data.accessToken);
            setIsAuthenticated(true);
            navigate('/profile');
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'An unexpected error occurred');
            console.log('Error during login: ', error);
        }
    };

    return (
        <div className="wrapper-login">
            <div className="form-wrapper">
                <div className="title">Login</div>
                <form  onSubmit={handleSubmit}>
                    <div className="user_input">
                        <span className="icon fa fa-user"></span>
                        <input type="text" name="email" onChange={handleChange} required />
                        <label htmlFor="">Username</label>
                    </div>
                    <div className="user_input">
                        <span className="icon fas fa-unlock-alt"></span>
                        <input type="password" name="password" onChange={handleChange} required />
                        <label htmlFor="">Password</label>
                    </div>
                    {errorMessage && <p className="text-danger text-left">{errorMessage}</p>}
                    <div className="remember_forget">
                        <label htmlFor="rememberMe">
                            <input type="checkbox" id="rememberMe" checked={rememberMe} onChange={handleRememberMe} />
                            <span>Remember me</span>
                        </label>
                        <a href="#">Forget password?</a>
                    </div>

                    <button type="submit" className="btn-login">Login</button>
                    <div className="register">
                        <p>Don't have an account? <Link className='to_register' to="/register">Register</Link></p>
                    </div>
                    
                    <div className="separate">
                        <div className="line"></div>
                        <div className="or">OR LOGIN WITH</div>
                        <div className="line"></div>
                    </div>
                    <div className="d-flex align-items-center justify-content-center">
                        <button className="btn-login-with"><i className="fab fa-google-plus-g"></i></button>
                    </div>
                </form>
            </div>
        </div>


    );
};

export default Login;

