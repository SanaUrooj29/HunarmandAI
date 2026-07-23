const express = require('express');
const { authenticateUser } = require('../../shared/middleware/auth.middleware');
const { singleImageDisk } = require('../../shared/middleware/upload.middleware');
const { sendSuccess } = require('../../shared/utils/response.util');

const router = express.Router();

// Local image upload route for seller product photos.
// Saves the received file to backend/uploads and returns a public URL.
router.post('/', authenticateUser, singleImageDisk('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ status: 'error', message: 'No image uploaded' });
  }

  const protocol = req.protocol;
  const host = req.get('host');
  const imageUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

  return sendSuccess(res, { message: 'Image uploaded', data: { url: imageUrl } });
});

module.exports = router;
