const express = require('express');
const controller = require('../controllers/wallet.controller');
const { withdrawValidator, listTransactionsValidator } = require('../validators/wallet.validator');
const { validate } = require('../../shared/middleware/validate.middleware');
const { authenticateUser } = require('../../shared/middleware/auth.middleware');
const { requireRole } = require('../../shared/middleware/rbac.middleware');
const { ROLES } = require('../../shared/constants/enums');

const router = express.Router();
router.use(authenticateUser, requireRole(ROLES.SELLER));

router.get('/', controller.getMyWallet);
router.get('/transactions', listTransactionsValidator, validate, controller.listMyTransactions);
router.post('/withdraw', withdrawValidator, validate, controller.requestWithdrawal);

module.exports = router;
