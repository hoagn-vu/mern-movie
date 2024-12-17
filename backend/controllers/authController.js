const nodemailer = require('nodemailer');
const User = require('../models/User');
const Movie = require('../models/Movie');
const dayjs = require('dayjs');
const { transporterConfig } = require('../config/nodemailerConfig');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { username, fullname, email, password } = req.body;
    
    const isValidUsername = Boolean(await User.findOne({ username }));
    const isValidEmail = Boolean(await User.findOne({ email }));
    if (isValidUsername) return res.status(400).json({ message: 'Tên tài khoản đã tồn tại' });
    if (isValidEmail) return res.status(400).json({ message: 'Email đã tồn tại' });

    try {
        const user = new User({ username, fullname, email, password, role: 'User' });
        await user.save();
        res.status(201).json({ message: 'Đăng ký tài khoản thành công' });
    } catch (error) {
        res.status(400).json({ message: 'Xảy ra lỗi trong quá trình đăng ký', error });
    }
};    

exports.verifyEmail = async (req, res) => {
    const { email, otpCode } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });

        if (user.otp.code !== otpCode) {
            return res.status(400).json({ message: 'Mã xác thực không chính xác' });
        }

        if (user.otp.expiredAt < new Date()) {
            return res.status(400).json({ message: 'Mã xác thực đã hết hạn' });
        }

        user.emailVerified = true;
        await user.save();
        res.json({ message: 'Xác thực email thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Xảy ra lỗi khi xác thực email', error });
    }
};

exports.resetPassword = async (req, res) => {
    const { otpCode, username } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });

        if (user.otp.code !== otpCode) {
            return res.status(400).json({ message: 'Mã xác thực không chính xác' });
        }

        if (user.otp.expiredAt < new Date()) {
            return res.status(400).json({ message: 'Mã xác thực đã hết hạn' });
        }

        const newPassword = Math.random().toString(36).substring(2, 10).toUpperCase();
        user.password = newPassword;
        user.otp = { code: '', expiredAt: '' };
        await user.save();

        const transporter = nodemailer.createTransport(transporterConfig);
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: '[Lovie] Mật khẩu đã được đặt lại',
            text: `Mật khẩu mới của bạn là: ${newPassword} \n\n Vui lòng đăng nhập và đổi mật khẩu ngay sau khi đăng nhập!`,
        };

        await transporter.sendMail(mailOptions);

        res.json({ message: 'Mật khẩu mới đã được gửi đến email của bạn' });
    } catch (error) {
        res.status(500).json({ message: 'Xảy ra lỗi khi đặt lại mật khẩu', error });
    }
};



exports.login = async (req, res) => {
    const { username, password, rememberMe } = req.body;
    try {
        const user = await User.findOne({ username, status: 'active' });
        if (!user) return res.status(400).json({ message: 'Tài khoản không khả dụng!' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Mật khẩu không chính xác!' })

        const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        });

        const refreshToken = jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: rememberMe ? process.env.REFRESH_TOKEN_EXPIRY : "1d",
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            maxAge: rememberMe ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000,
        });
    
        res.json({ 
            userId: user._id,
            accessToken, 
            role: user.role,
            emailVerified: user.emailVerified 
        });
    } catch (error) {
        res.status(400).json({ message: 'Xảy ra lỗi khi đăng nhập', error });
    }
    };

// Tạo refresh token
exports.refreshToken = (req, res) => {
    console.log("Attempting to refresh token");
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        console.log("No refresh token found in cookies");
        return res.status(401).json({ message: "Refresh token required" });
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, userPayload) => {
        if (err) {
            console.log("Invalid refresh token:", err);
            return res.status(403).json({ message: "Invalid refresh token" });
        }

        const user = await User.findById(userPayload.userId);
        if (!user) {
            console.log("User not found in database");
            return res.status(404).json({ message: "User not found" });
        }

        const newAccessToken = jwt.sign(
            { userId: user._id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
        );

        console.log("New access token sent:", newAccessToken);
        res.json({ accessToken: newAccessToken });
    });
};


// Đăng xuất
exports.logout = (req, res) => {
    try {
        res.clearCookie('refreshToken');
        res.clearCookie('connect.sid');
        res.json({ message: "Logged out" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select(['_id', 'email', 'emailVerified', 'username', 'fullname', 'role', 'avatar', 'createdAt', 'googleId', 'password', 'favoriteList', 'history']);
        // const user = await User.findById(req.user.userId).select(['-password', '-updatedAt', '-__v', '-favoriteList', '-history', '-status']);
        if (!user) return res.status(404).json({ message: 'User not found' });
        // res.json(user);

        // Lấy danh sách movieId từ history và chỉ giữ lại progress mới nhất cho mỗi phim
        const latestHistory = user.history.map(item => {
            const latestProgress = item.progress.reduce((latest, current) => {
                return new Date(current.at) > new Date(latest.at) ? current : latest;
            }, item.progress[0]);

            return {
                movieId: item.movieId,
                timeWatched: latestProgress.timeWatched,
                at: latestProgress.at,
            };
        });

        // Lấy danh sách movieId duy nhất
        const movieIds = [...new Set(latestHistory.map(item => item.movieId))];

        // Truy vấn tất cả các phim theo movieId
        const movies = await Movie.find({ _id: { $in: movieIds } }).select(['_id', 'mainTitle', 'subTitle', 'duration', 'source']);

        // Kết hợp thông tin phim với lịch sử xem
        const watchHistory = latestHistory.map(item => {
            const movie = movies.find(m => m._id.toString() === item.movieId.toString());

            return {
                movieId: item.movieId,
                mainTitle: movie?.mainTitle || 'Unknown Title',
                source: movie?.source || 'unknown',
                timeWatched: item.timeWatched,
                duration: movie?.duration || 0,
            };
        });

        res.json({
            _id: user._id,
            email: user.email,
            emailVerified: user.emailVerified,
            username: user.username,
            fullname: user.fullname,
            createdAt: user.createdAt,
            role: user.role,
            avatar: user.avatar,
            googleId: user.googleId,
            hasPassword: user.password ? true : false,
            favoriteList: user.favoriteList,
            history: watchHistory,
        })
        console.log("User profile sent");
        // console.log('user history:', watchHistory);
    } catch (error) {
        res.status(500).json({ message: 'Xảy ra lỗi khi lấy thông tin người dùng', error });
    }
};

