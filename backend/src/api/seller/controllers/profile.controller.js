const profileService = require('../services/profileService');
const { asyncHandler } = require('../../shared/utils/asyncHandler.util');
const { sendSuccess } = require('../../shared/utils/response.util');

const getMyProfile = asyncHandler(async (req, res) => {
  const profile = await profileService.getMyProfile(req.auth.id);
  return sendSuccess(res, { message: 'Profile fetched', data: profile });
});

const updateMyProfile = asyncHandler(async (req, res) => {
  try {
    const profile = await profileService.updateMyProfile(req.auth.id, req.body);
    return sendSuccess(res, { message: 'Profile updated', data: profile });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[updateMyProfile] error:', err);
    const { ApiError } = require('../../shared/utils/apiError.util');
    if (err instanceof ApiError) throw err;
    const { sendError } = require('../../shared/utils/response.util');
    return sendError(res, { statusCode: 500, message: 'Failed to update profile', details: err.message || String(err) });
  }
});

const uploadProfilePicture = asyncHandler(async (req, res) => {
  try {
    const result = await profileService.uploadProfilePicture(req.auth.id, req.file);
    return sendSuccess(res, { message: 'Profile picture updated', data: result });
  } catch (err) {
    // Log full error for server-side debugging and return readable payload
    // eslint-disable-next-line no-console
    console.error('[uploadProfilePicture] error:', err);
    // If it's an ApiError, let the central error handler manage it by throwing
    const { ApiError } = require('../../shared/utils/apiError.util');
    if (err instanceof ApiError) throw err;

    // Otherwise return a structured error response
    const { sendError } = require('../../shared/utils/response.util');
    return sendError(res, { statusCode: 500, message: 'Failed to upload profile picture', details: err.message || String(err) });
  }
});

const deleteMyAccount = asyncHandler(async (req, res) => {
  await profileService.deleteMyAccount(req.auth.id);
  return sendSuccess(res, { message: 'Account deleted' });
});

module.exports = { getMyProfile, updateMyProfile, uploadProfilePicture, deleteMyAccount };
