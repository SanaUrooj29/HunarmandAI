const { body } = require('express-validator');

const updateLessonStatusValidator = [
  body('status').isIn(['viewed', 'completed', 'dismissed']).withMessage('status must be viewed, completed, or dismissed'),
];

module.exports = { updateLessonStatusValidator };
