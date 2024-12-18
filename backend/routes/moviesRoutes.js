const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');
const { getAllMovies, deleteMovie, getSomeNewestMovies, getPromotedMovies, setPromote, updateInforMovie, getMoviesByGenre, getMoviesByNation, recommendMovies, searchMovies, getMovieById, getMoviesByIds, getMovieToWatch, addComment, deleteComment, addReport, getAllReports, rateMovie, toggleFavorite, removeFavorites, getFavoriteList, saveWatchHistory, getWatchHistory, statistic, getTopMovies } = require('../controllers/movieController');
const upload = require('../middlewares/uploadMiddleware');
// const { authMiddleware, authorizeRoles } = require('../middlewares/authMiddleware');

router.post('/upload', upload.fields([
    { name: 'movie', maxCount: 1 },
    { name: 'banner', maxCount: 1 },
    { name: 'poster', maxCount: 1 }
]), movieController.uploadMovie);

router.put('/update/:movieId', upload.fields([
    { name: 'movie', maxCount: 1 },
    { name: 'banner', maxCount: 1 },
    { name: 'poster', maxCount: 1 }
]), movieController.editMovie);

router.delete('/delete/:movieId', deleteMovie);

router.get('/getAllMovies', getAllMovies);
router.get('/getSomeNewestMovies', getSomeNewestMovies);
router.get('/getPromotedMovies', getPromotedMovies);
router.put('/setPromote/:movieId', setPromote);
router.put('/updateInforMovie/:id', updateInforMovie);
router.get('/genre/:genreToSearch', getMoviesByGenre);
router.get('/country/:nationToSearch', getMoviesByNation);
router.get('/recommend/:userId', recommendMovies);
router.post('/search', searchMovies);
router.get('/get/:id', getMovieById);
router.post('/getMoviesByIds', getMoviesByIds);
router.get('/:userId/get/:movieId', getMovieToWatch);
router.post('/:movieId/comment', addComment);
router.delete('/:movieId/delete-comment/:userId/:commentId', deleteComment);
router.post('/:movieId/report', addReport);
router.get('/getAllReports', getAllReports);
router.post('/:movieId/rate', rateMovie);
router.post('/:userId/favorite/:movieId', toggleFavorite);
router.put('/:userId/removeFavorites', removeFavorites);
router.get('/:userId/getFavoriteList', getFavoriteList);
router.post('/saveWatchHistory', saveWatchHistory);
router.get('/:userId/getWatchHistory', getWatchHistory);
// router.put('/:movieId/updateViews', updateViews);

router.get('/statistic', statistic);
router.get('/getTopMovies', getTopMovies);



const { getMoviesOverview } = require('../controllers/movieController');
router.get('/overview', getMoviesOverview);

const { getMovieList, updateDuration, updateAllSourceFieldsBySubTitle } = require('../controllers/movieController');
router.get('/getMovieList', getMovieList);
router.put('/updateDuration', updateDuration);
router.put('/updateAllSourceFieldsBySubTitle', updateAllSourceFieldsBySubTitle);


// // Kiểm tra req.body trước khi xử lý với multer
// router.post('/upload', (req, res, next) => {
//     console.log('req.body:', req.body); // Log req.body để kiểm tra subTitle
//     next();
// }, upload.fields([
//     { name: 'movie', maxCount: 1 },
//     { name: 'banner', maxCount: 1 },
//     { name: 'poster', maxCount: 1 }
// ]), movieController.uploadMovie);

// router.post(
//     '/upload', 
//     upload.fields([
//         { name: 'movie', maxCount: 1 },
//         { name: 'banner', maxCount: 1 },
//         { name: 'poster', maxCount: 1 }
//     ]),
//     (req, res, next) => {
//         console.log('req.body.subTitle: ', req.body.subTitle); // Kiểm tra req.body để đảm bảo có subTitle
//         // console.log('req.body:', req.body); // Kiểm tra req.body để đảm bảo có subTitle
//         next();
//     },
//     movieController.uploadMovie
// );

// router.post(
//     '/upload',
//     express.urlencoded({ extended: true }),
//     express.json(),
//     upload.fields([
//         { name: 'movie', maxCount: 1 },
//         { name: 'banner', maxCount: 1 },
//         { name: 'poster', maxCount: 1 }
//     ]),
//     movieController.uploadMovie
// );

module.exports = router;



