const { body, param } = require('express-validator');
const { PAYMENT_METHOD } = require('../../shared/constants/enums');

const initiateCheckoutValidator = [
  body('addressId').optional().isMongoId(),
  body('shippingAddress').optional().isObject(),
  body('shippingAddress.addressLine').if(body('shippingAddress').exists()).notEmpty(),
  body('shippingAddress.city').if(body('shippingAddress').exists()).notEmpty(),
  body('paymentMethod').isIn(PAYMENT_METHOD),
];

const callbackParamValidator = [param('method').isIn(PAYMENT_METHOD)];

module.exports = { initiateCheckoutValidator, callbackParamValidator };
