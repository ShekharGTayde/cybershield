/**
 * CyberShield Server — Central Configuration
 * All environment variables consumed from a single source of truth.
 */

require('dotenv').config();

const config = {
  // Server
  port: parseInt(process.env.PORT, 10) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',

  // MongoDB
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/cybershield',

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'CHANGE_THIS_SECRET_IN_PRODUCTION',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'CHANGE_THIS_REFRESH_SECRET',
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  // CORS
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',

  // ML Service
  mlServiceUrl: process.env.ML_SERVICE_URL || 'http://localhost:8000',
  mlServiceTimeout: parseInt(process.env.ML_SERVICE_TIMEOUT_MS, 10) || 15000,

  // File Uploads
  maxFileSizeMB: parseInt(process.env.MAX_FILE_SIZE_MB, 10) || 25,
  uploadDir: process.env.UPLOAD_DIR || 'uploads',

  // Encryption
  encryptionKey: process.env.ENCRYPTION_KEY || null,

  // Rate Limiting
  rateLimit: {
    authWindowMs: parseInt(process.env.AUTH_RATE_LIMIT_WINDOW_MS, 10) || 900000, // 15 min
    authMax: parseInt(process.env.AUTH_RATE_LIMIT_MAX, 10) || 20,
    apiMax: parseInt(process.env.API_RATE_LIMIT_MAX, 10) || 200,
  },

  // Risk Score Thresholds (SRD Section 22)
  riskThresholds: {
    LOW: { min: 0, max: 30 },
    MEDIUM: { min: 31, max: 60 },
    HIGH: { min: 61, max: 80 },
    CRITICAL: { min: 81, max: 100 },
  },

  // Priority Score Thresholds (SRD Section 23)
  priorityThresholds: {
    P1: 81,  // CRITICAL
    P2: 61,  // HIGH
    P3: 31,  // MEDIUM
    P4: 0,   // LOW
  },
};

module.exports = config;
