const express = require('express');
const controller = require('../controllers/walletManagement.controller');
const { listTransactionsValidator, transactionIdParamValidator } = require('../validators/walletManagement.validator');
const { validate } = require('../../shared/middleware/validate.middleware');

const router = express.Router();

router.get('/transactions', listTransactionsValidator, validate, controller.listTransactions);
router.get('/withdrawals/pending', listTransactionsValidator, validate, controller.listPendingWithdrawals);
router.post('/withdrawals/:transactionId/approve', transactionIdParamValidator, validate, controller.approveWithdrawal);
router.post('/withdrawals/:transactionId/reject', transactionIdParamValidator, validate, controller.rejectWithdrawal);

module.exports = router;
