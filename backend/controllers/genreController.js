const genreService = require('../services/genreService');

const createGenre = async (req, res) => {
  try {
    const example = await genreService.createGenre(req.body);
    res.status(201).json(example);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getGenres = async (req, res) => {
  try {
    const examples = await genreService.getGenres();
    res.status(200).json(examples);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getGenreById = async (req, res) => {
  try {
    const example = await genreService.getGenreById(req.params.id);
    if (!example) return res.status(404).json({ error: 'Genre not found' });
    res.status(200).json(example);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateGenre = async (req, res) => {
  try {
    const example = await genreService.updateGenre(req.params.id, req.body);
    if (!example) return res.status(404).json({ error: 'Genre not found' });
    res.status(200).json(example);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteGenre = async (req, res) => {
  try {
    const result = await genreService.deleteGenre(req.params.id);
    if (!result) return res.status(404).json({ error: 'Genre not found' });
    res.status(200).json({ message: 'Genre deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getLatestGenre = async (req, res) => {
    try {
    const example = await genreService.getLatestGenre();
    if (!example) return res.status(404).json({ error: 'No genres found' });
    res.status(200).json(example);
    } catch (error) {
    res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createGenre,
    getGenres,
    getGenreById,
    updateGenre,
    deleteGenre,
    getLatestGenre
};
