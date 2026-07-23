const { Seller } = require('../../shared/models');
const categoryService = require('../../shared/services/categoryService');
const uploadService = require('../../shared/services/uploadService');
const { encryptCnic, decryptCnic, maskCnic } = require('../../shared/utils/hash.util');
const { ApiError } = require('../../shared/utils/apiError.util');

const PROFILE_COMPLETION_FIELDS = ['username', 'cnic', 'shopName', 'city', 'productCategory'];

function toPublicShape(seller) {
  return {
    id: seller._id,
    phone: seller.phone,
    username: seller.username,
    gender: seller.gender,
    dateOfBirth: seller.dateOfBirth,
    preferredLanguage: seller.preferredLanguage,
    shopName: seller.shopName,
    city: seller.city,
    productCategory: seller.productCategory,
    shopDescription: seller.shopDescription,
    socialMediaLinks: seller.socialMediaLinks,
    profilePictureUrl: seller.profilePictureUrl,
    profileComplete: seller.profileComplete,
    verificationStatus: seller.verificationStatus,
    accountStatus: seller.accountStatus,
    wallet: seller.wallet,
    ratingAvg: seller.ratingAvg,
    ratingCount: seller.ratingCount,
    cnicMasked: seller.cnic ? maskCnic(decryptCnic(seller.cnic)) : null,
    createdAt: seller.createdAt,
  };
}

async function getMyProfile(sellerId) {
  const seller = await Seller.findById(sellerId).select('+cnic');
  if (!seller) throw ApiError.notFound('Seller not found');
  return toPublicShape(seller);
}

/**
 * UC-02 Main Flow 1-4 / Alt Flow A1 — accepts partial updates (a seller may
 * save an incomplete profile and finish later). `profileComplete` is
 * recalculated on every save based on whether all required fields are now
 * present, rather than being settable directly by the client.
 */
async function updateMyProfile(sellerId, updates) {
  const seller = await Seller.findById(sellerId).select('+cnic');
  if (!seller) throw ApiError.notFound('Seller not found');

  if (updates.productCategory) {
    await categoryService.assertExistsAndActive(updates.productCategory);
  }

  const editableFields = [
    'username',
    'gender',
    'dateOfBirth',
    'preferredLanguage',
    'shopName',
    'city',
    'productCategory',
    'shopDescription',
    'socialMediaLinks',
  ];
  editableFields.forEach((field) => {
    if (updates[field] !== undefined) seller[field] = updates[field];
  });

  // CNIC is encrypted at rest (NFR-S-04) — only re-encrypt if a new value was submitted.
  if (updates.cnic !== undefined) {
    seller.cnic = encryptCnic(updates.cnic);
  }

  seller.profileComplete = PROFILE_COMPLETION_FIELDS.every((field) => {
    const value = seller[field];
    return value !== undefined && value !== null && value !== '';
  });

  await seller.save();
  return toPublicShape(seller);
}

async function uploadProfilePicture(sellerId, file) {
  const seller = await Seller.findById(sellerId);
  if (!seller) throw ApiError.notFound('Seller not found');

  if (!file) {
    throw ApiError.badRequest('No file provided');
  }

  // Persist the uploaded binary into the Seller document so images
  // are available in Mongo even when an external storage provider
  // is not configured.
  try {
    seller.profilePicture = {
      data: file.buffer,
      contentType: file.mimetype,
    };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[profileService.uploadProfilePicture] failed to set buffer:', err);
    throw ApiError.internal('Failed to store profile picture');
  }

  // Attempt to upload to configured storage provider. If this fails
  // we still persist the buffer in MongoDB and continue — this keeps
  // the app functional in development when S3 isn't available.
  try {
    const uploaded = await uploadService.uploadImage(file, 'profile-pictures');
    if (uploaded && uploaded.url) {
      seller.profilePictureUrl = uploaded.url;
    }
  } catch (err) {
    // Log the storage provider error but do not fail the entire
    // request since the binary is already stored in Mongo.
    // eslint-disable-next-line no-console
    console.error('[profileService.uploadProfilePicture] uploadService error (continuing):', err);
  }

  await seller.save();
  return { profilePictureUrl: seller.profilePictureUrl };
}

/**
 * UC/FR does not specify hard vs. soft delete; following the schema
 * design's recommendation (docx §10 Recommendations) of soft deletes to
 * preserve referential integrity for historical orders/reviews.
 */
async function deleteMyAccount(sellerId) {
  const seller = await Seller.findById(sellerId);
  if (!seller) throw ApiError.notFound('Seller not found');
  seller.accountStatus = 'deleted';
  await seller.save();
}

module.exports = { getMyProfile, updateMyProfile, uploadProfilePicture, deleteMyAccount, toPublicShape };
