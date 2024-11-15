const Director = require('../models/Director');

const createDirector = async (data) => {
  const { name } = data;
  const director = new Director({
    name
  });
  return await director.save();
};

const getDirectors = async () => {
  return await Director.find();
};

const getDirectorById = async (id) => {
  return await Director.findById(id);
};

const updateDirector = async (id, data) => {
  return await Director.findByIdAndUpdate(id, data, { new: true });
};

const deleteDirector = async (id) => {
  return await Director.findByIdAndDelete(id);
};

const getLatestDirector = async () => {
    return await Director.findOne().sort({ _id: -1 });
};

module.exports = {
  createDirector,
  getDirectors,
  getDirectorById,
  updateDirector,
  deleteDirector,
  getLatestDirector
};
