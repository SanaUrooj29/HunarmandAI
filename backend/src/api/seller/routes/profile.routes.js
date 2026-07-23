const express = require('express');
const controller = require('../controllers/profile.controller');
const { updateProfileValidator } = require('../validators/profile.validator');
const { validate } = require('../../shared/middleware/validate.middleware');
const { authenticateUser } = require('../../shared/middleware/auth.middleware');
const { requireRole } = require('../../shared/middleware/rbac.middleware');
const { singleImage } = require('../../shared/middleware/upload.middleware');
const { ROLES } = require('../../shared/constants/enums');

const router = express.Router();
router.use(authenticateUser, requireRole(ROLES.SELLER));

router.get('/', controller.getMyProfile);
router.patch('/', updateProfileValidator, validate, controller.updateMyProfile);
router.post('/picture', singleImage('picture'), controller.uploadProfilePicture);
router.delete('/', controller.deleteMyAccount);

module.exports = router;
