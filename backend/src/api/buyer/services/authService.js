const otpService = require('../../shared/services/otpService');
const tokenBlacklistService = require('../../shared/services/tokenBlacklistService');
const { signUserToken, decodeToken } = require('../../shared/utils/jwt.util');
const { ROLES } = require('../../shared/constants/enums');

async function requestOtp({ phone, preferredLanguage }) {
  return otpService.requestOtp({ phone, role: ROLES.BUYER, preferredLanguage });
}

async function verifyOtp({ phone, code }) {
  const buyer = await otpService.verifyOtp({ phone, role: ROLES.BUYER, code });
  const token = signUserToken({ id: buyer._id, role: ROLES.BUYER });

  return {
    token,
    isNewAccount: !buyer.name,
    buyer: {
      id: buyer._id,
      phone: buyer.phone,
      name: buyer.name,
      age: buyer.age,
      preferredLanguage: buyer.preferredLanguage,
      credibilityScore: buyer.credibilityScore.value,
    },
  };
}

function logout(rawToken) {
  const decoded = decodeToken(rawToken);
  if (decoded?.jti && decoded?.exp) {
    tokenBlacklistService.revoke(decoded.jti, decoded.exp);
  }
}

module.exports = { requestOtp, verifyOtp, logout };
