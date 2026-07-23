const { body, param } = require('express-validator');

const updateProfileValidator = [
  body('name').optional().trim().isLength({ min: 2, max: 60 }),
  body('age').optional().isInt({ min: 13, max: 120 }).toInt(),
  body('preferredLanguage').optional().isIn(['ur', 'en']),
];

const addAddressValidator = [
  body('label').optional().trim().isLength({ max: 40 }),
  body('addressLine').trim().isLength({ min: 5, max: 300 }),
  body('city').trim().isLength({ min: 2 }),
  body('isDefault').optional().isBoolean(),
];

const updateAddressValidator = [
  param('addressId').isMongoId(),
  body('label').optional().trim().isLength({ max: 40 }),
  body('addressLine').optional().trim().isLength({ min: 5, max: 300 }),
  body('city').optional().trim().isLength({ min: 2 }),
  body('isDefault').optional().isBoolean(),
];

module.exports = { updateProfileValidator, addAddressValidator, updateAddressValidator };
