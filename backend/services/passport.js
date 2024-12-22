const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");
const jwt = require("jsonwebtoken");

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:5001/auth/google/callback",
            // passReqToCallback: true, // Cho phép truyền req vào callback
            prompt: "select_account", // Yêu cầu chọn tài khoản
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                if (!profile || !profile.id) {
                    return done(new Error("Invalid Google profile"), null);
                }

                // Tìm kiếm user dựa trên googleId
                let user = await User.findOne({ googleId: profile.id });

                if (!user) {
                    user = await User.findOne({ email: profile.emails?.[0]?.value });
                    if (user) {
                        user.googleId = profile.id;
                        await user.save();
                    } else {
                        // Nếu user chưa tồn tại, tạo mới
                        user = await User.create({
                            googleId: profile.id,
                            fullname: profile.displayName,
                            email: profile.emails?.[0]?.value || `${profile.id}@google.com`,
                            emailVerified: true,
                            avatar: profile.photos?.[0]?.value || "https://i.imgur.com/0ODZkGf.png",
                        });
                    }
                }

                const userId = user._id;
                const accessToken = jwt.sign(
                    { userId },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
                );

                const refreshToken = jwt.sign(
                    { userId },
                    process.env.REFRESH_TOKEN_SECRET,
                    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
                );

                done(null, { user, accessToken, refreshToken });
            } catch (error) {
                console.error("Lỗi khi đăng nhập Google OAuth", error);
                done(error, null);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        if (!user) return done(new Error("User not found"), null);
        done(null, user);
    } catch (error) {
        console.error("Error deserializing user", error);
        done(error, null);
    }
});
