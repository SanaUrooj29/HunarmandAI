const express = require('express');
const controller = require('../controllers/support.controller');
const { listValidator, ticketIdParamValidator, respondValidator, statusValidator } = require('../validators/support.validator');
const { validate } = require('../../shared/middleware/validate.middleware');

const router = express.Router();

router.get('/', listValidator, validate, controller.listAllTickets);
router.get('/:ticketId', ticketIdParamValidator, validate, controller.getTicketDetail);
router.post('/:ticketId/respond', respondValidator, validate, controller.respond);
router.patch('/:ticketId/status', statusValidator, validate, controller.updateStatus);

module.exports = router;
