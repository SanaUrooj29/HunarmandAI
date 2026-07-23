const { Category, Product } = require('../../shared/models');
const { ApiError } = require('../../shared/utils/apiError.util');

async function createCategory({ name, parentCategory, sortOrder }) {
  if (parentCategory) {
    const parent = await Category.findById(parentCategory);
    if (!parent) throw ApiError.notFound('Parent category not found');
  }
  return Category.create({ name, parentCategory: parentCategory || null, sortOrder: sortOrder || 0 });
}

async function updateCategory(categoryId, updates) {
  const category = await Category.findById(categoryId);
  if (!category) throw ApiError.notFound('Category not found');

  ['name', 'sortOrder', 'status'].forEach((field) => {
    if (updates[field] !== undefined) category[field] = updates[field];
  });
  await category.save();
  return category;
}

/** 4.5 — reordering is just a bulk sortOrder update across siblings. */
async function reorderCategories(orderedIds) {
  for (let i = 0; i < orderedIds.length; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    await Category.updateMany({ _id: orderedIds[i] }, { $set: { sortOrder: i } });
  }
  return Category.find({ _id: { $in: orderedIds } }).sort({ sortOrder: 1 }).lean();
}

async function deleteCategory(categoryId) {
  const inUse = await Product.countDocuments({ categoryId });
  if (inUse > 0) {
    throw ApiError.conflict('Cannot delete a category that has products assigned to it', {
      code: 'CATEGORY_IN_USE',
    });
  }
  const hasChildren = await Category.countDocuments({ parentCategory: categoryId });
  if (hasChildren > 0) {
    throw ApiError.conflict('Cannot delete a category that has subcategories', { code: 'CATEGORY_HAS_CHILDREN' });
  }
  await Category.deleteOne({ _id: categoryId });
}

module.exports = { createCategory, updateCategory, reorderCategories, deleteCategory };
