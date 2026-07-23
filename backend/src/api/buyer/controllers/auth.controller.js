const authService = require('../services/authService');
const { asyncHandler } = require('../../shared/utils/asyncHandler.util');
const { sendSuccess } = require('../../shared/utils/response.util');

const requestOtp = asyncHandler(async (req, res) => {
  const { phone, preferredLanguage } = req.body;
  console.log('[BACKEND BUYER AUTH] requestOtp', { phone, preferredLanguage })
  const { isNewAccount, expiresAt } = await authService.requestOtp({ phone, preferredLanguage });
  console.log('[BACKEND BUYER AUTH] requestOtp success', { phone, isNewAccount, expiresAt })
  return sendSuccess(res, { message: 'OTP sent successfully', data: { isNewAccount, expiresAt } });
});

const verifyOtp = asyncHandler(async (req, res) => {
  const { phone, code } = req.body;
  console.log('[BACKEND BUYER AUTH] verifyOtp', { phone, code })
  const result = await authService.verifyOtp({ phone, code });
  console.log('[BACKEND BUYER AUTH] verifyOtp success', { phone, buyerId: result.buyer.id })
  return sendSuccess(res, { message: 'Login successful', data: result });
});

const logout = asyncHandler(async (req, res) => {
  const rawToken = req.headers.authorization.split(' ')[1];
  console.log('[BACKEND BUYER AUTH] logout', { tokenPresent: !!rawToken })
  authService.logout(rawToken);
  return sendSuccess(res, { message: 'Logged out successfully' });
});

module.exports = { requestOtp, verifyOtp, logout };
