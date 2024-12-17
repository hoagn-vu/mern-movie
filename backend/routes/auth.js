const express = require("express");
const passport = require("passport");
const router = express.Router();

// Route bắt đầu quá trình login
router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

// Route nhận callback từ Google
router.get(
    "/google/callback",
    passport.authenticate("google", { session: false }),
    (req, res) => {
    const { user, accessToken, refreshToken } = req.user;
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // res.json({
    //     message: "Login successful",
    //     user: {
    //         _id: user._id,
    //         fullname: user.fullname,
    //         email: user.email,
    //         avatar: user.avatar,
    //     },
    //     accessToken,
    // });
    res.redirect(`http://localhost:3000?accessToken=${accessToken}&userId=${user._id}`);
}
);

// Route logout
router.get("/logout", (req, res) => {
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out successfully" })
});

module.exports = router;
