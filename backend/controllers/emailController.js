const nodemailer = require('nodemailer');
const User = require('../models/User');
const dayjs = require('dayjs');
const { transporterConfig } = require('../config/nodemailerConfig');

exports.sendEmail = async (req, res) => {
  const { email, subject, content } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email and code are required!' });
  }

  try {
    const transporter = nodemailer.createTransport(transporterConfig);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: subject || '[Lovie] Thông báo',
      text: content,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending email', error: error.message });
  }
};

exports.sendOTPForVerify = async (req, res) => {
  const { email, subject } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email không xác định!' });
  }

  const code = Math.random().toString(36).substring(2, 8).toUpperCase();
  const expiredAt = dayjs().add(15, 'minute').toDate();

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng!' });
    }

    user.otp = { code, expiredAt };
    await user.save();

    const transporter = nodemailer.createTransport(transporterConfig);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: subject || '[Lovie] Xác thực tài khoản',
      text: `Mã xác thực của bạn là: ${code} \n\nMã xác thực sẽ hết hạn vào ${expiredAt}`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: `Đã gửi OTP đến ${email}!` });
  } catch (error) {
    res.status(500).json({ message: `Xảy ra lỗi khi gửi OTP!`, error: error.message });
  }
};

exports.sendOTPForResetPassword = async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ message: 'Tên tài khoản không tồn tại!' });
  }

  const code = Math.random().toString(36).substring(2, 8).toUpperCase();
  const expiredAt = dayjs().add(15, 'minute').toDate();

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng!' });
    }

    user.otp = { code, expiredAt };
    await user.save();

    const transporter = nodemailer.createTransport(transporterConfig);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: '[Lovie] Đặt lại mật khẩu',
      text: `Mã xác thực của bạn là: ${code} \n\nMã xác thực sẽ hết hạn vào ${expiredAt}`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: `Đã gửi OTP đến ${user.email}!`, email: user.email });
  } catch (error) {
    res.status(500).json({ message: `Xảy ra lỗi khi gửi OTP!`, error: error.message });
  }
};
