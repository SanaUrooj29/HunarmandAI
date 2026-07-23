const { SupportTicket } = require('../models');
const { ApiError } = require('../utils/apiError.util');
const { paginationMeta } = require('../utils/response.util');

/** Raised by buyer or seller — shared so both panels reuse the same logic. */
async function raiseTicket({ raisedByType, raisedById, relatedOrderId, subject, description }) {
  return SupportTicket.create({ raisedByType, raisedById, relatedOrderId, subject, description });
}

async function listMyTickets(raisedByType, raisedById) {
  return SupportTicket.find({ raisedByType, raisedById }).sort({ createdAt: -1 }).lean();
}

async function getTicketDetail(ticketId) {
  const ticket = await SupportTicket.findById(ticketId);
  if (!ticket) throw ApiError.notFound('Support ticket not found');
  return ticket;
}

async function listAllTickets({ page = 1, limit = 20, status } = {}) {
  const filter = {};
  if (status) filter.status = status;
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    SupportTicket.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    SupportTicket.countDocuments(filter),
  ]);
  return { items, meta: paginationMeta({ page, limit, total }) };
}

async function respondToTicket(ticketId, { by, byType, message }) {
  const ticket = await SupportTicket.findById(ticketId);
  if (!ticket) throw ApiError.notFound('Support ticket not found');

  ticket.responses.push({ by, byType, message, respondedAt: new Date() });
  if (byType === 'admin' && ticket.status === 'open') ticket.status = 'in_progress';
  await ticket.save();
  return ticket;
}

async function updateTicketStatus(ticketId, status) {
  const ticket = await SupportTicket.findById(ticketId);
  if (!ticket) throw ApiError.notFound('Support ticket not found');
  ticket.status = status;
  await ticket.save();
  return ticket;
}

module.exports = { raiseTicket, listMyTickets, getTicketDetail, listAllTickets, respondToTicket, updateTicketStatus };
