const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const historySchema = new mongoose.Schema({
    movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
    progress: [{
        timeWatched: { type: Number, default: 0 },
        at: { type: Date, default: Date.now, required: true },
    }],
});

// const UserSchema = new mongoose.Schema({
//     username: { type: String, unique: true },
//     fullname: { type: String, required: true },
//     email: { type: String, unique: true },
//     password: { type: String },
//     status: { type: String, default: 'active', required: true },
//     role: { type: String, default: 'User', required: true },
//     favoriteList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie', default: [] }],
//     history: { type: [historySchema], default: [] },
//     googleId: { type: String },
//     avatar: { type: String, default: 'https://i.imgur.com/YemEHhw.png' },
// }, { timestamps: true });
const UserSchema = new mongoose.Schema({
    username: { type: String, sparse: true }, // Không bắt buộc vì Google users có thể không cần
    fullname: { type: String, required: true },
    email: { type: String, sparse: true, default: undefined  }, // Đảm bảo unique nhưng không lỗi khi null
    emailVerified: { type: Boolean, default: false },
    password: { type: String },
    status: { type: String, default: "active", required: true },
    role: { type: String, default: "User", required: true },
    favoriteList: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie", default: [] }],
    history: { type: [historySchema], default: [] },
    googleId: { type: String, unique: true, sparse: true }, // Google ID cho OAuth2
    avatar: {
        type: String,
        default: "https://i.imgur.com/0ODZkGf.png",
    },
    otp: {
        code: { type: String },
        expiredAt: { type: Date },
    },
}, { timestamps: true });

UserSchema.pre('save', async function(next) {
    // if (role.toLowerCase() === 'admin') {
    //     this.avatar = 'https://i.imgur.com/uS19Xv3.png';
    // }

    // // Kiểm tra unique email
    // const email = await this.model('User').findOne({ email: this.email });
    // if (email) {
    //     throw new Error('Email đã tồn tại');
    // }

    // // Kiểm tra unique username
    // const username = await this.model('User').findOne({ username: this.username });
    // if (username) {
    //     throw new Error('Tên tài khoản đã tồn tại');
    // }

    if (this.googleId) {
        this.emailVerified = true;
    }

    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);

    next();
});

UserSchema.methods.comparePassword = function(password) {
    return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);
