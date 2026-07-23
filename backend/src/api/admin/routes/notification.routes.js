const express = require('express');
const controller = require('../controllers/notification.controller');
const { broadcastValidator } = require('../validators/notification.validator');
const { validate } = require('../../shared/middleware/validate.middleware');

const router = express.Router();

router.post('/broadcast', broadcastValidator, validate, controller.broadcast);

module.exports = router;
