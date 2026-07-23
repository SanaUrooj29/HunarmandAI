const { Buyer } = require('../../shared/models');
const { ApiError } = require('../../shared/utils/apiError.util');

function toPublicShape(buyer) {
  return {
    id: buyer._id,
    phone: buyer.phone,
    name: buyer.name,
    age: buyer.age,
    preferredLanguage: buyer.preferredLanguage,
    addresses: buyer.addresses,
    accountStatus: buyer.accountStatus,
    credibilityScore: buyer.credibilityScore,
    createdAt: buyer.createdAt,
  };
}

async function getMyProfile(buyerId) {
  const buyer = await Buyer.findById(buyerId);
  if (!buyer) throw ApiError.notFound('Buyer not found');
  return toPublicShape(buyer);
}

async function updateMyProfile(buyerId, updates) {
  const buyer = await Buyer.findById(buyerId);
  if (!buyer) throw ApiError.notFound('Buyer not found');

  if (updates.name !== undefined) buyer.name = updates.name;
  if (updates.age !== undefined) buyer.age = updates.age;
  if (updates.preferredLanguage !== undefined) buyer.preferredLanguage = updates.preferredLanguage;

  await buyer.save();
  return toPublicShape(buyer);
}

async function addAddress(buyerId, address) {
  const buyer = await Buyer.findById(buyerId);
  if (!buyer) throw ApiError.notFound('Buyer not found');

  if (address.isDefault) {
    buyer.addresses.forEach((a) => { a.isDefault = false; });
  }
  // First saved address is always the default, regardless of the flag sent.
  if (buyer.addresses.length === 0) address.isDefault = true;

  buyer.addresses.push(address);
  await buyer.save();
  return buyer.addresses;
}

async function updateAddress(buyerId, addressId, updates) {
  const buyer = await Buyer.findById(buyerId);
  if (!buyer) throw ApiError.notFound('Buyer not found');

  const address = buyer.addresses.id(addressId);
  if (!address) throw ApiError.notFound('Address not found');

  if (updates.isDefault) {
    buyer.addresses.forEach((a) => { a.isDefault = false; });
  }
  ['label', 'addressLine', 'city', 'isDefault'].forEach((field) => {
    if (updates[field] !== undefined) address[field] = updates[field];
  });

  await buyer.save();
  return buyer.addresses;
}

async function deleteAddress(buyerId, addressId) {
  const buyer = await Buyer.findById(buyerId);
  if (!buyer) throw ApiError.notFound('Buyer not found');

  const address = buyer.addresses.id(addressId);
  if (!address) throw ApiError.notFound('Address not found');
  const wasDefault = address.isDefault;

  buyer.addresses.pull(addressId);
  if (wasDefault && buyer.addresses.length > 0) {
    buyer.addresses[0].isDefault = true;
  }

  await buyer.save();
  return buyer.addresses;
}

module.exports = { getMyProfile, updateMyProfile, addAddress, updateAddress, deleteAddress, toPublicShape };
