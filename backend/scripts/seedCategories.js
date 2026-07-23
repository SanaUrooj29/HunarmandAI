/**
 * One-time setup script seeding the confirmed product category taxonomy
 * (SRS FR-6-03). Safe to re-run — upserts by (name, parentCategory).
 *
 * Usage: node scripts/seedCategories.js
 */
const mongoose = require('mongoose');
const { connectDB } = require('../src/api/shared/database/connection');
const { Category } = require('../src/api/shared/models');
const { TOP_LEVEL_CATEGORIES, CLOTHING_SUBCATEGORIES } = require('../src/api/shared/constants/enums');

async function upsertCategory(name, parentCategory, sortOrder) {
  return Category.findOneAndUpdate(
    { name, parentCategory: parentCategory || null },
    { name, parentCategory: parentCategory || null, sortOrder, status: 'active' },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
}

async function seedCategories() {
  await connectDB();

  for (let i = 0; i < TOP_LEVEL_CATEGORIES.length; i += 1) {
    const name = TOP_LEVEL_CATEGORIES[i];
    const category = await upsertCategory(name, null, i);
    console.log(`Upserted top-level category: ${name}`);

    if (name === 'Clothing') {
      for (let j = 0; j < CLOTHING_SUBCATEGORIES.length; j += 1) {
        await upsertCategory(CLOTHING_SUBCATEGORIES[j], category._id, j);
        console.log(`  Upserted subcategory: ${CLOTHING_SUBCATEGORIES[j]}`);
      }
    }
  }

  console.log('Category seeding complete.');
  await mongoose.connection.close();
}

seedCategories().catch((err) => {
  console.error('Failed to seed categories:', err);
  process.exit(1);
});
