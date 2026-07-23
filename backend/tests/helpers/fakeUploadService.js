/**
 * Test-only stub for uploadService — this sandbox's network is
 * domain-allow-listed and cannot reach a real S3-compatible endpoint.
 * Returns a deterministic fake URL instead of performing a real upload.
 */
function patchUploadService() {
  const uploadService = require('../../src/api/shared/services/uploadService');
  let counter = 0;
  uploadService.uploadImage = async (file, folder) => {
    counter += 1;
    return { url: `https://fake-cdn.test/${folder}/fake-image-${counter}.jpg`, key: `${folder}/fake-image-${counter}.jpg` };
  };
  uploadService.deleteImage = async () => {};
  return uploadService;
}

module.exports = { patchUploadService };
