/**
 * One-time setup script to create the first Admin account, since the SRS
 * has no admin self-registration flow (admins are internal platform staff).
 *
 * Usage:
 *   ADMIN_SEED_EMAIL=ops@hunarmandai.pk ADMIN_SEED_PASSWORD=ChangeMe123! \
 *   ADMIN_SEED_NAME="Platform Admin" node scripts/seedAdmin.js
 */
const mongoose = require('mongoose');
const { connectDB, disconnectDB } = require('../src/api/shared/database/connection');
const { Admin } = require('../src/api/shared/models');
const { hashPassword } = require('../src/api/shared/utils/hash.util');

async function seedAdmin() {
  const email = process.env.ADMIN_SEED_EMAIL;
  const password = process.env.ADMIN_SEED_PASSWORD;
  const name = process.env.ADMIN_SEED_NAME || 'Platform Admin';

  if (!email || !password) {
    console.error('ADMIN_SEED_EMAIL and ADMIN_SEED_PASSWORD environment variables are required.');
    process.exit(1);
  }

  await connectDB();

  const existing = await Admin.findOne({ email });
  if (existing) {
    console.log(`Admin with email ${email} already exists — skipping.`);
  } else {
    const passwordHash = await hashPassword(password);
    await Admin.create({ email, passwordHash, name, role: 'super_admin' });
    console.log(`Admin account created for ${email}.`);
  }

  await disconnectDB();
  await mongoose.connection.close();
}

seedAdmin().catch((err) => {
  console.error('Failed to seed admin:', err);
  process.exit(1);
});
