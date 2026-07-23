const authService = require('../services/authService');
const { asyncHandler } = require('../../shared/utils/asyncHandler.util');
const { sendSuccess } = require('../../shared/utils/response.util');

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.login({ email, password });
  return sendSuccess(res, { message: 'Login successful', data: result });
});

const logout = asyncHandler(async (req, res) => {
  const rawToken = req.headers.authorization.split(' ')[1];
  authService.logout(rawToken);
  return sendSuccess(res, { message: 'Logged out successfully' });
});

const requestPasswordReset = asyncHandler(async (req, res) => {
  const { email } = req.body;
  await authService.requestPasswordReset({ email });
  // Deliberately generic response regardless of whether the email exists.
  return sendSuccess(res, { message: 'If that email is registered, a reset link has been sent.' });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;
  await authService.resetPassword({ token, newPassword });
  return sendSuccess(res, { message: 'Password has been reset successfully. Please log in again.' });
});

module.exports = { login, logout, requestPasswordReset, resetPassword };
