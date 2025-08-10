const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'Adhar_cards', // folder name in cloudinary
    allowed_formats: ['jpg', 'png', 'avif', 'jpeg']
  },
});

const upload = multer({ storage });

module.exports = upload;
