const supportTicketService = require('../../shared/services/supportTicketService');
const { asyncHandler } = require('../../shared/utils/asyncHandler.util');
const { sendSuccess } = require('../../shared/utils/response.util');
const { ApiError } = require('../../shared/utils/apiError.util');

const raiseTicket = asyncHandler(async (req, res) => {
  const { relatedOrderId, subject, description } = req.body;
  const ticket = await supportTicketService.raiseTicket({
    raisedByType: 'buyer',
    raisedById: req.auth.id,
    relatedOrderId,
    subject,
    description,
  });
  return sendSuccess(res, { statusCode: 201, message: 'Support ticket raised', data: ticket });
});

const listMyTickets = asyncHandler(async (req, res) => {
  const tickets = await supportTicketService.listMyTickets('buyer', req.auth.id);
  return sendSuccess(res, { message: 'Tickets fetched', data: tickets });
});

const getMyTicket = asyncHandler(async (req, res) => {
  const ticket = await supportTicketService.getTicketDetail(req.params.ticketId);
  if (String(ticket.raisedById) !== String(req.auth.id)) {
    throw ApiError.notFound('Ticket not found');
  }
  return sendSuccess(res, { message: 'Ticket fetched', data: ticket });
});

const respond = asyncHandler(async (req, res) => {
  const existing = await supportTicketService.getTicketDetail(req.params.ticketId);
  if (String(existing.raisedById) !== String(req.auth.id)) {
    throw ApiError.notFound('Ticket not found');
  }
  const ticket = await supportTicketService.respondToTicket(req.params.ticketId, {
    by: req.auth.id,
    byType: 'buyer',
    message: req.body.message,
  });
  return sendSuccess(res, { message: 'Response added', data: ticket });
});

module.exports = { raiseTicket, listMyTickets, getMyTicket, respond };
