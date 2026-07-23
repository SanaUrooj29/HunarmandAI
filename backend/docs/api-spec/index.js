module.exports = {
  apiTitle: 'HunarmandAI API',
  apiVersion: '1.0.0',
  description:
    'AI-powered marketplace connecting Pakistan\u2019s informal artisans, craftsmen, farmers, and small businesses with buyers. REST API, JSON request/response bodies unless noted (file uploads use multipart/form-data).',
  serverUrl: 'http://localhost:5000',
  responseEnvelope: {
    success: {
      success: true,
      message: 'Human-readable summary',
      data: '<endpoint-specific payload>',
      meta: '<optional, present on paginated list endpoints: {page, limit, total, totalPages}>',
    },
    error: {
      success: false,
      message: 'Human-readable error summary',
      code: 'MACHINE_READABLE_CODE',
      details: '<optional, e.g. field-level validation errors>',
    },
  },
  authModels: [
    {
      name: 'Buyer / Seller',
      description:
        'OTP-based (phone number). POST /auth/otp/request, then POST /auth/otp/verify to receive a Bearer JWT (7-day default expiry). Send as "Authorization: Bearer <token>" on every subsequent request.',
    },
    {
      name: 'Admin',
      description:
        'Email + password. POST /api/admin/auth/login returns a Bearer JWT (12-hour default expiry, separate signing secret from buyer/seller tokens \u2014 the two are never interchangeable).',
    },
  ],
  commonErrorCodes: [
    { status: 400, code: 'BAD_REQUEST', description: 'Validation failure or a business rule was violated (e.g. insufficient wallet balance)' },
    { status: 401, code: 'UNAUTHORIZED', description: 'Missing/invalid/expired/revoked token, or wrong credentials' },
    { status: 403, code: 'FORBIDDEN', description: 'Authenticated, but not allowed to perform this action (wrong role, or a gating rule like PROFILE_INCOMPLETE / WITHDRAWAL_NOT_ELIGIBLE)' },
    { status: 404, code: 'NOT_FOUND', description: 'Resource does not exist, or exists but is not owned by the caller (ownership checks return 404, not 403, to avoid confirming existence)' },
    { status: 409, code: 'CONFLICT', description: 'A uniqueness or state conflict (duplicate resource, product has open orders, category in use, etc.)' },
    { status: 429, code: 'TOO_MANY_REQUESTS', description: 'Rate limit exceeded (OTP request/verify limits, or the general API limiter)' },
    { status: 500, code: 'INTERNAL_ERROR', description: 'Unexpected server error' },
  ],
  modules: {
    shared: require('./shared.spec'),
    seller: require('./seller.spec'),
    buyer: require('./buyer.spec'),
    admin: require('./admin.spec'),
  },
};
