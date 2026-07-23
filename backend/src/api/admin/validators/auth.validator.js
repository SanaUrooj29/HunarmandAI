const { body } = require('express-validator');

const loginValidator = [
  body('email').trim().isEmail().withMessage('Must be a valid email address').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

const requestPasswordResetValidator = [
  body('email').trim().isEmail().withMessage('Must be a valid email address').normalizeEmail(),
];

const resetPasswordValidator = [
  body('token').notEmpty().withMessage('Reset token is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
];

module.exports = { loginValidator, requestPasswordResetValidator, resetPasswordValidator };
