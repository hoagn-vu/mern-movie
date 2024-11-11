const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const accountRoutes = require('./routes/accountRoutes');

dotenv.config();
const app = express();
app.use(cors({
    origin: "http://localhost:3000", // Đảm bảo đường dẫn chính xác tới frontend
    credentials: true, // Cho phép gửi cookie từ frontend
  }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/account', accountRoutes);

const PORT = process.env.PORT || 5001;

connectDB()
.then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
.catch(err => console.log(err));
