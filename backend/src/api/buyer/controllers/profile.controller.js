const profileService = require('../services/profileService');
const { asyncHandler } = require('../../shared/utils/asyncHandler.util');
const { sendSuccess } = require('../../shared/utils/response.util');

const getMyProfile = asyncHandler(async (req, res) => {
  const profile = await profileService.getMyProfile(req.auth.id);
  return sendSuccess(res, { message: 'Profile fetched', data: profile });
});

const updateMyProfile = asyncHandler(async (req, res) => {
  const profile = await profileService.updateMyProfile(req.auth.id, req.body);
  return sendSuccess(res, { message: 'Profile updated', data: profile });
});

const addAddress = asyncHandler(async (req, res) => {
  const addresses = await profileService.addAddress(req.auth.id, req.body);
  return sendSuccess(res, { statusCode: 201, message: 'Address added', data: addresses });
});

const updateAddress = asyncHandler(async (req, res) => {
  const addresses = await profileService.updateAddress(req.auth.id, req.params.addressId, req.body);
  return sendSuccess(res, { message: 'Address updated', data: addresses });
});

const deleteAddress = asyncHandler(async (req, res) => {
  const addresses = await profileService.deleteAddress(req.auth.id, req.params.addressId);
  return sendSuccess(res, { message: 'Address deleted', data: addresses });
});

module.exports = { getMyProfile, updateMyProfile, addAddress, updateAddress, deleteAddress };
