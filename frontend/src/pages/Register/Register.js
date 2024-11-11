import React, { useState } from 'react';
import api from '../../api/api';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setErrorMessage("Passwords do not match");
            return;
        }

        setErrorMessage('');

        try {
            await api.post('/auth/register', {
                username: formData.username,
                email: formData.email,
                password: formData.password
            });
            alert('Registration successful');
            window.location.href = '/login';
        } catch (error) {
            console.log("Error during registration:", error);
            setErrorMessage(error.response?.data?.message || 'An unexpected error occurred');
        }
    };

    const toLogin = () => {
        window.location.href = '/login';
    };  

    return (
        <div className="container">
            <form className="mt-5" onSubmit={handleSubmit}>
                <h2 className="text-center mb-4">Register</h2>
                <div className="form-group">
                    <input type="text" name="username" className="form-control" onChange={handleChange} placeholder="Username" required />
                </div>
                <div className="form-group">
                    <input type="email" name="email" className="form-control" onChange={handleChange} placeholder="Email" required />
                </div>
                <div className="form-group">
                    <input type="password" name="password" className="form-control" onChange={handleChange} placeholder="Password" required />
                </div>
                <div className="form-group">
                    <input type="password" name="confirmPassword" className="form-control" onChange={handleChange} placeholder="Confirm Password" required />
                </div>
                {errorMessage && <p className="text-danger text-center">{errorMessage}</p>}
                <div className='form-group d-flex justify-content-between'>
                    <button type="submit" className="btn btn-primary btn-block">Register</button>
                    <button type="button" className="btn btn-secondary btn-block" onClick={toLogin}>to Login</button>
                </div>
            </form>
        </div>
    );
};

export default Register;
