/**
 * ML Service Client — SRD Sections 15, 16, 17, 18, 19, 20
 * Node.js → Python FastAPI communication layer.
 *
 * ML failure NEVER prevents complaint submission (SRD Section 24).
 * All functions return a structured result or a safe failure object.
 */

const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const config = require('../config');
const logger = require('../utils/logger');

const mlClient = axios.create({
  baseURL: config.mlServiceUrl,
  timeout: config.mlServiceTimeout,
  headers: {
    'Content-Type': 'application/json',
    'X-Service': 'cybershield-node',
  },
});

/**
 * Check if the ML service is healthy
 * @returns {Promise<boolean>}
 */
async function checkMLHealth() {
  try {
    const res = await mlClient.get('/health', { timeout: 3000 });
    return res.status === 200;
  } catch {
    return false;
  }
}

/**
 * Analyze a URL for malicious indicators
 * @param {string} url
 * @returns {Promise<object>} Analysis result or safe failure object
 */
async function analyzeUrl(url) {
  const requestId = `REQ-${uuidv4().split('-')[0].toUpperCase()}`;
  try {
    const res = await mlClient.post('/api/v1/analyze/url', { url, requestId });
    return { ...res.data, requestId, mlAvailable: true };
  } catch (err) {
    logger.warn(`ML URL analysis failed: ${err.message}`);
    return buildMLFailureResponse(requestId, 'URL', err.message);
  }
}

/**
 * Analyze an email for phishing/spam indicators
 */
async function analyzeEmail({ senderEmail, subject, body, headers, attachments = [] }) {
  const requestId = `REQ-${uuidv4().split('-')[0].toUpperCase()}`;
  try {
    const res = await mlClient.post('/api/v1/analyze/email', {
      senderEmail, subject, body, headers, attachments, requestId,
    });
    return { ...res.data, requestId, mlAvailable: true };
  } catch (err) {
    logger.warn(`ML email analysis failed: ${err.message}`);
    return buildMLFailureResponse(requestId, 'EMAIL', err.message);
  }
}

/**
 * Analyze a phone number for spam/fraud indicators
 */
async function analyzePhone({ phoneNumber, countryCode, message, callType }) {
  const requestId = `REQ-${uuidv4().split('-')[0].toUpperCase()}`;
  try {
    const res = await mlClient.post('/api/v1/analyze/phone', {
      phoneNumber, countryCode, message, callType, requestId,
    });
    return { ...res.data, requestId, mlAvailable: true };
  } catch (err) {
    logger.warn(`ML phone analysis failed: ${err.message}`);
    return buildMLFailureResponse(requestId, 'PHONE', err.message);
  }
}

/**
 * Analyze a file (by metadata, not by executing it)
 */
async function analyzeFile({ sha256Hash, mimeType, fileName, fileSize }) {
  const requestId = `REQ-${uuidv4().split('-')[0].toUpperCase()}`;
  try {
    const res = await mlClient.post('/api/v1/analyze/file', {
      sha256Hash, mimeType, fileName, fileSize, requestId,
    });
    return { ...res.data, requestId, mlAvailable: true };
  } catch (err) {
    logger.warn(`ML file analysis failed: ${err.message}`);
    return buildMLFailureResponse(requestId, 'FILE', err.message);
  }
}

/**
 * Classify an incident's text description
 * @param {string} incidentId - MongoDB ObjectId string
 * @param {string} text       - Incident title + description
 * @param {object} metadata   - Safe metadata to include
 */
async function analyzeIncident({ incidentId, text, metadata = {} }) {
  const requestId = `REQ-${uuidv4().split('-')[0].toUpperCase()}`;
  try {
    const payload = {
      requestId,
      incidentId,
      inputType: 'TEXT',
      text,
      metadata: {
        source: 'incident',
        timestamp: new Date().toISOString(),
        ...metadata,
      },
    };
    const res = await mlClient.post('/api/v1/analyze/incident', payload);
    return { ...res.data, requestId, mlAvailable: true };
  } catch (err) {
    logger.warn(`ML incident analysis failed: ${err.message}`);
    return buildMLFailureResponse(requestId, 'INCIDENT', err.message);
  }
}

/**
 * Build a safe failure response that preserves the contract shape.
 * Clearly marks that no prediction was made.
 */
function buildMLFailureResponse(requestId, inputType, reason) {
  return {
    requestId,
    inputType,
    mlAvailable: false,
    modelName: null,
    modelVersion: null,
    prediction: {
      label: 'UNKNOWN',
      confidence: null,
      riskScore: null,
    },
    probabilities: {},
    indicators: [],
    recommendation: 'ML service is currently unavailable. Manual review required.',
    failureReason: reason,
    processedAt: new Date().toISOString(),
  };
}

module.exports = {
  checkMLHealth,
  analyzeUrl,
  analyzeEmail,
  analyzePhone,
  analyzeFile,
  analyzeIncident,
};
