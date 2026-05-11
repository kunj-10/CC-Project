const path = require('path');
const fs = require('fs');
const { generateKey } = require('../utils/keyGenerator');
const { encryptBuffer } = require('../utils/encryption');

const fileStore = new Map();

/**
 * Save file metadata and encrypt the file on disk.
 * The generated key is used both as the lookup key AND the encryption key.
 * The original plaintext file is replaced with its encrypted version.
 */
function saveFileMetadata(file) {
  const key = generateKey();

  // Read the plaintext file, encrypt it, and overwrite the file on disk
  const plaintext = fs.readFileSync(file.path);
  const encrypted = encryptBuffer(plaintext, key);
  fs.writeFileSync(file.path, encrypted);

  const metadata = {
    filename: file.originalname,
    storedName: file.filename,
    path: file.path,
    size: file.size,           // original size (before encryption)
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
