const User = require('../models/User');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

exports.getAllAccounts = async (req, res) => {
    try {
        const accounts = await User.find({ username: { $ne: 'hoangvu' } }).select(['-password', '-__v']).sort({ _id: -1 });
        if (!accounts) return res.status(404).json({ message: 'Danh sách tài khoản trống!' });
        res.json(accounts);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách tài khoản', error });
    }
}

exports.getAccountsByRole = async (req, res) => {
    const { role } = req.params;
    try {
        const accounts = await User.find({ role }).select(['-password', '-updatedAt', '-__v']).sort({ _id: -1 });
        if (!accounts) return res.status(404).json({ message: 'Danh sách tài khoản trống!' });
        res.json(accounts);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách tài khoản', error });
    }
}

exports.changeAccessControl = async (req, res) => {
    const { userId } = req.params;
    const { dashboard, movies, users, rolebased, reports } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'ID không hợp lệ.' });
    }

    if (typeof dashboard === 'undefined' && typeof movies === 'undefined' && typeof users === 'undefined' && typeof rolebased === 'undefined' && typeof reports === 'undefined') {
        return res.status(400).json({ message: 'Vui lòng cung cấp thông tin cần cập nhật.' });
    }

    try {
        const account = await User.findById(userId);
        if (!account) return res.status(404).json({ message: 'Không tìm thấy tài khoản.' });

        if (typeof dashboard !== 'undefined') account.accessControl.dashboard = dashboard;
        if (typeof movies !== 'undefined') account.accessControl.movies = movies;
        if (typeof users !== 'undefined') account.accessControl.users = users;
        if (typeof rolebased !== 'undefined') account.accessControl.rolebased = rolebased;
        if (typeof reports !== 'undefined') account.accessControl.reports = reports;

        await account.save();
        res.json({ message: 'Đã cập nhật quyền truy cập.' });
    } catch (error) {
        res.status(400).json({ message: 'Xảy ra lỗi khi cập nhật quyền truy cập.', error });
    }
};




exports.getAccountById = async (req, res) => {
    try {
        const account = await User.findById(req.params.id).select(['-password', '-createdAt', '-updatedAt', '-__v']);
        if (!account) return res.status(404).json({ message: 'No account found' });
        res.json(account);
    } catch (error) {
        res.status(400).json({ message: 'Error getting account', error });
    }
}

exports.createAccount = async (req, res) => {
    try {
        const { username, fullname, email, password, role } = req.body;
        if (!username || !fullname || !email || !password || !role) {
            return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin' });
        }

        const existingAccount = await User.findOne({ username });
        if (existingAccount) return res.status(400).json({ message: 'Tên tài khoản đã tồn tại' });
        const existingEmail = await User.findOne({ email });
        if (existingEmail) return res.status(400).json({ message: 'Email đã tồn tại' });

        const account = new User({ username, fullname, email, password, role, emailVerified:true });
        await account.save();
        res.status(201).json(account);
    } catch (error) {
        res.status(400).json({ message: 'Xảy ra lỗi trong quá trình tạo tài khoản', error });
    }
}

exports.updateAccount = async (req, res) => {
    const { username, fullname, email, password, role, status } = req.body;
    try {
        const account = await User.findById(req.params.id);
        if (!account) return res.status(404).json({ message: 'Không tìm thấy tài khoản!' });

        if (username) account.username = username;
        if (fullname) account.fullname = fullname;
        if (email) account.email = email;
        if (password) account.password = password;
        if (role) account.role = role;
        if (status) account.status = status;

        await account.save();

        res.json(account);
    } catch(error) {
        res.status(400).json({ message: 'Lỗi khi cập nhật tài khoản ', error });
    }
};

exports.deleteAccount = async (req, res) => {
    try {
        const account = await User.findByIdAndDelete(req.params.id);
        if (!account) return res.status(404).json({ message: 'Không tìm thấy tài khoản!' });
        res.json({ message: 'Xóa tài khoản thành công' });
    } catch (error) {
        res.status(400).json({ message: 'Lỗi khi xóa tài khoản', error });
    }
}

exports.updateAvatarFullname = async (req, res) => {
    const { userId } = req.params;
    const { avatar, fullname } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'ID không hợp lệ.' });
    }    

    // Kiểm tra dữ liệu đầu vào
    if (!avatar && !fullname) {
        return res.status(400).json({ message: 'Vui lòng cung cấp avatar hoặc fullname để cập nhật.' });
    }

    try {
        const update = {};

        
        if (avatar) update.avatar = avatar;
        if (fullname) update.fullname = fullname;

        const account = await User.findByIdAndUpdate(userId, update, { new: true }).select(['_id', 'username', 'fullname', 'email', 'role', 'avatar', 'createdAt']);
        if (!account) return res.status(404).json({ message: 'No account found' });
        res.json(account);
    } catch(error) {
        res.status(400).json({ message: 'Error updating account', error });
    }
};

exports.updateUsernamePassword = async (req, res) => {
    const { userId } = req.params;
    const { username, password } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'ID không hợp lệ.' });
    }    

    // Kiểm tra dữ liệu đầu vào
    if (!username && !password) {
        return res.status(400).json({ message: 'Tên tài khoản hoặc mật khẩu không được trống.' });
    }

    try {
        const update = {};

        if (username) update.username = username;
        if (password) update.password = password;

        // const account = await User.findByIdAndUpdate(userId, update, { new: true }).select(['_id', 'email', 'emailVerified', 'username', 'fullname', 'role', 'avatar', 'createdAt', 'googleId', 'password']);
        const account = await User.findById(userId);
        if (!account) return res.status(404).json({ message: 'No account found' });

        account.username = username;
        account.password = password;
        await account.save();

        res.json({ message: 'Đã cập nhật thông tin đăng nhập.' });
    } catch(error) {
        res.status(400).json({ message: 'Error updating account', error });
    }
}

exports.changePassword = async (req, res) => {
    const { userId } = req.params;
    const { oldPassword, newPassword } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'ID không hợp lệ.' });
    }

    if (!oldPassword || !newPassword) {
        return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin.' });
    }

    try {
        const account = await User.findById(userId);
        if (!account) return res.status(404).json({ message: 'Không tìm thấy tài khoản.' });

        const isMatch = await account.comparePassword(oldPassword);

        if (!isMatch) {
            return res.status(400).json({ message: 'Mật khẩu cũ không chính xác.' });
        }

        account.password = newPassword;
        await account.save();

        res.json({ message: 'Đã cập nhật mật khẩu.' });

    } catch(error) {
        res.status(400).json({ message: 'Xảy ra lỗi khi cập nhật mật khẩu.', error });
    }
}
