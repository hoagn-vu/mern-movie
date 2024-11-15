const { ListObjectsCommand, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const s3 = require('../config/awsConfig');
const mongoose = require('mongoose');

const Movie = require('../models/Movie');
const movieService = require('../services/movieService');

// Upload file (đã được xử lý qua multer middleware)
exports.uploadMovie = async (req, res) => {
    if (!req.files || !req.files.movie || !req.files.banner || !req.files.poster) {
        return res.status(400).send('Movie, banner and poster are required.');
    }

    // // Lấy URL từ S3 của từng file đã upload
    // const videoUrl = req.files.movie[0].location;
    // const bannerUrl = req.files.banner[0].location;
    // const posterUrl = req.files.poster[0].location;

    // Lưu thông tin video vào MongoDB
    const { mainTitle, subTitle, description, releaseYear, country, genres, directors, casts } = req.body;
    
    try {
        const newMovie = await movieService.uploadMovie({
            mainTitle,
            subTitle,
            releaseYear,
            country,
            description,
            genres: genres.split(','),
            directors: directors.split(','),
            casts: casts.split(','),
            createAt: Date.now(),
            status: 'Available'
        });
        await newMovie.save();
        res.status(200).send({
            message: 'Successfully uploaded video and images'
            // videoUrl,
            // bannerUrl,
            // posterUrl
        });
    } catch (error) {
        console.error('Error saving video to MongoDB:', error);
        res.status(500).send('Error saving video to MongoDB');
    }
};

// Lấy danh sách video từ MongoDB
exports.getVideos = async (req, res) => {
    const cloudfrontBaseUrl = process.env.CLOUDFRONT_URL;
    try {
        const movies = await Movie.find();

        // Tạo một mảng mới có thêm trường cloudfrontBaseUrl cho mỗi video
        const moviesWithUrl = movies.map(mov => ({
            ...mov._doc, // Sao chép các trường của video từ MongoDB
            cloudfrontUrl: `${cloudfrontBaseUrl}/movies/${mov.source.folderName}/${mov.source.videoName}` // Thêm URL CloudFront
        }));

        res.json(moviesWithUrl);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching videos' });
    }
};
