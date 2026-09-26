/**
 * Multer Upload Middleware — SRD Section 13
 * Handles multipart/form-data evidence uploads.
 * Validates MIME type, file size, and extension before saving.
 */

const multer = require('multer');
const path = require('path');
const fs = require('fs');
const config = require('../config');
const { getAllowedMimeTypes, generateSafeFilename, validateFileType } = require('../utils/fileUtils');
const AppError = require('../utils/AppError');

// Ensure upload directory exists
const uploadDir = path.resolve(config.uploadDir);
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    // Always use a safe server-generated filename — never the original
    cb(null, generateSafeFilename(file.originalname));
  },
});

function fileFilter(_req, file, cb) {
  const { valid, reason } = validateFileType(file.mimetype, file.originalname);
  if (!valid) {
    return cb(new AppError(reason, 400, 'UNSUPPORTED_FILE'), false);
  }
  cb(null, true);
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.maxFileSizeMB * 1024 * 1024,
    files: 5, // Max 5 files per request
  },
});

/**
 * Single file upload — field name: 'evidence'
 */
const uploadSingle = upload.single('evidence');

/**
 * Multiple files upload — field name: 'evidence', max 5
 */
const uploadMultiple = upload.array('evidence', 5);

module.exports = { uploadSingle, uploadMultiple };
