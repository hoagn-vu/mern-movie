const directorService = require('../services/directorService');
const Director = require('../models/Director');

const createDirector = async (req, res) => {
    try {
        const example = await directorService.createDirector(req.body);
        res.status(201).json(example);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getDirectors = async (req, res) => {
    try {
        const examples = await Director.find().select(['-__v']);
        res.status(200).json(examples);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getDirectorById = async (req, res) => {
    try {
        const example = await directorService.getDirectorById(req.params.id);
        if (!example) return res.status(404).json({ error: 'Director not found' });
        res.status(200).json(example);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateDirector = async (req, res) => {
    try {
        const example = await directorService.updateDirector(req.params.id, req.body);
        if (!example) return res.status(404).json({ error: 'Director not found' });
        res.status(200).json(example);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteDirector = async (req, res) => {
  try {
    const result = await directorService.deleteDirector(req.params.id);
    if (!result) return res.status(404).json({ error: 'Director not found' });
    res.status(200).json({ message: 'Director deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getLatestDirector = async (req, res) => {
    try {
        const example = await directorService.getLatestDirector();
        if (!example) return res.status(404).json({ error: 'No directors found' });
        res.status(200).json(example);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createDirector,
    getDirectors,
    getDirectorById,
    updateDirector,
    deleteDirector,
    getLatestDirector
};
