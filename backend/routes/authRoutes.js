const express = require('express');
const { checkValidRegister, register, verifyEmail, resetPassword, login, refreshToken, logout, getProfile } = require('../controllers/authController');
const { authMiddleware } = require('../middlewares/authMiddleware.js');
const router = express.Router();

router.post('/valid-register', checkValidRegister);
router.post('/register', register);
router.post('/verify-email', verifyEmail);
router.post('/reset-password', resetPassword);
router.post('/login', login);
router.get('/refresh-token', refreshToken);
router.get('/logout', logout);
router.get('/profile', authMiddleware, getProfile);

module.exports = router;
