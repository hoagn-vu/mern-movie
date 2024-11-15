const express = require('express');
const genreController = require('../controllers/genreController');
const router = express.Router();

router.post('/create', genreController.createGenre);
router.get('/get', genreController.getGenres);
router.get('/get/:id', genreController.getGenreById);
router.put('/update/:id', genreController.updateGenre);
router.delete('/delete/:id', genreController.deleteGenre);
router.get('/latest', genreController.getLatestGenre);

module.exports = router;
