/**
 * JWTs are stateless by design, which means "logout" normally does nothing
 * server-side. To make UC-01's "Logout securely" a real guarantee rather
 * than a client-side no-op, every signed token carries a `jti`, and logout
 * adds that jti here until the token's natural expiry.
 *
 * In-memory Map is sufficient for a single-instance MVP deployment. If the
 * backend scales horizontally across multiple processes, swap this for a
 * shared store (Redis) keyed the same way — the interface below would not
 * need to change.
 */

const blacklist = new Map(); // jti -> expiresAtEpochMs

function revoke(jti, expiresAtEpochSeconds) {
  blacklist.set(jti, expiresAtEpochSeconds * 1000);
}

function isRevoked(jti) {
  const expiresAt = blacklist.get(jti);
  if (!expiresAt) return false;
  if (expiresAt < Date.now()) {
    blacklist.delete(jti); // lazy cleanup — no longer relevant, token would fail exp check anyway
    return false;
  }
  return true;
}

// Periodic sweep so the map doesn't grow unbounded between lazy cleanups.
setInterval(() => {
  const now = Date.now();
  for (const [jti, expiresAt] of blacklist.entries()) {
    if (expiresAt < now) blacklist.delete(jti);
  }
}, 15 * 60 * 1000).unref();

module.exports = { revoke, isRevoked };
