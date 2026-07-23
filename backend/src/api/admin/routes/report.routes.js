const express = require('express');
const controller = require('../controllers/report.controller');
const { listReportsValidator, reportIdParamValidator, resolveReportValidator } = require('../validators/report.validator');
const { validate } = require('../../shared/middleware/validate.middleware');

const router = express.Router();

router.get('/', listReportsValidator, validate, controller.listReports);
router.get('/:reportId', reportIdParamValidator, validate, controller.getReportDetail);
router.post('/:reportId/resolve', resolveReportValidator, validate, controller.resolveReport);

module.exports = router;
