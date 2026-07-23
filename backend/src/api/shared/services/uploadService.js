const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const crypto = require('crypto');
const path = require('path');
const storageConfig = require('../config/storage.config');
const { ApiError } = require('../utils/apiError.util');

/**
 * Provider-agnostic upload service. Targets any S3-compatible endpoint
 * (SRS §2.1 / §6.3 — "cloud object storage", not a named vendor), so
 * swapping AWS S3 <-> Cloudflare R2 <-> DigitalOcean Spaces is just an
 * env change (STORAGE_ENDPOINT), not a code change.
 */
// Initialize S3 client only when provider is not 'mongo' to allow
// storing images directly in Mongo (data URLs) for simple dev setups.
const provider = storageConfig.provider || 'mongo';
let s3Client = null;
if (provider && provider !== 'mongo') {
  s3Client = new S3Client({
    region: storageConfig.region,
    endpoint: storageConfig.endpoint,
    credentials: storageConfig.credentials,
    forcePathStyle: Boolean(storageConfig.endpoint), // required by most non-AWS S3-compatible providers
  });
}

function assertValidFile(file) {
  if (!file || !file.buffer) {
    throw ApiError.badRequest('No file provided');
  }
  if (!storageConfig.allowedMimeTypes.includes(file.mimetype)) {
    throw ApiError.badRequest(
      `Unsupported file type "${file.mimetype}". Allowed: ${storageConfig.allowedMimeTypes.join(', ')}`
    );
  }
  if (file.size > storageConfig.maxFileSizeBytes) {
    throw ApiError.badRequest(`File exceeds maximum size of ${storageConfig.maxFileSizeBytes / (1024 * 1024)}MB`);
  }
}

function buildObjectKey(folder, originalName) {
  const ext = path.extname(originalName || '').toLowerCase() || '.jpg';
  const unique = crypto.randomBytes(16).toString('hex');
  return `${folder}/${Date.now()}-${unique}${ext}`;
}

function toPublicUrl(key) {
  if (storageConfig.cdnBaseUrl) {
    return `${storageConfig.cdnBaseUrl.replace(/\/$/, '')}/${key}`;
  }
  const base = storageConfig.endpoint || `https://${storageConfig.bucket}.s3.${storageConfig.region}.amazonaws.com`;
  return `${base.replace(/\/$/, '')}/${storageConfig.bucket}/${key}`;
}

/**
 * @param {Express.Multer.File} file  in-memory multer file (buffer, mimetype, size, originalname)
 * @param {string} folder             e.g. 'products', 'profile-pictures'
 * @returns {Promise<{url: string, key: string}>}
 */
async function uploadImage(file, folder) {
  assertValidFile(file);
  const key = buildObjectKey(folder, file.originalname);

  // If configured to use Mongo as storage provider, return a data URL
  // containing the base64-encoded image. This keeps images inside the
  // DB schema (stored as a string) for simple setups / local dev.
  if (provider === 'mongo') {
    const base64 = file.buffer.toString('base64');
    const dataUrl = `data:${file.mimetype};base64,${base64}`;
    return { url: dataUrl, key: null };
  }

  if (!s3Client) {
    throw ApiError.internal('Storage client not configured');
  }

  await s3Client.send(
    new PutObjectCommand({
      Bucket: storageConfig.bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read',
    })
  );

  return { url: toPublicUrl(key), key };
}

async function deleteImage(key) {
  if (provider === 'mongo') {
    // No-op for mongo provider (images are embedded in DB)
    return;
  }
  if (!s3Client) return;
  await s3Client.send(new DeleteObjectCommand({ Bucket: storageConfig.bucket, Key: key }));
}

module.exports = { uploadImage, deleteImage };
