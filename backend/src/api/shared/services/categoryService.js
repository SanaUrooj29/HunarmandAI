const { Category } = require('../models');
const { ApiError } = require('../utils/apiError.util');

async function listTopLevel() {
  return Category.find({ parentCategory: null, status: 'active' }).sort({ sortOrder: 1 }).lean();
}

async function listSubcategories(parentCategoryId) {
  return Category.find({ parentCategory: parentCategoryId, status: 'active' }).sort({ sortOrder: 1 }).lean();
}

async function listAllActive() {
  const top = await Category.find({ parentCategory: null, status: 'active' }).sort({ sortOrder: 1 }).lean();
  const withChildren = await Promise.all(
    top.map(async (cat) => {
      const subcategories = await listSubcategories(cat._id);
      // Explicit plain-object construction (not `{...cat}`) so this never
      // depends on `cat` already being a lean/plain object — spreading a
      // live Mongoose Document copies its internal bookkeeping fields, not
      // the schema data, and would silently produce a broken API response.
      return {
        _id: cat._id,
        name: cat.name,
        parentCategory: cat.parentCategory,
        sortOrder: cat.sortOrder,
        status: cat.status,
        subcategories,
      };
    })
  );
  return withChildren;
}

async function findById(categoryId) {
  const category = await Category.findById(categoryId).lean();
  if (!category) throw ApiError.notFound('Category not found');
  return category;
}

async function assertExistsAndActive(categoryId) {
  const category = await findById(categoryId);
  if (category.status !== 'active') throw ApiError.badRequest('This category is not currently active');
  return category;
}

module.exports = { listTopLevel, listSubcategories, listAllActive, findById, assertExistsAndActive };
