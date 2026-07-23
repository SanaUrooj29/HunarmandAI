/**
 * Consistent envelope for every API response so frontend clients (buyer PWA,
 * seller PWA, admin dashboard) can parse responses uniformly regardless of
 * which panel/controller produced them.
 */

function sendSuccess(res, { statusCode = 200, message = 'OK', data = null, meta = null } = {}) {
  const body = { success: true, message, data };
  if (meta) body.meta = meta;
  return res.status(statusCode).json(body);
}

function sendError(res, { statusCode = 500, message = 'Something went wrong', code = 'INTERNAL_ERROR', details = null } = {}) {
  const body = { success: false, message, code };
  if (details) body.details = details;
  return res.status(statusCode).json(body);
}

/** Standard pagination meta block, used by any list endpoint. */
function paginationMeta({ page, limit, total }) {
  return {
    page,
    limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}

module.exports = { sendSuccess, sendError, paginationMeta };
