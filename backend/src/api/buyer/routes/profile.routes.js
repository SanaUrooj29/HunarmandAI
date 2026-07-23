const express = require('express');
const controller = require('../controllers/profile.controller');
const { updateProfileValidator, addAddressValidator, updateAddressValidator } = require('../validators/profile.validator');
const { validate } = require('../../shared/middleware/validate.middleware');
const { authenticateUser } = require('../../shared/middleware/auth.middleware');
const { requireRole } = require('../../shared/middleware/rbac.middleware');
const { ROLES } = require('../../shared/constants/enums');

const router = express.Router();
router.use(authenticateUser, requireRole(ROLES.BUYER));

router.get('/', controller.getMyProfile);
router.patch('/', updateProfileValidator, validate, controller.updateMyProfile);
router.post('/addresses', addAddressValidator, validate, controller.addAddress);
router.patch('/addresses/:addressId', updateAddressValidator, validate, controller.updateAddress);
router.delete('/addresses/:addressId', controller.deleteAddress);

module.exports = router;
