const { body, param, query } = require('express-validator');
const { SUPPORT_TICKET_STATUS } = require('../../shared/constants/enums');

const listValidator = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('status').optional().isIn(SUPPORT_TICKET_STATUS),
];
const ticketIdParamValidator = [param('ticketId').isMongoId()];
const respondValidator = [param('ticketId').isMongoId(), body('message').trim().isLength({ min: 1, max: 2000 })];
const statusValidator = [param('ticketId').isMongoId(), body('status').isIn(SUPPORT_TICKET_STATUS)];

module.exports = { listValidator, ticketIdParamValidator, respondValidator, statusValidator };
