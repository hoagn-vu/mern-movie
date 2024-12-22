import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../UserContext';
import api from '../../api/api';
import './Register.css';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', fullname: '', email: '', password: '', confirmPassword: '' });
    const [errorMessage, setErrorMessage] = useState('');

    const [isVerifying, setIsVerifying] = useState(false);
    const [otpTemp, setOtpTemp] = useState({
        code: '',
        expiredAt: ''
    });

    const otpInput = useRef(null);
    const [otpForVerify, setOtpForVerify] = useState('');
    const [resendDisable, setResendDisable] = useState(true);
    const [resendTime, setResendTime] = useState(45);

    const handleVerifyEmail = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setResendDisable(true);
        setResendTime(45);
        try {
            // Xác thực email và username
            const response = await api.post('/auth/valid-register', {
                username: formData.username,
                email: formData.email
            });
            console.log(response.data.message);
    
            // Tạo OTP và thời gian hết hạn
            const otp = Math.random().toString(36).slice(2, 8).toUpperCase();
            const expiredAt = new Date(Date.now() + 15 * 60000);
            setOtpTemp({
                code: otp,
                expiredAt: expiredAt
            });
            setIsVerifying(true);

            // Gửi OTP qua email
            try {
                const otpResponse = await api.post('/email/sendOtpRegister', {
                    email: formData.email,
                    subject: '[Lovie] Xác thực Email',
                    code: otp,
                    expiredAt: expiredAt
                });
                console.log(otpResponse.data.message);
            } catch (otpError) {
                console.log('Xảy ra lỗi khi gửi OTP:', otpError);
            }
    
        } catch (error) {
            setErrorMessage(error.response?.data?.message);
            console.log('Xảy ra lỗi khi đăng ký tài khoản:', error);
        }
    };
    

    useEffect(() => {
        if (isVerifying) {
            let timer;
            if (resendTime > 0) {
                timer = setInterval(() => {
                    setResendTime((prevTime) => {
                        if (prevTime > 1) {
                            return prevTime - 1;
                        } else {
                            setResendDisable(false);
                            clearInterval(timer);
                            return 0;
                        }
                    });
                }, 1000);
            }
        
            return () => clearInterval(timer);
        }
    }, [resendTime, isVerifying]);
    
    
    const handleChangeOtp = () => {
        setOtpForVerify(otpInput.current.value);
        setErrorMessage('');
    }

    const handleVerify = () => {
        if (otpTemp.code !== otpForVerify) {
            setErrorMessage('Mã xác thực không chính xác');
            return;
        }

        if (otpTemp.expiredAt < new Date()) {
            setErrorMessage('Mã xác thực đã hết hạn');
            return;
        }
        
        handleSubmit();
        setErrorMessage('');
        setFormData({ username: '', fullname: '', email: '', password: '', confirmPassword: '' });
    };


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

    const handleSubmit = async () => {
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
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const togglePasswordVisibility = (pass) => {
        if (pass === 'password') setShowPassword((prev) => !prev);
        if (pass === 'confirmPassword') setShowConfirmPassword((prev) => !prev);
    };



    return (
        <div>
        {isVerifying===true ? (
            <div className="wrapper-verify">
                <div className="form-wrapper">
                    <div className="title">Xác thực Email</div>
                    <p className="text-light text-left verify-label mb-0">Nhập OTP gửi đến {formData.email}:</p>

                    <div className="verify_input ">
                        <span className="icon-form-register fa-solid fa-key"></span>
                        <input type="text" name="otp" onChange={ handleChangeOtp } required ref={ otpInput } />
                    </div>
                    
                    <p className="resend-line text-left mb-0">
                        Chưa nhận được OTP? <button type='button' className={`text-light resend-btn ${ resendDisable ? 'disable-resend' : '' } `} onClick={ handleVerifyEmail }>
                            Gửi lại 
                        </button> ({resendTime}s)
                    </p>
                    {errorMessage && <p className="text-danger text-left mb-0">{errorMessage}</p>}

                    <button type="button" className="btn-verify" onClick={handleVerify}>Xác thực</button>

                    <div className='d-flex justify-content-center text-white'>
                        <p className="back-to-register mb-0 mt-2" onClick={ () => {setIsVerifying(false); setResendTime(45);} }>
                            Quay lại
                        </p>
                    </div>
                </div>
            </div>
        ) : (
            <div className="wrapper-register">
                <div className="form-wrapper">
                    <div className="title">Đăng ký</div>
                        <form  onSubmit={handleSubmit}>
                            <div className="register_input first-input">
                                <span className="icon-form-register fa fa-user" style={{ marginRight:'1px' }}></span>
                                <input type="text" value={formData.username} name="username" onChange={handleChange} required />
                                <label htmlFor="">Tài khoản</label>
                            </div>
                            <div className="register_input">
                                <span className="icon-form-register fa-solid fa-signature"></span>
                                <input type="text" value={formData.fullname} name="fullname" onChange={handleChange} required />
                                <label htmlFor="">Họ tên</label>
                            </div>
                            <div className="register_input">
                                <span className="icon-form-register fa-solid fa-envelope"></span>
                                <input type="text" value={formData.email} name="email" onChange={handleChange} required />
                                <label htmlFor="">Email</label>
                            </div>
                            <div className="register_input">
                                <div className='icon-form-register d-flex align-items-center'>
                                    <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'} me-3`} onClick={ () => togglePasswordVisibility('password') }></i>
                                    <i className='fas fa-unlock-alt'></i>
                                </div>
                                
                                <input type={showPassword ? 'text' : 'password'} value={formData.password} name="password" onChange={handleChange} required />
                                <label htmlFor="">Mật khẩu</label>
                            </div>
                            <div className="register_input last-input">
                                <div className='icon-form-register d-flex align-items-center'>
                                    <i className={`fa-solid ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'} me-3`} onClick={ () => togglePasswordVisibility('confirmPassword') }></i>
                                    <i className='fas fa-unlock-alt'></i>
                                </div>
                                
                                <input type={showConfirmPassword ? 'text' : 'password'} value={formData.confirmPassword} name="confirmPassword" onChange={handleChange} required />
                                <label htmlFor="">Xác thực mật khẩu</label>
                            </div>
                            {errorMessage && <p className="text-danger text-left err-mess-register mb-0">{errorMessage}</p>}

                            <button type="button" className="btn-register" onClick={handleVerifyEmail}>Đăng ký</button>
                            <div className="login">
                                <p>Đã có tài khoản? <Link className='to_login' to="/login">Đăng nhập</Link></p>
                            </div>
                        </form>
                </div>
            </div>
        )}
        </div>

    );
};

export default Register;
