const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const accountRoutes = require('./routes/accountRoutes');

const genreRoutes = require('./routes/genreRoutes');
const directorRoutes = require('./routes/directorRoutes');
const actorRoutes = require('./routes/actorRoutes');
const movieRoutes = require('./routes/moviesRoutes');
const emailRoutes = require('./routes/emailRoutes');

dotenv.config();
const session = require("express-session");
const passport = require("passport");
require("./services/passport");

const app = express();
app.use(cors({
  origin: "http://localhost:3000", // Đảm bảo đường dẫn chính xác tới frontend
  credentials: true, // Cho phép gửi cookie từ frontend
}));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());

app.use(
  session({
    secret: "your-secret-key-session",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/account', accountRoutes);

app.use('/api/genres', genreRoutes);
app.use('/api/directors', directorRoutes);
app.use('/api/actors', actorRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/email', emailRoutes);

const googleAuthRoutes = require("./routes/auth");
app.use("/auth", googleAuthRoutes);

const PORT = process.env.PORT || 5001;

connectDB()
.then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
.catch(err => console.log(err));
