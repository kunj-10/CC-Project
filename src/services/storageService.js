const path = require('path');
const { generateKey } = require('../utils/keyGenerator');

/**
 * In-memory file metadata store.
 * Maps key -> { filename, path, uploadedAt }
 *
 * For demo purposes only — data is lost on restart,
 * but uploaded files remain on disk in the uploads/ directory.
 */
const fileStore = new Map();

/**
 * Save file metadata and generate a unique access key.
 * @param {object} file - The multer file object
 * @returns {{ key: string, filename: string }}
 */
function saveFileMetadata(file) {
  const key = generateKey();
  const metadata = {
    filename: file.originalname,
    storedName: file.filename,
    path: file.path,
    size: file.size,
    mimetype: file.mimetype,
    uploadedAt: new Date().toISOString(),
  };
  fileStore.set(key, metadata);
  return { key, filename: file.originalname };
}

/**
 * Retrieve file metadata by key.
 * @param {string} key
 * @returns {object|null}
 */
function getFileMetadata(key) {
  return fileStore.get(key) || null;
}

/**
 * Get total number of stored file entries.
 * @returns {number}
 */
function getTotalFiles() {
  return fileStore.size;
}

module.exports = { saveFileMetadata, getFileMetadata, getTotalFiles };
