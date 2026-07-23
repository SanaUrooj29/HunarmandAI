const categoryAdminService = require('../services/categoryAdminService');
const { asyncHandler } = require('../../shared/utils/asyncHandler.util');
const { sendSuccess } = require('../../shared/utils/response.util');

const createCategory = asyncHandler(async (req, res) => {
  const category = await categoryAdminService.createCategory(req.body);
  return sendSuccess(res, { statusCode: 201, message: 'Category created', data: category });
});

const updateCategory = asyncHandler(async (req, res) => {
  const category = await categoryAdminService.updateCategory(req.params.categoryId, req.body);
  return sendSuccess(res, { message: 'Category updated', data: category });
});

const reorderCategories = asyncHandler(async (req, res) => {
  const categories = await categoryAdminService.reorderCategories(req.body.orderedIds);
  return sendSuccess(res, { message: 'Categories reordered', data: categories });
});

const deleteCategory = asyncHandler(async (req, res) => {
  await categoryAdminService.deleteCategory(req.params.categoryId);
  return sendSuccess(res, { message: 'Category deleted' });
});

module.exports = { createCategory, updateCategory, reorderCategories, deleteCategory };
