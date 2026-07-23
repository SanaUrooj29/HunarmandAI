const { body, param } = require('express-validator');

const raiseTicketValidator = [
  body('relatedOrderId').optional().isMongoId(),
  body('subject').trim().isLength({ min: 3, max: 150 }),
  body('description').trim().isLength({ min: 10, max: 3000 }),
];
const ticketIdParamValidator = [param('ticketId').isMongoId()];
const respondValidator = [param('ticketId').isMongoId(), body('message').trim().isLength({ min: 1, max: 2000 })];

module.exports = { raiseTicketValidator, ticketIdParamValidator, respondValidator };
