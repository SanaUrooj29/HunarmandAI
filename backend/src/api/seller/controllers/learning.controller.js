const learningService = require('../services/learningService');
const { asyncHandler } = require('../../shared/utils/asyncHandler.util');
const { sendSuccess } = require('../../shared/utils/response.util');

const listMyLessons = asyncHandler(async (req, res) => {
  const lessons = await learningService.listMyLessons(req.auth.id);
  return sendSuccess(res, { message: 'Lessons fetched', data: lessons });
});

const updateLessonStatus = asyncHandler(async (req, res) => {
  const { lessonId } = req.params;
  const { status } = req.body;
  const lesson = await learningService.updateLessonStatus(req.auth.id, lessonId, status);
  return sendSuccess(res, { message: 'Lesson status updated', data: lesson });
});

module.exports = { listMyLessons, updateLessonStatus };
