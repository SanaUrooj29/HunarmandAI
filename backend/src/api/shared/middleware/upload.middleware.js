const fs = require('fs');
const path = require('path');
const multer = require('multer');
const storageConfig = require('../config/storage.config');

const uploadsDirectory = path.resolve(__dirname, '../../../../uploads');
fs.mkdirSync(uploadsDirectory, { recursive: true });

const fileFilter = (req, file, cb) => {
  if (!storageConfig.allowedMimeTypes.includes(file.mimetype)) {
    return cb(new Error(`Unsupported file type "${file.mimetype}"`));
  }
  return cb(null, true);
};

const memoryUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: storageConfig.maxFileSizeBytes },
  fileFilter,
});

const diskUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDirectory),
    filename: (req, file, cb) => {
      const timestamp = Date.now()
      const sanitized = file.originalname.replace(/[^a-zA-Z0-9\.\-_]/g, '_')
      cb(null, `${timestamp}-${sanitized}`)
    },
  }),
  limits: { fileSize: storageConfig.maxFileSizeBytes },
  fileFilter,
});

module.exports = {
  singleImage: (fieldName) => memoryUpload.single(fieldName),
  multipleImages: (fieldName, maxCount = 6) => memoryUpload.array(fieldName, maxCount),
  singleImageDisk: (fieldName) => diskUpload.single(fieldName),
};
