const actorService = require('../services/actorService');
const Actor = require('../models/Actor');

const createActor = async (req, res) => {
    try {
        const example = await actorService.createActor(req.body);
        res.status(201).json(example);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getActors = async (req, res) => {
    try {
        const examples = await Actor.find().select(['-__v']);
        res.status(200).json(examples);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getActorById = async (req, res) => {
    try {
        const example = await actorService.getActorById(req.params.id);
        if (!example) return res.status(404).json({ error: 'Actor not found' });
        res.status(200).json(example);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateActor = async (req, res) => {
  try {
    const example = await actorService.updateActor(req.params.id, req.body);
    if (!example) return res.status(404).json({ error: 'Actor not found' });
    res.status(200).json(example);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteActor = async (req, res) => {
    try {
        const result = await actorService.deleteActor(req.params.id);
        if (!result) return res.status(404).json({ error: 'Actor not found' });
        res.status(200).json({ message: 'Actor deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getLatestActor = async (req, res) => {
    try {
        const example = await actorService.getLatestActor();
        if (!example) return res.status(404).json({ error: 'No actors found' });
        res.status(200).json(example);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createActor,
    getActors,
    getActorById,
    updateActor,
    deleteActor,
    getLatestActor
};
