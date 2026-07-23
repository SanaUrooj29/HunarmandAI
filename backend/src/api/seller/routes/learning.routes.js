const express = require('express');
const controller = require('../controllers/learning.controller');
const { updateLessonStatusValidator } = require('../validators/learning.validator');
const { validate } = require('../../shared/middleware/validate.middleware');
const { authenticateUser } = require('../../shared/middleware/auth.middleware');
const { requireRole } = require('../../shared/middleware/rbac.middleware');
const { ROLES } = require('../../shared/constants/enums');

const router = express.Router();
router.use(authenticateUser, requireRole(ROLES.SELLER));

router.get('/', controller.listMyLessons);
router.patch('/:lessonId', updateLessonStatusValidator, validate, controller.updateLessonStatus);

module.exports = router;
