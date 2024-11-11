const express = require('express');
const { register, login, getProfile } = require('../controllers/authController');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authMiddleware, getProfile);

// Thêm route để refresh token
router.post('/auth/refresh', async (req, res) => {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) return res.sendStatus(403);

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const newAccessToken = jwt.sign({ userId: decoded.userId }, process.env.JWT_SECRET, { expiresIn: '1m' });
        res.json({ token: newAccessToken });
    } catch (error) {
        res.sendStatus(403);
    }
});


module.exports = router;
