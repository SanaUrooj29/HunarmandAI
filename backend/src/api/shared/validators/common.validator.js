const { body } = require('express-validator');

const PK_PHONE_REGEX = /^\+?92\d{10}$/;

const phoneField = () =>
  body('phone')
    .trim()
    .matches(PK_PHONE_REGEX)
    .withMessage('Phone must be a valid Pakistani mobile number, e.g. +923001234567');

const otpCodeField = () =>
  body('code')
    .trim()
    .isLength({ min: 6, max: 6 })
    .withMessage('OTP code must be exactly 6 digits')
    .isNumeric()
    .withMessage('OTP code must be numeric');

const languageField = () =>
  body('preferredLanguage')
    .optional()
    .isIn(['ur', 'en'])
    .withMessage('preferredLanguage must be "ur" or "en"');

module.exports = { PK_PHONE_REGEX, phoneField, otpCodeField, languageField };
