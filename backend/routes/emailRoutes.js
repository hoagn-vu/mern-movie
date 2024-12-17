const express = require('express');
const { sendEmail, sendOTPForVerify, sendOTPForResetPassword } = require('../controllers/emailController');

const router = express.Router();

router.post('/send', sendEmail);
router.post('/sendOTP', sendOTPForVerify);
router.post('/sendOTPReset', sendOTPForResetPassword);

module.exports = router;