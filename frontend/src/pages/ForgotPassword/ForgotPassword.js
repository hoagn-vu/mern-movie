import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../UserContext';
import api from '../../api/api';
import './ForgotPassword.css';

const ForgotPassword = () => {

    const [errorMessage, setErrorMessage] = useState('');
    const [resendDisable, setResendDisable] = useState(true);
    const [resendTime, setResendTime] = useState(45);
    const [emailForSend, setEmailForSend] = useState('');
    const [otpForForgot, setOtpForForgot] = useState('');
    const [otpSent, setOtpSent] = useState(false);

    const [usernameForForgot, setUsernameForForgot] = useState('');

    const navigate = useNavigate();

    useEffect (() => {
        document.body.classList.add('background-page');
        return () => {
            document.body.classList.remove('background-page');
        };
    }, []);

    useEffect(() => {
        if (otpSent===true) {
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
    }, [resendTime, otpSent]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'username') {
            setUsernameForForgot(value);
        } else if (name === 'otpForForgot') {
            setOtpForForgot(value);
        }

        setErrorMessage('');
    }

    const sendOTP = async () => {
        if (usernameForForgot === '') {
            setErrorMessage('Vui lòng nhập tên tài khoản');
            return;
        }

        setOtpSent(true);
        try {
            const response = await api.post('/email/sendOTPReset', {
                username: usernameForForgot
            });

            if (response.data.email === null || response.data.email === '') {
                return (        
                    <div
                        className="d-flex justify-content-center align-items-center"
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100vw',
                            height: '100vh',
                            backgroundColor: 'rgba(0, 0, 0, 0.1)',
                            zIndex: '9999',
                        }}
                    >
                        <div
                            className="spinner-grow text-secondary"
                            role="status"
                            style={{ width: '3rem', height: '3rem' }}
                        >
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                );
            };

            setEmailForSend(response.data.email);
            setErrorMessage('');
        } catch (error) {
            setOtpSent(false);
            setErrorMessage(error.response?.data?.message || 'Xảy ra lỗi khi gửi mã OTP');
            return;
        }
        
    }

    const handleReset = async () => {
        try {
            const response = await api.post('/auth/reset-password', {
                otpCode: otpForForgot,
                username: usernameForForgot
            });

            if (response.data === null) {
                return (        
                    <div
                        className="d-flex justify-content-center align-items-center"
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100vw',
                            height: '100vh',
                            backgroundColor: 'rgba(0, 0, 0, 0.1)',
                            zIndex: '9999',
                        }}
                    >
                        <div
                            className="spinner-grow text-secondary"
                            role="status"
                            style={{ width: '3rem', height: '3rem' }}
                        >
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                );
            };

            console.log(response.data.message);
            alert('Mật khẩu mới đã được gửi đến email của bạn. Vui lòng kiểm tra email và đăng nhập để đổi mật khẩu mới.');
            navigate('/login');
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'Xảy ra lỗi khi đặt lại mật khẩu');
            return;
        }
    };

    return (
        <div className="wrapper-forgot">
            <div className="form-wrapper">

                <div className="title">Quên mật khẩu</div>
                {otpSent===false ? (
                    <div>
                        <p className="text-light text-left forgot-label mb-0">Nhập tên tài khoản của bạn:</p>

                        <div className="input-forgot ">
                            <span className="icon-form-forgot fa-solid fa-user"></span>
                            <input type="text" name="username" value={usernameForForgot} onChange={ handleChange } />
                        </div>

                        {/* <p className="text-danger text-left mb-0">hahah</p> */}
                        {errorMessage && <p className="text-danger text-left mb-0">{errorMessage}</p>}

                        <button type="button" className="btn-verify" onClick={sendOTP}>Gửi mã xác thực</button>
                        <p className="back-btn-forgot text-center mb-0 mt-2" onClick={ () => navigate('/login') }>Quay lại</p>

                    </div>
                ) : (
                    <div>
                        <p className="text-light text-left forgot-label mb-0">Nhập OTP gửi đến {emailForSend}:</p>

                        <div className="input-forgot ">
                            <span className="icon-form-forgot fa-solid fa-key"></span>
                            <input type="text" name="otpForForgot" value={otpForForgot} onChange={ handleChange } />
                        </div>

                        <p className="resend-line text-left mb-0">
                            Chưa nhận được OTP? <button type='button' className={`text-light resend-btn ${ resendDisable ? 'disable-resend' : '' } `} >
                                Gửi lại 
                            </button> ({resendTime}s)
                        </p>
                        {/* <p className="text-danger text-left mb-0">hahah</p> */}
                        {errorMessage && <p className="text-danger text-left mb-0">{errorMessage}</p>}

                        <button type="button" className="btn-verify" onClick={handleReset}>Đặt lại mật khẩu</button>

                        <p 
                            className="back-btn-forgot text-light text-center mb-0 mt-2" 
                            onClick={ () => { setOtpSent(false); setOtpForForgot(''); } }
                        >
                            Quay lại
                        </p>
                    </div>
                ) }
                

            </div>


        </div>
        

    );
};

export default ForgotPassword;