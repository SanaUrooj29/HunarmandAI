const supportTicketService = require('../../shared/services/supportTicketService');
const { asyncHandler } = require('../../shared/utils/asyncHandler.util');
const { sendSuccess } = require('../../shared/utils/response.util');

const listAllTickets = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status } = req.query;
  const { items, meta } = await supportTicketService.listAllTickets({ page, limit, status });
  return sendSuccess(res, { message: 'Tickets fetched', data: items, meta });
});

const getTicketDetail = asyncHandler(async (req, res) => {
  const ticket = await supportTicketService.getTicketDetail(req.params.ticketId);
  return sendSuccess(res, { message: 'Ticket fetched', data: ticket });
});

const respond = asyncHandler(async (req, res) => {
  const ticket = await supportTicketService.respondToTicket(req.params.ticketId, {
    by: req.auth.id,
    byType: 'admin',
    message: req.body.message,
  });
  return sendSuccess(res, { message: 'Response added', data: ticket });
});

const updateStatus = asyncHandler(async (req, res) => {
  const ticket = await supportTicketService.updateTicketStatus(req.params.ticketId, req.body.status);
  return sendSuccess(res, { message: 'Ticket status updated', data: ticket });
});

module.exports = { listAllTickets, getTicketDetail, respond, updateStatus };
