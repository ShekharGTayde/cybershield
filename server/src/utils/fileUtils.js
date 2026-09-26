/**
 * File Utility Functions
 * Safe filename generation, SHA-256 hashing, MIME validation.
 * NEVER executes uploaded files.
 */

const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');

const readFileAsync = promisify(fs.readFile);

// Allowlisted MIME types with their expected file signatures (magic bytes)
const ALLOWED_TYPES = {
  'image/jpeg': { ext: ['.jpg', '.jpeg'], magic: ['ffd8ff'] },
  'image/png':  { ext: ['.png'],          magic: ['89504e47'] },
  'image/gif':  { ext: ['.gif'],          magic: ['47494638'] },
  'image/webp': { ext: ['.webp'],         magic: ['52494646'] },
  'application/pdf': { ext: ['.pdf'],     magic: ['25504446'] },
  'text/plain': { ext: ['.txt'],          magic: null }, // no reliable magic for txt
  'application/zip': { ext: ['.zip'],     magic: ['504b0304'] },
  'video/mp4':  { ext: ['.mp4'],          magic: ['00000018', '00000020', '66747970'] },
};

/**
 * Compute SHA-256 hash of a file at a given path.
 * @param {string} filePath - Absolute path to the file
 * @returns {Promise<string>} Hex SHA-256 digest
 */
async function computeSHA256(filePath) {
  const buffer = await readFileAsync(filePath);
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

/**
 * Validate MIME type against our allowlist.
 * Also checks the declared extension against the MIME type.
 * @param {string} mimeType
 * @param {string} originalName - original filename (for ext check)
 * @returns {{ valid: boolean, reason?: string }}
 */
function validateFileType(mimeType, originalName) {
  const allowed = ALLOWED_TYPES[mimeType];
  if (!allowed) {
    return { valid: false, reason: `File type '${mimeType}' is not supported.` };
  }

  const ext = path.extname(originalName).toLowerCase();
  if (!allowed.ext.includes(ext)) {
    return {
      valid: false,
      reason: `Extension '${ext}' does not match declared type '${mimeType}'.`,
    };
  }

  return { valid: true };
}

/**
 * Validate file magic bytes against declared MIME type.
 * @param {string} filePath
 * @param {string} mimeType
 * @returns {Promise<{ valid: boolean, reason?: string }>}
 */
async function validateFileMagic(filePath, mimeType) {
  const typeConfig = ALLOWED_TYPES[mimeType];
  if (!typeConfig || !typeConfig.magic) return { valid: true }; // no magic check for this type

  const buffer = await readFileAsync(filePath);
  const hex = buffer.slice(0, 8).toString('hex');

  const matched = typeConfig.magic.some(sig => hex.startsWith(sig));
  if (!matched) {
    return {
      valid: false,
      reason: `File content does not match declared type '${mimeType}'. Possible spoofing attempt.`,
    };
  }

  return { valid: true };
}

/**
 * Generate a safe storage filename.
 * Strips all dangerous characters and replaces them with a UUID-based name.
 * @param {string} originalName
 * @returns {string}
 */
function generateSafeFilename(originalName) {
  const ext = path.extname(originalName).toLowerCase().replace(/[^a-z0-9.]/g, '');
  const id = crypto.randomUUID().replace(/-/g, '');
  return `${id}${ext}`;
}

/**
 * Get the list of allowed MIME type strings (for Multer config)
 */
function getAllowedMimeTypes() {
  return Object.keys(ALLOWED_TYPES);
}

module.exports = {
  computeSHA256,
  validateFileType,
  validateFileMagic,
  generateSafeFilename,
  getAllowedMimeTypes,
  ALLOWED_TYPES,
};
