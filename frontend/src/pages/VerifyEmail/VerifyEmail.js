import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../UserContext';
import api from '../../api/api';
import './VerifyEmail.css';

const VerifyEmail = ({ mail, isVerified }) => {
    const otpInput = useRef(null);
    const [otpForVerify, setOtpForVerify] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [resendDisable, setResendDisable] = useState(true);
    const [resendTime, setResendTime] = useState(45);

    const [isFirstTimeLoad, setIsFirstTimeLoad] = useState(true);

    const navigate = useNavigate();

    useEffect (() => {
        document.body.classList.add('background-page');
        return () => {
            document.body.classList.remove('background-page');
        };
    }, []);

    useEffect(() => {
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
    }, [resendTime]);
    
    
    const handleChange = () => {
        setOtpForVerify(otpInput.current.value);
        setErrorMessage('');
    }

    const sendOtp = async () => {
        if (isFirstTimeLoad===false && resendDisable) return;
        try {
            setResendDisable(true);
            setResendTime(45);
            const response = await api.post('/email/sendOTP', {
                email: mail,
                subject: '[Lovie] Xác thực Email',
            });
            console.log(response.data.message);
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'Xảy ra lỗi khi gửi OTP!');
            console.error('Error during sending OTP:', error);
        }
    };

    useEffect(() => {
        if (isVerified===true) {
            navigate('/');
        } else {
            if (mail && isFirstTimeLoad === true) {
                sendOtp();
                setIsFirstTimeLoad(false);
            }
            
            if (otpInput.current) {
                otpInput.current.focus();
            }
        }
    }, [mail, isVerified, isFirstTimeLoad, sendOtp, navigate]);

    const handleVerify = async () => {
        try {
            const response = await api.post('/auth/verify-email', {
                email: mail,
                otpCode: otpForVerify,
            });
            console.log(response.data.message);
            navigate('/');
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'Xác thực thất bại!');
            console.error('Error during verifying email:', error);
        }
    };

    if (!mail) {
        return navigate('/login');
        // return (        
        // <div
        //     className="d-flex justify-content-center align-items-center"
        //     style={{
        //         position: 'fixed',
        //         top: 0,
        //         left: 0,
        //         width: '100vw',
        //         height: '100vh',
        //         backgroundColor: 'rgba(0, 0, 0, 0.1)',
        //         zIndex: '9999',
        //     }}
        // >
        //     <div
        //         className="spinner-border text-secondary"
        //         role="status"
        //         style={{ width: '3rem', height: '3rem' }}
        //     >
        //         <span className="visually-hidden">Loading...</span>
        //     </div>
        // </div>);
    }

    

    return (
        <div className="wrapper-verify">
            <div className="form-wrapper">
                <div className="title">Xác thực Email</div>
                <p className="text-light text-left verify-label mb-0">Nhập OTP gửi đến {mail}:</p>

                <div className="verify_input ">
                    <span className="icon-form-register fa-solid fa-key"></span>
                    <input type="text" name="otp" onChange={ handleChange } required ref={ otpInput } />
                    {/* <label htmlFor="">Mã xác thực OTP</label> */}
                </div>
                
                <p className="resend-line text-left mb-0">
                    Chưa nhận được OTP? <button type='button' className={`text-light resend-btn ${ resendDisable ? 'disable-resend' : '' } `} onClick={ sendOtp }>
                        Gửi lại 
                    </button> ({resendTime}s)
                </p>
                {errorMessage && <p className="text-danger text-left mb-0">{errorMessage}</p>}

                <button type="button" className="btn-verify" onClick={handleVerify}>Xác thực</button>
            </div>


        </div>
    );
}

export default VerifyEmail;
