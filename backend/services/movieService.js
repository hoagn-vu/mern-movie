const Movie = require('../models/Movie');

const uploadMovie = async ({ mainTitle, subTitle, description, releaseDate, duration, country, genres, directors, casts }) => {
    const newMovie = new Movie({
        mainTitle,
        subTitle,
        releaseDate,
        duration,
        country,
        description,
        genres,
        directors,
        casts,
        status: 'Available'
    });
    return newMovie;
};

module.exports = {
    uploadMovie
};