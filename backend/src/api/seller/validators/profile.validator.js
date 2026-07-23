const { body } = require('express-validator');

const CNIC_REGEX = /^\d{13}$/; // 13-digit Pakistani CNIC, no dashes (normalized client-side)

const updateProfileValidator = [
  body('username').optional().trim().isLength({ min: 2, max: 60 }),
  body('gender').optional().isIn(['male', 'female', 'other', 'prefer_not_to_say']),
  body('dateOfBirth').optional().isISO8601().toDate(),
  body('preferredLanguage').optional().isIn(['ur', 'en']),
  body('cnic').optional().matches(CNIC_REGEX).withMessage('CNIC must be exactly 13 digits, no dashes'),
  body('shopName').optional().trim().isLength({ min: 2, max: 100 }),
  body('city').optional().trim().isLength({ min: 2 }),
  body('productCategory').optional().isMongoId().withMessage('productCategory must be a valid category id'),
  body('shopDescription').optional().trim().isLength({ max: 1000 }),
  body('socialMediaLinks').optional().isArray(),
  body('socialMediaLinks.*').optional().isURL().withMessage('Each social media link must be a valid URL'),
];

module.exports = { updateProfileValidator };
