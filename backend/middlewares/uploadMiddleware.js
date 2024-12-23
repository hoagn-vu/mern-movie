const multer = require('multer');
const multerS3 = require('multer-s3');
const s3 = require('../config/awsConfig');
const { DeleteObjectCommand, HeadObjectCommand } = require('@aws-sdk/client-s3');

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_BUCKET_NAME,
        key: (req, file, cb) => {
            const folderName = (req.body.subTitle || req.body.source || 'unamed-folder').replace(/\s+/g, '-');
            let fileName;

            if (file.fieldname === 'movie') {
                fileName = "movie" || file.originalname;
            } else if (file.fieldname === 'banner') {
                fileName = "banner" || `${file.fieldname}_${file.originalname}`;
            } else if (file.fieldname === 'poster') {
                fileName = "poster" || `${file.fieldname}_${file.originalname}`;
            } else {
                return cb(new Error('Unexpected field'));
            }

            const fullPath = `movies/${folderName}/${fileName}`;
            cb(null, fullPath);
        }
    }),
    fileFilter: (req, file, cb) => {
        if (file.fieldname === 'movie' && file.mimetype.startsWith('video/')) {
            cb(null, true);
        } else if ((file.fieldname === 'banner' || file.fieldname === 'poster') && file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type! Only video files for "movie" field and image files for "banner" and "poster" fields are allowed.'));
        }
    }
});


module.exports = upload;