import React, { useState, useEffect } from 'react';
import api from '../../api/api';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [rememberMe, setRememberMe] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);
    
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleRememberMe = () => setRememberMe(!rememberMe);


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/login', {
                ...formData,
                rememberMe, // gửi giá trị rememberMe cùng dữ liệu đăng nhập
            });

            localStorage.setItem('accessToken', response.data.accessToken);

            window.location.href = '/profile';
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'An unexpected error occurred');
            console.log('Error during login: ', error);
        }
    };

    const toRegister = () => {
        window.location.href = '/register';
    }

    return (
        <div className="container">
            <form className="mt-5" onSubmit={handleSubmit}>
                <h2 className="text-center mb-4">Login</h2>
                <div className="form-group">
                    <input type="email" name="email" className="form-control" onChange={handleChange} placeholder="Email" required />
                </div>
                <div className="form-group">
                    <input type="password" name="password" className="form-control" onChange={handleChange} placeholder="Password" required />
                </div>
                <div className="form-check mb-3">
                    <input type="checkbox" className="form-check-input" id="rememberMe" checked={rememberMe} onChange={handleRememberMe} />
                    <label className="form-check-label" htmlFor="rememberMe">Remember Me</label>
                </div>
                {errorMessage && <p className="text-danger text-center">{errorMessage}</p>}
                <div className='form-group d-flex justify-content-between'>
                    <button type="submit" className="btn btn-primary btn-block">Login</button>
                    <button type="button" className="btn btn-secondary btn-block" onClick={toRegister}>to Register</button>
                </div>
            </form>
        </div>
    );
};

export default Login;
