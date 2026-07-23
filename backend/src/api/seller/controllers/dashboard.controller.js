const dashboardService = require('../services/dashboardService');
const { asyncHandler } = require('../../shared/utils/asyncHandler.util');
const { sendSuccess } = require('../../shared/utils/response.util');

const getDashboard = asyncHandler(async (req, res) => {
  const dashboard = await dashboardService.getDashboard(req.auth.id);
  return sendSuccess(res, { message: 'Dashboard data fetched', data: dashboard });
});

module.exports = { getDashboard };
