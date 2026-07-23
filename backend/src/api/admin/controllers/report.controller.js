const reportService = require('../services/reportService');
const { asyncHandler } = require('../../shared/utils/asyncHandler.util');
const { sendSuccess } = require('../../shared/utils/response.util');

const listReports = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status, targetType } = req.query;
  const { items, meta } = await reportService.listReports({ page, limit, status, targetType });
  return sendSuccess(res, { message: 'Reports fetched', data: items, meta });
});

const getReportDetail = asyncHandler(async (req, res) => {
  const report = await reportService.getReportDetail(req.params.reportId);
  return sendSuccess(res, { message: 'Report fetched', data: report });
});

const resolveReport = asyncHandler(async (req, res) => {
  const report = await reportService.resolveReport(req.params.reportId, req.auth.id, req.body);
  return sendSuccess(res, { message: 'Report resolved', data: report });
});

module.exports = { listReports, getReportDetail, resolveReport };
