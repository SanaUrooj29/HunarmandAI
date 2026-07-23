const categoryService = require('../services/categoryService');
const { asyncHandler } = require('../utils/asyncHandler.util');
const { sendSuccess } = require('../utils/response.util');

const listCategories = asyncHandler(async (req, res) => {
  const categories = await categoryService.listAllActive();
  return sendSuccess(res, { message: 'Categories fetched', data: categories });
});

module.exports = { listCategories };
