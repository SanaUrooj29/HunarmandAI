const dashboardService = require('../services/dashboardService');
const { asyncHandler } = require('../../shared/utils/asyncHandler.util');
const { sendSuccess } = require('../../shared/utils/response.util');

const getStats = asyncHandler(async (req, res) => {
  const stats = await dashboardService.getStats();
  return sendSuccess(res, { message: 'Dashboard stats fetched', data: stats });
});

module.exports = { getStats };
