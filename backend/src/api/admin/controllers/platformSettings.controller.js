const platformSettingsService = require('../services/platformSettingsService');
const { asyncHandler } = require('../../shared/utils/asyncHandler.util');
const { sendSuccess } = require('../../shared/utils/response.util');

const getSettings = asyncHandler(async (req, res) => {
  const settings = await platformSettingsService.getSettings();
  return sendSuccess(res, { message: 'Settings fetched', data: settings });
});

const updateSettings = asyncHandler(async (req, res) => {
  const settings = await platformSettingsService.updateSettings(req.body);
  return sendSuccess(res, { message: 'Settings updated', data: settings });
});

module.exports = { getSettings, updateSettings };
