const crypto = require('crypto');

/**
 * Generate a unique random key for file access.
 * Uses crypto.randomBytes for cryptographically secure randomness.
 * @returns {string} A 32-character hex string
 */
function generateKey() {
  return crypto.randomBytes(16).toString('hex');
}

module.exports = { generateKey };
