const userManagementService = require('../services/userManagementService');
const { asyncHandler } = require('../../shared/utils/asyncHandler.util');
const { sendSuccess } = require('../../shared/utils/response.util');

const listSellers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search, verificationStatus, accountStatus } = req.query;
  const { items, meta } = await userManagementService.listSellers({ page, limit, search, verificationStatus, accountStatus });
  return sendSuccess(res, { message: 'Sellers fetched', data: items, meta });
});

const getSellerDetail = asyncHandler(async (req, res) => {
  const seller = await userManagementService.getSellerDetail(req.params.sellerId);
  return sendSuccess(res, { message: 'Seller fetched', data: seller });
});

const verifySeller = asyncHandler(async (req, res) => {
  const seller = await userManagementService.verifySeller(req.params.sellerId);
  return sendSuccess(res, { message: 'Seller verified', data: seller });
});

const suspendSeller = asyncHandler(async (req, res) => {
  const seller = await userManagementService.setSellerAccountStatus(req.params.sellerId, 'suspended');
  return sendSuccess(res, { message: 'Seller suspended', data: seller });
});

const activateSeller = asyncHandler(async (req, res) => {
  const seller = await userManagementService.setSellerAccountStatus(req.params.sellerId, 'active');
  return sendSuccess(res, { message: 'Seller activated', data: seller });
});

const deleteSeller = asyncHandler(async (req, res) => {
  await userManagementService.deleteSeller(req.params.sellerId);
  return sendSuccess(res, { message: 'Seller deleted' });
});

const listBuyers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search, accountStatus } = req.query;
  const { items, meta } = await userManagementService.listBuyers({ page, limit, search, accountStatus });
  return sendSuccess(res, { message: 'Buyers fetched', data: items, meta });
});

const getBuyerDetail = asyncHandler(async (req, res) => {
  const buyer = await userManagementService.getBuyerDetail(req.params.buyerId);
  return sendSuccess(res, { message: 'Buyer fetched', data: buyer });
});

const suspendBuyer = asyncHandler(async (req, res) => {
  const buyer = await userManagementService.setBuyerAccountStatus(req.params.buyerId, 'suspended');
  return sendSuccess(res, { message: 'Buyer suspended', data: buyer });
});

const activateBuyer = asyncHandler(async (req, res) => {
  const buyer = await userManagementService.setBuyerAccountStatus(req.params.buyerId, 'active');
  return sendSuccess(res, { message: 'Buyer activated', data: buyer });
});

const deleteBuyer = asyncHandler(async (req, res) => {
  await userManagementService.deleteBuyer(req.params.buyerId);
  return sendSuccess(res, { message: 'Buyer deleted' });
});

module.exports = {
  listSellers,
  getSellerDetail,
  verifySeller,
  suspendSeller,
  activateSeller,
  deleteSeller,
  listBuyers,
  getBuyerDetail,
  suspendBuyer,
  activateBuyer,
  deleteBuyer,
};
