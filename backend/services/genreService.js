const Genre = require('../models/Genre');

const createGenre = async (data) => {
  const { name } = data;
  const genre = new Genre({
    name
  });
  return await genre.save();
};

const getGenres = async () => {
  return await Genre.find();
};

const getGenreById = async (id) => {
  return await Genre.findById(id);
};

const updateGenre = async (id, data) => {
  return await Genre.findByIdAndUpdate(id, data, { new: true });
};

const deleteGenre = async (id) => {
  return await Genre.findByIdAndDelete(id);
};

const getLatestGenre = async () => {
    return await Genre.findOne().sort({ _id: -1 });
};

module.exports = {
  createGenre,
  getGenres,
  getGenreById,
  updateGenre,
  deleteGenre,
  getLatestGenre
};
