const crypto = require('crypto');

const ALGORITHM = 'aes-256-cbc';

/**
 * Derive a 32-byte encryption key and 16-byte IV from the hex key string.
 * Uses SHA-512 hash: first 32 bytes → AES key, next 16 bytes → IV.
 * This makes encryption fully deterministic based on the key,
 * so the same key always decrypts the file correctly.
 */
function deriveKeyAndIV(hexKey) {
  const hash = crypto.createHash('sha512').update(hexKey).digest();
  return {
    encKey: hash.subarray(0, 32),
    iv: hash.subarray(32, 48),
  };
}

/**
 * Encrypt a buffer using AES-256-CBC with a key derived from the hex key.
 * @param {Buffer} inputBuffer - The plaintext file data.
 * @param {string} hexKey - The 32-char hex key string.
 * @returns {Buffer} The encrypted data.
 */
function encryptBuffer(inputBuffer, hexKey) {
  const { encKey, iv } = deriveKeyAndIV(hexKey);
  const cipher = crypto.createCipheriv(ALGORITHM, encKey, iv);
  return Buffer.concat([cipher.update(inputBuffer), cipher.final()]);
}

/**
 * Decrypt a buffer using AES-256-CBC with a key derived from the hex key.
 * @param {Buffer} encryptedBuffer - The encrypted file data.
 * @param {string} hexKey - The 32-char hex key string.
 * @returns {Buffer} The decrypted plaintext data.
 */
function decryptBuffer(encryptedBuffer, hexKey) {
  const { encKey, iv } = deriveKeyAndIV(hexKey);
  const decipher = crypto.createDecipheriv(ALGORITHM, encKey, iv);
  return Buffer.concat([decipher.update(encryptedBuffer), decipher.final()]);
}

module.exports = { encryptBuffer, decryptBuffer };
