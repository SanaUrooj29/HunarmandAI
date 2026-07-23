const { body } = require('express-validator');

const broadcastValidator = [
  body('audience').isIn(['all', 'sellers', 'buyers']),
  body('title').trim().isLength({ min: 3, max: 150 }),
  body('body').optional().trim().isLength({ max: 1000 }),
];

module.exports = { broadcastValidator };
