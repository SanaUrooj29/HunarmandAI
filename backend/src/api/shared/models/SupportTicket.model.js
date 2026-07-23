const mongoose = require('mongoose');
const { SENDER_TYPE, SUPPORT_TICKET_STATUS } = require('../constants/enums');

const { Schema } = mongoose;

// Small, bounded conversational thread always read with its parent ticket
// (unlike open-ended buyer<->seller Messages, which are unbounded) — embedded.
const ticketResponseSchema = new Schema(
  {
    by: { type: Schema.Types.ObjectId, required: true },
    byType: { type: String, enum: [...SENDER_TYPE, 'admin'], required: true },
    message: { type: String, required: true, maxlength: 2000 },
    respondedAt: { type: Date, required: true, default: Date.now },
  },
  { _id: true }
);

const supportTicketSchema = new Schema(
  {
    raisedByType: { type: String, enum: SENDER_TYPE, required: true },
    raisedById: { type: Schema.Types.ObjectId, required: true },
    relatedOrderId: { type: Schema.Types.ObjectId, ref: 'Order', default: null },

    subject: { type: String, required: true, maxlength: 150 },
    description: { type: String, required: true, maxlength: 3000 },
    status: { type: String, enum: SUPPORT_TICKET_STATUS, default: 'open', required: true },

    responses: { type: [ticketResponseSchema], default: [] },
  },
  { timestamps: true }
);

supportTicketSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('SupportTicket', supportTicketSchema);
