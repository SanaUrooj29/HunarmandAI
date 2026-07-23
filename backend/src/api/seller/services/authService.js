const otpService = require('../../shared/services/otpService');
const tokenBlacklistService = require('../../shared/services/tokenBlacklistService');
const { signUserToken, decodeToken } = require('../../shared/utils/jwt.util');
const { ROLES } = require('../../shared/constants/enums');

async function requestOtp({ phone, preferredLanguage }) {
  return otpService.requestOtp({ phone, role: ROLES.SELLER, preferredLanguage });
}

async function verifyOtp({ phone, code }) {
  const seller = await otpService.verifyOtp({ phone, role: ROLES.SELLER, code });
  const token = signUserToken({ id: seller._id, role: ROLES.SELLER });

  return {
    token,
    isNewAccount: !seller.profileComplete,
    seller: {
      id: seller._id,
      phone: seller.phone,
      username: seller.username,
      preferredLanguage: seller.preferredLanguage,
      profileComplete: seller.profileComplete,
      verificationStatus: seller.verificationStatus,
    },
  };
}

/** UC-01 — "Logout securely": revokes the specific token presented, not just a client-side discard. */
function logout(rawToken) {
  const decoded = decodeToken(rawToken);
  if (decoded?.jti && decoded?.exp) {
    tokenBlacklistService.revoke(decoded.jti, decoded.exp);
  }
}

module.exports = { requestOtp, verifyOtp, logout };
