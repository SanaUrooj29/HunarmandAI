const { body } = require('express-validator');

const updateSettingsValidator = [
  body('platformCommissionPercentage').optional().isFloat({ min: 0, max: 100 }),
  body('termsAndConditions').optional().isString(),
  body('privacyPolicy').optional().isString(),
  body('paymentMethods.creditCard').optional().isBoolean(),
  body('paymentMethods.jazzCash').optional().isBoolean(),
  body('paymentMethods.easyPaisa').optional().isBoolean(),
  body('walletSettings.minWithdrawalAmount').optional().isFloat({ min: 0 }),
  body('walletSettings.requiredSuccessfulSalesForWithdrawal').optional().isInt({ min: 0 }),
  body('walletSettings.manualApprovalRequired').optional().isBoolean(),
  body('otpSettings.expiryMinutes').optional().isInt({ min: 1 }),
  body('otpSettings.maxAttempts').optional().isInt({ min: 1 }),
  body('aiSettings.autoGenerateEnabled').optional().isBoolean(),
];

module.exports = { updateSettingsValidator };
