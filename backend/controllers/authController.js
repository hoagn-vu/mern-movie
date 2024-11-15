const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { fileURLToPath } = require('url');

exports.register = async (req, res) => {
    const { username, email, password } = req.body;
    
    const isValidUsername = Boolean(await User.findOne({ username }));
    const isValidEmail = Boolean(await User.findOne({ email }));
    if (isValidUsername) return res.status(400).json({ message: 'Username already exists' });
    if (isValidEmail) return res.status(400).json({ message: 'Email already exists' });

    try {
      const user = new User({ username, email, password, role: 'User' });
      await user.save();
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      res.status(400).json({ message: 'Error registering user', error });
    }
};

exports.login = async (req, res) => {
  const { email, password, rememberMe } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid password' })

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
  
      res.json({ accessToken });
  } catch (error) {
      res.status(400).json({ error: error.message });
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
      res.json({ message: "Logged out" });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select(['-password', '-createdAt', '-updatedAt', '-__v']);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
        console.log("User profile sent");
    } catch (error) {
        res.status(500).json({ message: 'Error getting user profile', error });
    }
};

