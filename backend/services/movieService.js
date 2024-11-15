const Movie = require('../models/Movie');

const uploadMovie = async ({ mainTitle, subTitle, description, releaseYear, country, genres, directors, casts }) => {
    const newMovie = new Movie({
        title: {
            mainTitle,
            subTitle,
        },
        releaseYear,
        country,
        description,
        genres,
        directors,
        casts,
        createAt: Date.now(),
        status: 'Available'
    });
    return newMovie;
};

module.exports = {
    uploadMovie
};