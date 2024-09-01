// const multer = require('multer');
// const { CloudinaryStorage } = require('multer-storage-cloudinary');
// const cloudinary = require('cloudinary').v2;
// require('dotenv').config(); // Load environment variables from .env file

// // Configure your Cloudinary account
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // Configure Cloudinary storage
// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: 'tourist-wheel', // The folder in Cloudinary where the files will be stored
//     format: async (req, file) => 'png', // Supports promises as well
//     public_id: (req, file) => Date.now() + '-' + file.originalname.split('.')[0], // The public ID of the file
//   },
// });

// const upload = multer({ storage: storage });

// module.exports = {
//   upload,
// };

const multer = require('multer');
const { S3Client } = require('@aws-sdk/client-s3');
const multerS3 = require('multer-s3');
require('dotenv').config(); // Load environment variables from .env file

// Configure AWS SDK (v3)
const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: process.env.AWS_REGION,
});

// Configure S3 storage
const storage = multerS3({
  s3: s3,
  bucket: process.env.S3_BUCKET_NAME,
  contentType: multerS3.AUTO_CONTENT_TYPE,
  acl: 'private',
  metadata: (req, file, cb) => {
    cb(null, { fieldName: file.fieldname });
  },
  key: (req, file, cb) => {
    cb(null, Date.now().toString() + '-' + file.originalname.split('.')[0] + '.png'); // Generate a unique file name
  },
});

const upload = multer({ storage: storage });

module.exports = {
  upload,
};

