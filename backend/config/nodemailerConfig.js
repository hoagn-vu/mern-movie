require('dotenv').config();

const transporterConfig = {
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
};

module.exports = { transporterConfig };
