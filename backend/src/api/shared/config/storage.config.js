const { env } = require('./env');

/**
 * Provider-agnostic storage config. SRS §2.1 specifies "cloud object
 * storage" generically rather than a named vendor, so this config targets
 * any S3-compatible endpoint (AWS S3, Cloudflare R2, DigitalOcean Spaces,
 * MinIO for local dev) via the same client shape.
 */
module.exports = {
  provider: env.STORAGE_PROVIDER,
  bucket: env.STORAGE_BUCKET,
  region: env.STORAGE_REGION,
  endpoint: env.STORAGE_ENDPOINT || undefined, // undefined -> SDK default (real AWS S3)
  credentials: {
    accessKeyId: env.STORAGE_ACCESS_KEY_ID,
    secretAccessKey: env.STORAGE_SECRET_ACCESS_KEY,
  },
  cdnBaseUrl: env.STORAGE_CDN_BASE_URL, // if set, public URLs are rewritten through the CDN
  maxFileSizeBytes: 8 * 1024 * 1024, // 8MB per product image
  allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
};
