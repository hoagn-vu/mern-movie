const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
      if (!user) return res.status(400).json({ message: 'Invalid credentials' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

      // const token = jwt.sign(
      //   { userId: user._id },
      //   process.env.JWT_SECRET,
      //   { expiresIn: rememberMe ? '7d' : '1m' }
      // );

      // Trong login controller
const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1m' });
const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

res.json({ token, refreshToken });


      // res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
      // res.json({ token });
    } catch (error) {
      res.status(500).json({ message: 'Error logging in user: ', error });
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

