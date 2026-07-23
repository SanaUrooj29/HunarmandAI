const { phoneField, otpCodeField, languageField } = require('../../shared/validators/common.validator');

const requestOtpValidator = [phoneField(), languageField()];
const verifyOtpValidator = [phoneField(), otpCodeField()];

module.exports = { requestOtpValidator, verifyOtpValidator };
