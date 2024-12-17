const express = require('express');
const { register, verifyEmail, resetPassword, login, refreshToken, logout, getProfile } = require('../controllers/authController');
const { authMiddleware } = require('../middlewares/authMiddleware.js');
const router = express.Router();

router.post('/register', register);
router.post('/verify-email', verifyEmail);
router.post('/reset-password', resetPassword);
router.post('/login', login);
router.get('/refresh-token', refreshToken);
router.get('/logout', logout);
router.get('/profile', authMiddleware, getProfile);

module.exports = router;
