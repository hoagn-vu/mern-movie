const express = require('express');
const actorController = require('../controllers/actorController');
const router = express.Router();

router.post('/create', actorController.createActor);
router.get('/get', actorController.getActors);
router.get('/get/:id', actorController.getActorById);
router.put('/update/:id', actorController.updateActor);
router.delete('/delete/:id', actorController.deleteActor);
router.get('/latest', actorController.getLatestActor);

module.exports = router;
