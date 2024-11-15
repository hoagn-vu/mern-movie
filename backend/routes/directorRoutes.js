const express = require('express');
const directorController = require('../controllers/directorController');
const router = express.Router();

router.post('/create', directorController.createDirector);
router.get('/get', directorController.getDirectors);
router.get('/get/:id', directorController.getDirectorById);
router.put('/update/:id', directorController.updateDirector);
router.delete('/delete/:id', directorController.deleteDirector);
router.get('/latest', directorController.getLatestDirector);

module.exports = router;
