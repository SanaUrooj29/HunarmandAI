const express = require('express');
const controller = require('../controllers/platformSettings.controller');
const { updateSettingsValidator } = require('../validators/platformSettings.validator');
const { validate } = require('../../shared/middleware/validate.middleware');

const router = express.Router();

router.get('/', controller.getSettings);
router.patch('/', updateSettingsValidator, validate, controller.updateSettings);

module.exports = router;
