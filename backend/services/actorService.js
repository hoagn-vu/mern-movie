const Actor = require('../models/Actor');

const createActor = async (data) => {
  const { name } = data;
  const actor = new Actor({
    name
  });
  return await actor.save();
};

const getActors = async () => {
  return await Actor.find();
};

const getActorById = async (id) => {
  return await Actor.findById(id);
};

const updateActor = async (id, data) => {
  return await Actor.findByIdAndUpdate(id, data, { new: true });
};

const deleteActor = async (id) => {
  return await Actor.findByIdAndDelete(id);
};

const getLatestActor = async () => {
    return await Actor.findOne().sort({ _id: -1 });
};

module.exports = {
  createActor,
  getActors,
  getActorById,
  updateActor,
  deleteActor,
  getLatestActor
};
