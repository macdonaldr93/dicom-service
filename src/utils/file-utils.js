const {createHash} = require('crypto');

/**
 * Generate a SHA256 checksum to ensure the integrity.
 *
 * @param {Buffer} file The file buffer
 *
 * @returns {string} The file checksum
 */
function generateFileChecksum(file) {
  return createHash('sha256').update(file).digest('hex');
}

module.exports = {
  generateFileChecksum,
};
