const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');
const upload = require('../middlewares/uploadMiddleware');
// const { authMiddleware, authorizeRoles } = require('../middlewares/authMiddleware');

router.post('/upload',  upload.fields([
    { name: 'movie', maxCount: 1 },
    { name: 'banner', maxCount: 1 },
    { name: 'poster', maxCount: 1 }
]), movieController.uploadMovie);

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



