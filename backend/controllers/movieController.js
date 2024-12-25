const { DeleteObjectCommand, HeadObjectCommand } = require('@aws-sdk/client-s3');
const s3 = require('../config/awsConfig');
const mongoose = require('mongoose');

const Movie = require('../models/Movie');
const Genre = require('../models/Genre');
const Director = require('../models/Director');
const Cast = require('../models/Actor');
const User = require('../models/User');
const movieService = require('../services/movieService');
// const e = require('express');

// Upload file (đã được xử lý qua multer middleware)
exports.uploadMovie = async (req, res) => {
    if (!req.files || !req.files.movie || !req.files.banner || !req.files.poster) {
        return res.status(400).send('Movie, banner and poster are required.');
    }

    const { mainTitle, subTitle, description, releaseDate, duration, country, genres, directors, casts } = req.body;
    
    try {
        const newMovie = await movieService.uploadMovie({
            mainTitle,
            subTitle,
            releaseDate: new Date(releaseDate),
            duration,
            country,
            description,
            genres: genres.split(','),
            directors: directors.split(','),
            casts: casts.split(','),
            status: 'available'
        });
        await newMovie.save();
        const movie = await Movie.findById(newMovie._id).select(['-__v', '-userActivity']);
        // console.log('movie return:', movie);
        res.status(200).send({
            message: 'Đăng tải phim thành công',
            movie
        });
    } catch (error) {
        console.error('Error saving video to MongoDB:', error);
        res.status(500).send('Error saving video to MongoDB');
    }
};

exports.editMovie = async (req, res) => {
    const { movieId } = req.params;
    const { mainTitle, subTitle, description, releaseDate, duration, country, genres, directors, casts, source } = req.body;

    if (!source) return res.status(400).json({ message: 'Source is required' });

    if (req.files && req.files.movie) {
        console.log('New movie ready to upload');
        // await s3.send(new DeleteObjectCommand({ Bucket: process.env.AWS_BUCKET_NAME, Key: `movies/${source}/movie` }));
        // console.log('Deleted movie file');
    }
    if (req.files && req.files.banner) {
        console.log('New banner ready to upload');
        // await s3.send(new DeleteObjectCommand({ Bucket: process.env.AWS_BUCKET_NAME, Key: `movies/${source}/banner` }));
        // console.log('Deleted banner file');
    }
    if (req.files && req.files.poster) {
        console.log('New poster ready to upload');
        // await s3.send(new DeleteObjectCommand({ Bucket: process.env.AWS_BUCKET_NAME, Key: `movies/${source}/poster` }));
        // console.log('Deleted poster file');
    }

    try {
        const movie = await Movie.findById(movieId).select(['-__v', '-userActivity']);
        if (!movie) return res.status(404).json({ message: 'Không tìm thấy phim!' });

        movie.mainTitle = mainTitle ? mainTitle : movie.mainTitle;
        movie.subTitle = subTitle ? subTitle : movie.subTitle;
        movie.description = description ? description : movie.description;
        movie.releaseDate = releaseDate ? new Date(releaseDate) : movie.releaseDate;
        movie.duration = duration ? duration : movie.duration;
        movie.country = country ? country : movie.country;
        movie.genres = genres ? genres.split(',') : movie.genres;
        movie.directors = directors ? directors.split(',') : movie.directors;
        movie.casts = casts ? casts.split(',') : movie.casts;
        
        await movie.save();
        res.json({ message: 'Cập nhật phim thành công', movie });
    } catch (error) {
        console.error('Error updating movie:', error);
        res.status(500).json({ message: 'Error updating movie' });
    }
};





exports.deleteMovie = async (req, res) => {
    const { movieId } = req.params;

    try {
        const movie = await Movie.findById(movieId);
        if (!movie) return res.status(404).json({ message: 'Không tìm thấy phim!' });

        movie.status = 'deleted';
        await movie.save();
        res.json({ message: 'Phim đã được xóa' });
    } catch (error) {
        console.error('Error deleting movie:', error);
        res.status(500).json({ message: 'Error deleting movie' });
    }
};




const convertIdToName = async (movie, field, model) => {
    if (movie[field] && Array.isArray(movie[field])) {
        const promises = movie[field].map(id => model.findById(id));
        const results = await Promise.all(promises);
        movie[field] = results.map(result => result?.name || 'Unknown');
    }
};

const convertIdToUserName = async (movie, model) => {
    if (movie.userActivity && Array.isArray(movie.userActivity)) {
        const promises = movie.userActivity.map(activity => model.findById(activity.userId));
        const results = await Promise.all(promises);
        // Gán username vào từng phần tử của userActivity
        movie.userActivity.forEach((activity, index) => {
            // activity.username = results[index]?.username || 'Unknown';
            activity.fullname = results[index]?.fullname || 'Unknown';
            activity.avatar = results[index]?.avatar || 'Unknown';
            activity.role = results[index]?.role || 'Unknown';
        });
    }
};

exports.getMovieById = async (req, res) => {
    try {
        const movieId = req.params.id;
        const movie = await Movie.find({ _id: movieId, status: 'Available' }).lean();

        if (!movie) return res.status(404).json({ message: 'Không tìm thấy phim!' });

        // Chuyển đổi các trường thành tên
        await convertIdToName(movie, 'genres', Genre);
        await convertIdToName(movie, 'directors', Director);
        await convertIdToName(movie, 'casts', Cast);
        await convertIdToUserName(movie, User);

        res.json(movie);
    } catch (err) {
        console.error('Error fetching movie:', err.message);
        res.status(500).json({ message: 'Error fetching movie' });
    }
};

exports.getMoviesByIds = async (req, res) => {
    try {
        const movies = await Movie.find({ _id: { $in: req.body.ids, status: 'Available' } }).select(['_id', 'mainTitle', 'subTitle']).lean();
        if (!movies) return res.status(404).json({ message: 'Movies not found' });

        res.json(movies);
    } catch (err) {
        console.error('Error fetching movies:', err.message);
        res.status(500).json({ message: 'Error fetching movies' });
    }
};

const checkFavorite = async (userId, movieId) => {
    const user = await User.findOne({ _id: userId, favoriteList: movieId });
    return Boolean(user);
};
exports.getMovieToWatch = async (req, res) => {
    // console.log('check req.params getMovieToWatch:', req.params);
    try {
        const { userId, movieId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(userId) || !userId) {
            return res.status(400).json({ message: 'Id người dùng không hợp lệ!' });
        }

        if (!mongoose.Types.ObjectId.isValid(movieId) || !movieId) {
            return res.status(400).json({ message: 'Ib phim không hợp lệ!' });
        }
        
        const movie = await Movie.findById(movieId).lean();
        if (!movie) return res.status(404).json({ message: 'Không tìm thấy phim!' });

        // Chuyển đổi các trường thành tên
        await convertIdToName(movie, 'genres', Genre);
        await convertIdToName(movie, 'directors', Director);
        await convertIdToName(movie, 'casts', Cast);
        await convertIdToUserName(movie, User);

        // Thêm trường isFavorite
        const isFavorite = await checkFavorite(userId, movieId);

        res.json({ ...movie, isFavorite });
    } catch (err) {
        console.error('Error fetching movie:', err.message);
        res.status(500).json({ message: 'Error fetching movie' });
    }
};


exports.getAllMovies = async (req, res) => {
    try {
        const movies = await Movie.find({ status: { $ne: 'deleted' } }).sort({ _id: -1 }).select(['-__v', '-userActivity']);

        res.json(movies);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching videos' });
    }
};

exports.getSomeMovies = async (req, res) => {
    try {
        const movies = await Movie.find({ status: 'Available' }).limit(15);
        res.json(movies);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching videos' });
    }
};

exports.getPromotedMovies = async (req, res) => {
    try {
        const promotedMovies = await Movie.find({
            'promote.isPromote': true,
            'promote.startDate': { $lte: new Date() },
            'promote.endDate': { $gte: new Date() },
            status: 'Available'
        })
        .select(['_id', 'mainTitle', 'subTitle', 'source', 'promote', 'genres', 'releaseDate'])
        .lean();

        let movies = [...promotedMovies];

        if (movies.length < 10) {
            const additionalMovies = await Movie.find({
                status: 'Available',
                _id: { $nin: movies.map(movie => movie._id) }
            })
            .sort({ releaseDate: -1 })
            .limit(10 - movies.length)
            .lean();

            movies.push(...additionalMovies);
        }

        await Promise.all(movies.map(movie => convertIdToName(movie, 'genres', Genre)));

        res.json(movies);
    } catch (err) {
        console.error('Lỗi khi lấy danh sách phim được nổi bật:', err);
        res.status(500).json({ message: 'Lỗi khi lấy danh sách phim được thiết lập nổi bật' });
    }
};

exports.setPromote = async (req, res) => {
    const { movieId } = req.params;
    const { isPromote, startDate, endDate } = req.body;

    try {
        const movie = await Movie.findById(movieId);
        if (!movie) return res.status(404).json({ message: 'Không tìm thấy phim' });

        movie.promote.isPromote = isPromote;
        movie.promote.startDate = startDate;
        movie.promote.endDate = endDate;

        await movie.save();
        res.json({ message: 'Thiết lập nổi bật phim thành công' });
    } catch (error) {
        console.error('Error setting movie promote:', error);
        res.status(500).json({ message: 'Lỗi khi thiết lập nổi bật phim' });
    }
};

exports.getSomeNewestMovies = async (req, res) => {
    try {
        const movies = await Movie.find({ status: 'Available' }).sort({ releaseDate: -1, createAt: -1 }).limit(8).lean();
        for (const movie of movies) {
            await convertIdToName(movie, 'genres', Genre);
        }
        res.json(movies);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching videos' });
    }
}

exports.searchMovies = async (req, res) => {
    try {
        const { titleSearch, genreIdSearch, yearSearch, nationSearch } = req.body;

        const query = { status: 'Available' };
        if (titleSearch) {
            query.$or = [
                { mainTitle: { $regex: titleSearch, $options: 'i' } },
                { subTitle: { $regex: titleSearch, $options: 'i' } }
            ];
        }
        if (genreIdSearch) {
            query.genres = { $in: [genreIdSearch] };
        }
        if (yearSearch) {
            const startOfYear = new Date(yearSearch, 0, 1);
            const endOfYear = new Date(yearSearch + 1, 0, 1);
            query.releaseDate = { $gte: startOfYear, $lt: endOfYear };
        }
        if (nationSearch) {
            query.country = { $regex: nationSearch, $options: 'i' };
        }

        const moviesSearch = await Movie.find(query).sort({ releaseDate: -1 }).lean();

        for (const movie of moviesSearch) {
            await convertIdToName(movie, 'genres', Genre);
        }
        res.json(moviesSearch);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching movies', error: err.message });
    }
};

exports.getMoviesByGenre = async (req, res) => {
    try {
        const genreToSearch = req.params.genreToSearch;
        const genre = await Genre.findOne({ name: genreToSearch });

        if (!genre) {
            return res.status(404).json({ message: 'Genre not found' });
        }

        const movies = await Movie.find({ genres: genre._id, status: 'Available' }).select(['_id', 'mainTitle', 'source']);
        res.json(movies);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching movies', error: err.message });
    }
};

exports.getMoviesByNation = async (req, res) => {
    try {
        const nationToSearch = req.params.nationToSearch;
        const movies = await Movie.find({ country: nationToSearch, status: 'Available' }).select(['_id', 'mainTitle', 'source']);
        res.json(movies);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching movies', error: err.message });
    }
};

// Recomdend movie bằng thể loại phim thường xem qua lịch sử xem
exports.recommendMovies = async (req, res) => {
    try {
        const { userId } = req.params;

        // Lấy lịch sử từ user
        const user = await User.findById(userId).select("history");
        if (!user || !user.history || user.history.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy lịch sử xem phim" });
        }

        // Tạo object để đếm số lần xem của từng thể loại và diễn viên
        const genreCount = {};
        const castCount = {};

        // Lấy danh sách các movieId từ history
        const movieIds = user.history.map(item => item.movieId);

        // Lấy thông tin các movie từ database
        const movies = await Movie.find({ _id: { $in: movieIds } }).select(["genres", "casts"]);

        // Đếm số lần xuất hiện của từng thể loại và diễn viên
        movies.forEach(movie => {
            movie.genres.forEach(genreId => {
                genreCount[genreId] = (genreCount[genreId] || 0) + 1;
            });
            movie.casts.forEach(castId => {
                castCount[castId] = (castCount[castId] || 0) + 1;
            });
        });

        // Sắp xếp và lấy tối đa 3 thể loại và 3 diễn viên được xem nhiều nhất
        const topGenres = Object.entries(genreCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(entry => new mongoose.Types.ObjectId(entry[0]));

        const topCasts = Object.entries(castCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(entry => new mongoose.Types.ObjectId(entry[0]));

        // Tìm phim có cùng nhiều thể loại hoặc diễn viên nhất
        const recommendedMovies = await Movie.find({
            $or: [
                { genres: { $in: topGenres } },
                { casts: { $in: topCasts } }
            ],
            _id: { $nin: movieIds } // Loại bỏ các phim đã xem
        // }).select("title genres casts");
        }).select(['_id', 'mainTitle', 'source']);

        // Sắp xếp ưu tiên phim trùng nhiều thể loại hơn (giới hạn 15 phần tử)
        const sortedMovies = recommendedMovies.sort((a, b) => {
            const aGenreMatch = Array.isArray(a.genres) ? a.genres.filter(genre => topGenres.includes(genre)).length : 0;
            const bGenreMatch = Array.isArray(b.genres) ? b.genres.filter(genre => topGenres.includes(genre)).length : 0;
        
            if (aGenreMatch !== bGenreMatch) {
                return bGenreMatch - aGenreMatch; // Ưu tiên trùng nhiều thể loại hơn
            }
        
            const aCastMatch = Array.isArray(a.casts) ? a.casts.filter(cast => topCasts.includes(cast)).length : 0;
            const bCastMatch = Array.isArray(b.casts) ? b.casts.filter(cast => topCasts.includes(cast)).length : 0;
        
            return bCastMatch - aCastMatch; // Nếu bằng nhau thì xét số diễn viên trùng
        }).slice(0, 15);
        
        res.status(200).json( sortedMovies );
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};





exports.updateInforMovie = async (req, res) => {
    const { mainTitle, subTitle, description, releaseDate, country, genres, directors, casts, status } = req.body;

    try {
        const update = {};
        if (mainTitle) update.mainTitle = mainTitle;
        if (subTitle) update.subTitle = subTitle;
        if (description) update.description = description;
        if (releaseDate) update.releaseDate = releaseDate;
        if (country) update.country = country;
        if (genres) update.genres = genres;
        if (directors) update.directors = directors;
        if (casts) update.casts = casts;
        if (status) {
            if (status !== 'Available') {
                update.promote = { isPromote: false, startDate: null, endDate: null };
            }
            update.status = status;
        }

        const movie = await Movie.findByIdAndUpdate(req.params.id, update, { new: true });
        // const movie = await Movie.findByIdAndUpdate(req.params.id, { mainTitle, subTitle, description, releaseDate, country, genres, directors, casts, status }, { new: true });
        if (!movie) return res.status(404).json({ message: 'Không tìm thấy phim!' });
        res.json(movie);
    }
    catch (error) {
        res.status(400).json({ message: 'Lỗi khi cập nhật thông tin phim!', error });
    }
}

exports.addComment = async (req, res) => {
    try {
        const { movieId } = req.params;
        const { userId, content } = req.body;

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Id không hợp lệ' });
        }
        if (!content || typeof content !== 'string' || content.trim() === '') {
            return res.status(400).json({ message: 'Content cannot be empty' });
        }

        const movie = await Movie.findById(movieId);
        if (!movie) {
            return res.status(404).json({ message: 'Không tìm thấy phim!' });
        }

        let userActivity = movie.userActivity.find(activity =>
            activity.userId.equals(userId)
        );

        if (!userActivity) {
            // Thêm mới userActivity
            movie.userActivity.push({
                userId,
                comment: [{ content, createAt: new Date() }],
            });
        } else {
            // Thêm comment vào mảng đã có
            userActivity.comment.push({ content, createAt: new Date() });
        }

        await movie.save();
        const newComment = movie.userActivity.find(activity => activity.userId.equals(userId)).comment.slice(-1)[0];
        // console.log('newComment:', newComment);
        res.status(200).json({ message: 'Bình luận thành công!', newComment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteComment = async (req, res) => {
    try {
        const { movieId, userId, commentId } = req.params;

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Id không hợp lệ!' });
        }

        const movie = await Movie.findById(movieId);
        if (!movie) {
            return res.status(404).json({ message: 'Không tìm thấy phim!' });
        }

        const userActivity = movie.userActivity.find(activity => activity.userId.equals(userId));
        if (!userActivity) {
            return res.status(404).json({ message: 'Không tìm thấy hoạt động người dùng!' });
        }

        const commentIndex = userActivity.comment.findIndex(comment => comment._id.equals(commentId));
        if (commentIndex === -1) {
            return res.status(404).json({ message: 'Không tìm thấy bình luận!' });
        }

        userActivity.comment.splice(commentIndex, 1);
        await movie.save();
        res.status(200).json({ message: 'Xóa bình luận thành công!', movie });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.addReport = async (req, res) => {
    try {
        const { movieId } = req.params;
        const { userId, content } = req.body;

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Id không hợp lệ' });
        }
        if (!content || typeof content !== 'string' || content.trim() === '') {
            return res.status(400).json({ message: 'Nội dung không được để trống' });
        }

        const movie = await Movie.findById(movieId);
        if (!movie) {
            return res.status(404).json({ message: 'Không tìm thấy phim!' });
        }

        let userActivity = movie.userActivity.find(activity =>
            activity.userId.equals(userId)
        );

        if (!userActivity) {
            // Thêm mới userActivity
            movie.userActivity.push({
                userId,
                report: [{ content, createAt: new Date() }],
            });
        } else {
            // Thêm report vào mảng đã có
            userActivity.report.push({ content, createAt: new Date() });
        }

        await movie.save();
        res.status(200).json({ message: 'Report added successfully', movie });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getAllReports = async (req, res) => {
    try {
        const movies = await Movie.find(); // Lấy danh sách tất cả phim

        // Truy vấn tất cả user trước
        const userIds = movies
            .flatMap(movie => movie.userActivity?.map(activity => activity.userId) || []);
        const uniqueUserIds = [...new Set(userIds)]; // Loại bỏ trùng lặp
        const users = await User.find({ _id: { $in: uniqueUserIds } }).select('username fullname email');
        
        // Tạo map để tra cứu nhanh
        const userMap = new Map(users.map(user => [user._id.toString(), { 
            username: user.username, 
            fullname: user.fullname,
            email: user.email
        }]));

        // Xử lý dữ liệu
        const reports = [];
        movies.forEach(movie => {
            movie.userActivity?.forEach(activity => {
                activity.report?.forEach(report => {
                    const user = userMap.get(activity.userId.toString());
                    reports.push({
                        movieId: movie._id,
                        movieTitle: movie.mainTitle,
                        userId: activity.userId,
                        username: user?.username || null,
                        fullname: user?.fullname || null,
                        email: user?.email || null,
                        reportId: report._id,
                        content: report.content,
                        createAt: report.createAt,
                        status: report.status,
                    });
                });
            });
        });

        res.json(reports); // Trả về danh sách báo cáo
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.changeStatusReport = async (req, res) => {
    try {
        const { movieId, userId, reportId } = req.params;
        const { status } = req.body;

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Id không hợp lệ' });
        }

        const movie = await Movie.findById(movieId);
        if (!movie) {
            return res.status(404).json({ message: 'Không tìm thấy phim!' });
        }

        const userActivity = movie.userActivity.find(activity => activity.userId.equals(userId));
        if (!userActivity) {
            return res.status(404).json({ message: 'Không tìm thấy hoạt động người dùng!' });
        }

        const reportIndex = userActivity.report.findIndex(report => report._id.equals(reportId));
        if (reportIndex === -1) {
            return res.status(404).json({ message: 'Không tìm thấy báo cáo!' });
        }

        userActivity.report[reportIndex].status = status;
        await movie.save();
        res.status(200).json({ message: 'Trạng thái báo cáo đã được cập nhật!', userActivity });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


exports.rateMovie = async (req, res) => {
    try {
        const { movieId } = req.params;
        const { userId, rate } = req.body;

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Id không hợp lệ' });
        }
        if (!rate || typeof rate !== 'number' || rate < 1 || rate > 5) {
            return res.status(400).json({ message: 'Invalid rate' });
        }

        // Kiểm tra role admin không được rate
        const userRole = await User.findById(userId).select('role');
        if (!userRole || userRole === 'admin') {
            return res.status(403).json({ message: 'Không thể đánh giá!' });
        }

        const movie = await Movie.findById(movieId);
        if (!movie) {
            return res.status(404).json({ message: 'Không tìm thấy phim!' });
        }

        const userActivityIndex = movie.userActivity.findIndex(activity => activity.userId.equals(userId));

        if (userActivityIndex === -1) {
            // Thêm mới
            movie.userActivity.push({ userId, rate });
        } else {
            // Cập nhật
            movie.userActivity[userActivityIndex].rate = rate;
        }

        await movie.save();

        res.status(200).json({
            message: 'Rate added successfully',
            userActivity: { userId, rate },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.toggleFavorite = async (req, res) => {
    try {
        const { userId, movieId } = req.params;

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Id không hợp lệ' });
        }

        if (!movieId || !mongoose.Types.ObjectId.isValid(movieId)) {
            return res.status(400).json({ message: 'Invalid movieId' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isFavorite = user.favoriteList.includes(movieId);

        const updateOperation = isFavorite
            ? { $pull: { favoriteList: movieId } }
            : { $addToSet: { favoriteList: movieId } };

        const updatedUser = await User.findByIdAndUpdate(userId, updateOperation, { new: true });

        const message = isFavorite
            ? 'Đã xóa khỏi danh sách yêu thích'
            : 'Đã thêm vào danh sách yêu thích';

        res.status(200).json({ message, favoriteList: updatedUser.favoriteList });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error when toggling movie in favorite list' });
    }
};

exports.removeFavorites = async (req, res) => {
    try {
        const { userId } = req.params;
        const { movieIds } = req.body;

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Id không hợp lệ' });
        }

        if (!movieIds || !Array.isArray(movieIds) || movieIds.length === 0) {
            return res.status(400).json({ message: 'Invalid movieIds' });
        }

        const updatedUser = await User.findByIdAndUpdate(userId, { $pull: { favoriteList: { $in: movieIds } } }, { new: true });

        res.status(200).json({ message: 'Favorite list updated', favoriteList: updatedUser.favoriteList });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getFavoriteList = async (req, res) => {
    try {
        const { userId } = req.params;

        // Kiểm tra userId hợp lệ
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Id không hợp lệ' });
        }

        // Tìm user và chỉ lấy favoriteList
        const user = await User.findById(userId).select('favoriteList');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Kiểm tra nếu favoriteList rỗng
        if (!user.favoriteList || user.favoriteList.length === 0) {
            return res.json({ favoriteList: [] });
        }

        // Lấy danh sách movieId từ favoriteList
        const movieIds = user.favoriteList.reverse();

        // Truy vấn tất cả các phim theo movieId
        let movies = await Movie.find({ _id: { $in: movieIds }, status: 'Available' }).select(['_id', 'mainTitle', 'subTitle']);

        // Sắp xếp lại thứ tự của movies theo thứ tự trong movieIds
        movies = movies.sort((a, b) => movieIds.indexOf(a._id.toString()) - movieIds.indexOf(b._id.toString()));

        // Tạo danh sách kết quả
        const favoriteList = movies.map((movie) => ({
            movieId: movie?._id || '',
            mainTitle: movie?.mainTitle || '',
            source: movie?.source || movie.subTitle.replace(/\s+/g, '-'),
        }));

        // Trả về kết quả
        res.json( favoriteList );
    } catch (error) {
        console.error('Lỗi khi lấy danh sách yêu thích:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


exports.saveWatchHistory = async (req, res) => {
    // console.log('- test check req.body saveWatchHistory:', req.body);
    try {
        const { userId, movieId, timeWatched } = req.body;

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Id không hợp lệ' });
        }

        if (!movieId || !mongoose.Types.ObjectId.isValid(movieId)) {
            return res.status(400).json({ message: 'Invalid movieId' });
        }

        if (!timeWatched || typeof timeWatched !== 'number' || timeWatched < 0) {
            return res.status(400).json({ message: 'Invalid timeWatched' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const existingHistory = user.history.find(
            (item) => item.movieId.toString() === movieId
        );

        if (existingHistory) {
            // Nếu tồn tại, thêm progress mới vào mảng progress
            existingHistory.progress.push({ timeWatched });
        } else {
            // Nếu không, thêm mới vào history
            user.history.push({
                movieId: movieId,
                progress: [{ timeWatched }],
            });
        }

        await user.save();

        res.status(200).json({ message: 'Watch history saved successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// exports.getWatchHistory = async (req, res) => {
//     try {
//         const { userId } = req.params;

//         // Kiểm tra userId hợp lệ
//         if (!mongoose.Types.ObjectId.isValid(userId)) {
//             return res.status(400).json({ message: 'Id không hợp lệ' });
//         }

//         // Tìm user và chỉ lấy lịch sử xem
//         const user = await User.findById(userId).select('history');
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         // Lấy danh sách movieId từ history
//         const movieIds = user.history.map((item) => item.movieId);

//         // Truy vấn tất cả các phim theo movieId
//         const movies = await Movie.find({ _id: { $in: movieIds } }).select(['_id', 'mainTitle', 'subTitle', 'duration']);

//         // Tạo danh sách lịch sử xem
//         const watchHistory = user.history.map((item) => {
//             // Lấy lần xem mới nhất trong progress
//             const latestProgress = item.progress.sort((a, b) => new Date(b.at) - new Date(a.at))[0];

//             // Tìm thông tin phim
//             const movie = movies.find((m) => m._id.toString() === item.movieId.toString());

//             return {
//                 movieId: item.movieId,
//                 mainTitle: movie?.mainTitle || 'Unknown Title',
//                 subTitle: movie?.subTitle || '',
//                 timeWatched: latestProgress.timeWatched,
//                 duration: movie?.duration || 0,
//                 at: latestProgress.at,
//             };
//         });

//         // Trả kết quả
//         res.status(200).json(watchHistory);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Server error' });
//     }
// };
exports.getWatchHistory = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Id không hợp lệ' });
        }

        const user = await User.findById(userId).select('history');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const movieIds = user.history.map((item) => item.movieId);

        const movies = await Movie.find({ _id: { $in: movieIds } }).select(['_id', 'mainTitle', 'subTitle', 'duration']);

        const watchHistory = user.history.flatMap((item) => {
            const groupedProgress = item.progress.reduce((acc, progress) => {
                const dateKey = new Date(progress.at).toISOString().split('T')[0];
                if (!acc[dateKey] || new Date(acc[dateKey].at) < new Date(progress.at)) {
                    acc[dateKey] = progress;
                }
                return acc;
            }, {});

            // Chuyển đổi groupedProgress thành mảng
            const filteredProgress = Object.values(groupedProgress);

            const movie = movies.find((m) => m._id.toString() === item.movieId.toString());

            // Tạo lịch sử xem cho từng ngày
            return filteredProgress.map((progress) => ({
                movieId: item.movieId,
                mainTitle: movie?.mainTitle || 'Unknown Title',
                source: movie?.source || movie.subTitle.replace(/\s+/g, '-'),
                timeWatched: progress.timeWatched,
                duration: movie?.duration || 0,
                at: progress.at,
            }));
        });

        res.status(200).json(watchHistory);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};




// exports.updateViews = async (req, res) => {
//     try {
//         const { movieId } = req.params;
//         const movie = await Movie.findByIdAndUpdate(movieId, { $inc: { views: 1 } }, { new: true });
//         if (!movie) return res.status(404).json({ message: 'Không tìm thấy phim!' });
//         res.json(movie);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Server error' });
//     }
// };

exports.statistic = async (req, res) => {
    try {
        const users = await User.find({}).select(['_id', 'history']);

        const movies = await Movie.find({});

        const movieDetails = await Promise.all(movies.map(async (movie) => {
            // Calculate average rate
            const totalRatedActivities = movie.userActivity.filter(activity => activity.rate > 0).length;
            const totalRates = movie.userActivity.reduce((acc, activity) => acc + activity.rate, 0);
            const averageRate = totalRatedActivities
                ? (totalRates / totalRatedActivities).toFixed(2)
                : 0;

            const totalComment = movie.userActivity.reduce((acc, activity) => acc + activity.comment.length, 0);

            const viewsMap = {};
            users.forEach((user) => {
                user.history
                    .filter((history) => history.movieId.toString() === movie._id.toString())
                    .forEach((history) => {
                        history.progress.forEach((progress) => {
                            if (progress.timeWatched >= 0.9 * movie.duration) {
                                const monthKey = progress.at instanceof Date
                                    ? `${progress.at.getFullYear()}-${progress.at.getMonth() + 1}`
                                    : 'Invalid Date';
                                viewsMap[monthKey] = (viewsMap[monthKey] || 0) + 1;
                            }
                        });
                    });
            });

            const viewsPerMonth = Object.keys(viewsMap).map((month) => ({
                month,
                views: viewsMap[month],
            }));

            return {
                movieId: movie._id,
                mainTitle: movie.mainTitle,
                subTitle: movie.subTitle,
                releaseDate: movie.releaseDate,
                averageRate: Number(averageRate),
                totalComment,
                viewsPerMonth,
                source: movie.source,
            };
        }));

        const totalUsers = await User.find({ role: { $in: ['User', 'user'] } }).select(['_id', 'createdAt']);
        const totalGenres = await Genre.find().countDocuments();

        res.status(200).json({ totalUsers, totalGenres, movieDetails });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", error });
    }
};

const getLastThreeMonths = () => {
    const now = new Date();
    const months = [];
    for (let i = 0; i < 3; i++) {
        const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
        months.push(`${month.getFullYear()}-${month.getMonth() + 1}`); // Format: YYYY-M
    }
    return months;
};

exports.getTopMovies = async (req, res) => {
    try {
        // Lấy danh sách người dùng chỉ với các trường cần thiết
        const users = await User.find({}).select(['_id', 'history']);

        // Lấy danh sách phim
        const movies = await Movie.find({});

        // Xác định 3 tháng gần nhất
        const lastThreeMonths = getLastThreeMonths();

        // Duyệt qua danh sách phim để tính toán thông tin chi tiết
        const movieDetails = await Promise.all(movies.map(async (movie) => {

            // Calculate average rate
            const totalRatedActivities = movie.userActivity.filter(activity => activity.rate > 0).length;
            const totalRates = movie.userActivity.reduce((acc, activity) => acc + activity.rate, 0);
            const averageRate = totalRatedActivities
                ? (totalRates / totalRatedActivities).toFixed(2)
                : 0;

            // Calculate total views for the last 3 months
            let totalViewsLastThreeMonths = 0;

            users.forEach((user) => {
                user.history
                    .filter((history) => history.movieId.toString() === movie._id.toString())
                    .forEach((history) => {
                        history.progress.forEach((progress) => {
                            if (progress.timeWatched >= 0.9 * movie.duration) {
                                const monthKey = progress.at instanceof Date
                                    ? `${progress.at.getFullYear()}-${progress.at.getMonth() + 1}`
                                    : 'Invalid Date';

                                if (lastThreeMonths.includes(monthKey)) {
                                    totalViewsLastThreeMonths++;
                                }
                            }
                        });
                    });
            });


            return {
                movieId: movie._id,
                mainTitle: movie.mainTitle,
                subTitle: movie.subTitle,
                releaseDate: movie.releaseDate,
                description: movie.description,
                genres: movie.genres, 
                averageRate: Number(averageRate),
                totalViewsLastThreeMonths,
                source: movie.source,
            };
        }));

        for (const movie of movieDetails) {
            await convertIdToName(movie, 'genres', Genre);
        }

        const limitedMovies = movieDetails.sort((a, b) => b.totalViewsLastThreeMonths - a.totalViewsLastThreeMonths).slice(0, 12);

        res.status(200).json(limitedMovies);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", error });
    }
};







// Tạm thời
exports.getMoviesOverview = async (req, res) => {
    try {
        const movies = await Movie.find({});
        const users = await User.find({});

        const movieDetails = movies.map((movie) => {
            // Calculate average rate
            const totalRatedActivities = movie.userActivity.filter(activity => activity.rate > 0).length;
            const totalRates = movie.userActivity.reduce((acc, activity) => acc + activity.rate, 0);
            const averageRate = totalRatedActivities
            ? (totalRates / totalRatedActivities).toFixed(2)
            : 0;

            // Count total comments
            const totalComment = movie.userActivity.reduce((acc, activity) => acc + activity.comment.length, 0);

            // Calculate views per month
            const viewsMap = {};
            users.forEach((user) => {
                user.history
                    .filter((history) => history.movieId.toString() === movie._id.toString())
                    .forEach((history) => {
                    history.progress.forEach((progress) => {
                        if (progress.timeWatched >= 0.9 * movie.duration) {
                        const monthKey = `${progress.at.getFullYear()}-${progress.at.getMonth() + 1}`;
                        viewsMap[monthKey] = (viewsMap[monthKey] || 0) + 1;
                        }
                    });
                });
            });

            const viewsPerMonth = Object.keys(viewsMap).map((month) => ({
                month,
                views: viewsMap[month],
            }));

            return {
                movieId: movie._id,
                mainTitle: movie.mainTitle,
                subTitle: movie.subTitle,
                releaseDate: movie.releaseDate,
                
                averageRate: Number(averageRate),
                totalComment,
                viewsPerMonth,
            };
        });

        res.status(200).json(movieDetails);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", error });
    }
};



exports.getMovieList = async (req, res) => {
    try {
        const movies = await Movie.find().select(['_id', 'mainTitle', 'subTitle', 'duration']);
        res.json(movies);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

exports.updateDuration = async (req, res) => {
    try {
        const { movieId, movieDuration } = req.body;
        if (!movieDuration || typeof movieDuration !== 'number' || movieDuration < 0) {
            return res.status(400).json({ message: 'Invalid movieDuration' });
        }

        const movie = await Movie.findByIdAndUpdate(movieId, { duration: movieDuration }, { new: true });
        if (!movie) return res.status(404).json({ message: 'Không tìm thấy phim!' });
        res.json(movie);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

exports.updateAllSourceFieldsBySubTitle = async (req, res) => {
    try {
        const movies = await Movie.find({ source: { $exists: false } });
        for (const movie of movies) {
            movie.source = movie.subTitle.replace(/\s+/g, '-');
            await movie.save();
        }
        res.json({ message: 'Updated successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}
