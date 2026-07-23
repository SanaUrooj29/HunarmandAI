const express = require('express');
const controller = require('../controllers/support.controller');
const { raiseTicketValidator, ticketIdParamValidator, respondValidator } = require('../validators/support.validator');
const { validate } = require('../../shared/middleware/validate.middleware');
const { authenticateUser } = require('../../shared/middleware/auth.middleware');
const { requireRole } = require('../../shared/middleware/rbac.middleware');
const { ROLES } = require('../../shared/constants/enums');

const router = express.Router();
router.use(authenticateUser, requireRole(ROLES.SELLER));

router.post('/', raiseTicketValidator, validate, controller.raiseTicket);
router.get('/', controller.listMyTickets);
router.get('/:ticketId', ticketIdParamValidator, validate, controller.getMyTicket);
router.post('/:ticketId/respond', respondValidator, validate, controller.respond);

module.exports = router;
