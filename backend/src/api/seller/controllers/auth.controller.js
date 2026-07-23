const authService = require('../services/authService');
const { asyncHandler } = require('../../shared/utils/asyncHandler.util');
const { sendSuccess } = require('../../shared/utils/response.util');

const requestOtp = asyncHandler(async (req, res) => {
  const { phone, preferredLanguage } = req.body;
  const { isNewAccount, expiresAt } = await authService.requestOtp({ phone, preferredLanguage });
  return sendSuccess(res, {
    message: 'OTP sent successfully',
    data: { isNewAccount, expiresAt },
  });
});

const verifyOtp = asyncHandler(async (req, res) => {
  const { phone, code } = req.body;
  const result = await authService.verifyOtp({ phone, code });
  return sendSuccess(res, {
    message: 'Login successful',
    data: result,
  });
});

const logout = asyncHandler(async (req, res) => {
  const rawToken = req.headers.authorization.split(' ')[1];
  authService.logout(rawToken);
  return sendSuccess(res, { message: 'Logged out successfully' });
});

module.exports = { requestOtp, verifyOtp, logout };
