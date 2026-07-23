const walletService = require('../services/walletService');
const { asyncHandler } = require('../../shared/utils/asyncHandler.util');
const { sendSuccess } = require('../../shared/utils/response.util');

const getMyWallet = asyncHandler(async (req, res) => {
  const wallet = await walletService.getMyWallet(req.auth.id);
  return sendSuccess(res, { message: 'Wallet fetched', data: wallet });
});

const listMyTransactions = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const { items, meta } = await walletService.listMyTransactions(req.auth.id, { page, limit });
  return sendSuccess(res, { message: 'Transactions fetched', data: items, meta });
});

const requestWithdrawal = asyncHandler(async (req, res) => {
  const transaction = await walletService.requestWithdrawal(req.auth.id, req.body.amount);
  return sendSuccess(res, { statusCode: 201, message: 'Withdrawal request submitted', data: transaction });
});

module.exports = { getMyWallet, listMyTransactions, requestWithdrawal };
