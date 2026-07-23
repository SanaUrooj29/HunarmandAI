const { body, param, query } = require('express-validator');
const { REPORT_STATUS, REPORT_TARGET_TYPE } = require('../../shared/constants/enums');

const listReportsValidator = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('status').optional().isIn(REPORT_STATUS),
  query('targetType').optional().isIn(REPORT_TARGET_TYPE),
];
const reportIdParamValidator = [param('reportId').isMongoId()];
const resolveReportValidator = [
  param('reportId').isMongoId(),
  body('outcome').isIn(['reviewed', 'dismissed', 'actioned']),
  body('resolutionNote').optional().trim().isLength({ max: 1000 }),
];

module.exports = { listReportsValidator, reportIdParamValidator, resolveReportValidator };
