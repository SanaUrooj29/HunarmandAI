const { Seller, Buyer } = require('../../shared/models');
const { ApiError } = require('../../shared/utils/apiError.util');
const { paginationMeta } = require('../../shared/utils/response.util');
const { maskCnic, decryptCnic } = require('../../shared/utils/hash.util');
const notificationService = require('../../shared/services/notificationService');

/* -------------------------------------------------------------- SELLERS */

/** Decryption can legitimately fail (key rotation, malformed legacy data) —
 * never let one bad record 500 an entire admin list endpoint over it. */
function safeMaskCnic(encryptedCnic) {
  if (!encryptedCnic) return null;
  try {
    return maskCnic(decryptCnic(encryptedCnic));
  } catch (err) {
    return 'UNREADABLE';
  }
}

function sellerPublicShape(seller) {
  return {
    id: seller._id,
    phone: seller.phone,
    username: seller.username,
    shopName: seller.shopName,
    city: seller.city,
    verificationStatus: seller.verificationStatus,
    accountStatus: seller.accountStatus,
    profileComplete: seller.profileComplete,
    wallet: seller.wallet,
    ratingAvg: seller.ratingAvg,
    ratingCount: seller.ratingCount,
    cnicMasked: safeMaskCnic(seller.cnic),
    createdAt: seller.createdAt,
  };
}

async function listSellers({ page = 1, limit = 20, search, verificationStatus, accountStatus } = {}) {
  const filter = {};
  if (verificationStatus) filter.verificationStatus = verificationStatus;
  if (accountStatus) filter.accountStatus = accountStatus;
  if (search) filter.$or = [{ username: new RegExp(search, 'i') }, { shopName: new RegExp(search, 'i') }, { phone: new RegExp(search, 'i') }];

  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Seller.find(filter).select('+cnic').sort({ createdAt: -1 }).skip(skip).limit(limit),
    Seller.countDocuments(filter),
  ]);
  return { items: items.map(sellerPublicShape), meta: paginationMeta({ page, limit, total }) };
}

async function getSellerDetail(sellerId) {
  const seller = await Seller.findById(sellerId).select('+cnic');
  if (!seller) throw ApiError.notFound('Seller not found');
  return sellerPublicShape(seller);
}

/** 4.3 — Verify sellers */
async function verifySeller(sellerId) {
  const seller = await Seller.findById(sellerId);
  if (!seller) throw ApiError.notFound('Seller not found');
  seller.verificationStatus = 'verified';
  await seller.save();
  await notificationService.notify({
    recipientType: 'seller',
    recipientId: sellerId,
    type: 'seller_verified',
    title: 'Your seller account has been verified',
  });
  return sellerPublicShape(seller);
}

async function setSellerAccountStatus(sellerId, accountStatus) {
  const seller = await Seller.findById(sellerId);
  if (!seller) throw ApiError.notFound('Seller not found');
  seller.accountStatus = accountStatus;
  if (accountStatus === 'suspended') seller.verificationStatus = 'suspended';
  await seller.save();
  await notificationService.notify({
    recipientType: 'seller',
    recipientId: sellerId,
    type: 'account_status_changed',
    title: `Your account has been ${accountStatus}`,
  });
  return sellerPublicShape(seller);
}

async function deleteSeller(sellerId) {
  const seller = await Seller.findById(sellerId);
  if (!seller) throw ApiError.notFound('Seller not found');
  seller.accountStatus = 'deleted'; // soft delete — preserves order/review history
  await seller.save();
}

/* --------------------------------------------------------------- BUYERS */

function buyerPublicShape(buyer) {
  return {
    id: buyer._id,
    phone: buyer.phone,
    name: buyer.name,
    accountStatus: buyer.accountStatus,
    credibilityScore: buyer.credibilityScore,
    createdAt: buyer.createdAt,
  };
}

async function listBuyers({ page = 1, limit = 20, search, accountStatus } = {}) {
  const filter = {};
  if (accountStatus) filter.accountStatus = accountStatus;
  if (search) filter.$or = [{ name: new RegExp(search, 'i') }, { phone: new RegExp(search, 'i') }];

  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Buyer.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Buyer.countDocuments(filter),
  ]);
  return { items: items.map(buyerPublicShape), meta: paginationMeta({ page, limit, total }) };
}

async function getBuyerDetail(buyerId) {
  const buyer = await Buyer.findById(buyerId);
  if (!buyer) throw ApiError.notFound('Buyer not found');
  return buyerPublicShape(buyer);
}

async function setBuyerAccountStatus(buyerId, accountStatus) {
  const buyer = await Buyer.findById(buyerId);
  if (!buyer) throw ApiError.notFound('Buyer not found');
  buyer.accountStatus = accountStatus;
  await buyer.save();
  await notificationService.notify({
    recipientType: 'buyer',
    recipientId: buyerId,
    type: 'account_status_changed',
    title: `Your account has been ${accountStatus}`,
  });
  return buyerPublicShape(buyer);
}

async function deleteBuyer(buyerId) {
  const buyer = await Buyer.findById(buyerId);
  if (!buyer) throw ApiError.notFound('Buyer not found');
  buyer.accountStatus = 'deleted';
  await buyer.save();
}

module.exports = {
  listSellers,
  getSellerDetail,
  verifySeller,
  setSellerAccountStatus,
  deleteSeller,
  listBuyers,
  getBuyerDetail,
  setBuyerAccountStatus,
  deleteBuyer,
};
