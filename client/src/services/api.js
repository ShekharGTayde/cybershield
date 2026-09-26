import axios from 'axios';
import { MOCK_USERS, MOCK_INCIDENTS, MOCK_ALERTS, MOCK_THREAT_INTELLIGENCE, MOCK_ML_METRICS, MOCK_AUDIT_LOGS } from './mockData';
import { calculateSHA256, generateBlockchainRecord } from './crypto';

// In-memory runtime state for offline/demo fallback
let incidents = [...MOCK_INCIDENTS];
let alerts = [...MOCK_ALERTS];
let threatIntel = [...MOCK_THREAT_INTELLIGENCE];
let auditLogs = [...MOCK_AUDIT_LOGS];

// Axios client configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 15000,
});

// Attach Authorization Bearer token from localStorage
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('cybershield_token');
    if (token && !token.startsWith('mock-jwt-token')) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response error handler to extract meaningful error messages
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const serverMessage = error.response?.data?.error?.message || error.response?.data?.message;
    const validationDetails = error.response?.data?.error?.details;
    if (validationDetails && Array.isArray(validationDetails) && validationDetails.length > 0) {
      const detailedMsg = validationDetails.map((d) => d.message).join(' | ');
      return Promise.reject(new Error(detailedMsg || serverMessage || 'Validation failed'));
    }
    if (serverMessage) {
      return Promise.reject(new Error(serverMessage));
    }
    if (error.code === 'ERR_NETWORK') {
      return Promise.reject(new Error('Network error: Unable to reach CyberShield backend server. Please verify the server is running on port 5000.'));
    }
    return Promise.reject(error);
  }
);

/**
 * Intelligent client-side AI Threat Detection Heuristic
 * Generates exact SRD Section 31 ML Output Contract for instant previews & offline scans
 */
export async function analyzeThreat(input) {
  await new Promise((r) => setTimeout(r, 400)); // Simulate ML inference latency

  const text = (input.text || input.url || input.body || input.phoneNumber || '').toLowerCase();
  const inputType = input.inputType || 'TEXT';

  let classification = 'LEGITIMATE';
  let riskScore = 15;
  let confidence = 0.92;
  let indicators = [];
  let recommendation = 'No malicious indicators detected. Exercise normal digital hygiene.';

  const isPhishingKeywords = ['sparsh', 'pension', 'update-portal', 'kyc', 'life certificate', 'login', 'verify', 'urgent', 'blocked', 'aadhaar', 'otp', 'click here'];
  const isEspionageKeywords = ['unit movement', 'deployment', 'high altitude', 'corps', 'brigade', 'ammunition', 'cantonment', 'posting order', 'classified', 'exercise', 'officer list'];
  const isMalwareKeywords = ['apk', 'install', 'download now', 'trojan', 'exe', 'update.apk', 'payload'];
  const isFinancialKeywords = ['csd canteen', 'token booking', 'advance loan', 'upi', 'gpay', 'paytm', 'refund', 'lottery', '50% discount'];

  const matchedPhishing = isPhishingKeywords.filter((k) => text.includes(k));
  const matchedEspionage = isEspionageKeywords.filter((k) => text.includes(k));
  const matchedMalware = isMalwareKeywords.filter((k) => text.includes(k));
  const matchedFinancial = isFinancialKeywords.filter((k) => text.includes(k));

  if (matchedEspionage.length > 0) {
    classification = 'ESPIONAGE';
    riskScore = Math.min(99, 85 + matchedEspionage.length * 4);
    confidence = 0.97;
    indicators = matchedEspionage.map((k) => `OPSEC Sensitive Keyword: "${k}"`);
    indicators.push('Hostile information gathering pattern detected');
    recommendation = 'CRITICAL OPSEC THREAT: Do NOT disclose information. Report immediately to CERT-Army Counter-Espionage Wing.';
  } else if (matchedMalware.length > 0) {
    classification = 'MALWARE';
    riskScore = 96;
    confidence = 0.98;
    indicators = ['Suspicious file extension / distribution vector', ...matchedMalware.map((k) => `Malware Indicator: "${k}"`)];
    recommendation = 'MALWARE ALERT: Do NOT install or execute this file. Quarantine infected device immediately.';
  } else if (matchedPhishing.length >= 2 || (inputType === 'URL' && (text.includes('.xyz') || text.includes('.top') || text.includes('sparsh')))) {
    classification = 'PHISHING';
    riskScore = Math.min(98, 80 + matchedPhishing.length * 3);
    confidence = 0.96;
    indicators = matchedPhishing.map((k) => `Phishing Keyword: "${k}"`);
    indicators.push('Urgency and credential harvesting indicators detected');
    recommendation = 'Do NOT open the URL or provide military credentials/OTP. Block sender domain.';
  } else if (matchedFinancial.length > 0) {
    classification = 'FINANCIAL_FRAUD';
    riskScore = 78;
    confidence = 0.94;
    indicators = matchedFinancial.map((k) => `Fraud Keyword: "${k}"`);
    indicators.push('Fraudulent payment solicitations');
    recommendation = 'Suspicious financial demand. Validate directly with official military welfare cell.';
  } else if (text.length > 0 && inputType === 'PHONE' && (text.includes('94002') || text.includes('98451'))) {
    classification = 'SPAM';
    riskScore = 82;
    confidence = 0.91;
    indicators = ['Number matched in active Defence Threat Intelligence Database'];
    recommendation = 'Spam/Robocaller flagged in previous defence incidents. Block number.';
  }

  const probabilities = {
    PHISHING: classification === 'PHISHING' ? confidence : 0.02,
    MALWARE: classification === 'MALWARE' ? confidence : 0.01,
    SPAM: classification === 'SPAM' ? confidence : 0.03,
    FINANCIAL_FRAUD: classification === 'FINANCIAL_FRAUD' ? confidence : 0.02,
    ESPIONAGE: classification === 'ESPIONAGE' ? confidence : 0.01,
    OPSEC_RISK: classification === 'ESPIONAGE' ? 0.95 : 0.05,
    SOCIAL_ENGINEERING: (classification === 'PHISHING' || classification === 'ESPIONAGE') ? 0.85 : 0.05,
    LEGITIMATE: classification === 'LEGITIMATE' ? 0.95 : 0.02,
  };

  return {
    requestId: 'REQ-' + Math.floor(100000 + Math.random() * 900000),
    modelName: 'cyber-threat-classifier',
    modelVersion: '2.1.0-mil-fastapi',
    prediction: {
      label: classification,
      confidence,
      riskScore,
    },
    probabilities,
    indicators,
    recommendation,
    processedAt: new Date().toISOString(),
  };
}

/**
 * Calculates priority score (P1 - P4) based on SRD Section 26 & 33
 */
export function calculatePriorityScore(incidentType, riskScore, financialLoss, lossAmount) {
  let score = riskScore;
  if (incidentType === 'ESPIONAGE' || incidentType === 'OPSEC_RISK') score = Math.max(score, 95);
  if (incidentType === 'MALWARE') score = Math.max(score, 90);
  if (financialLoss && lossAmount > 50000) score = Math.max(score, 85);

  let severity = 'LOW';
  let priority = 'P4';

  if (score >= 81) {
    severity = 'CRITICAL';
    priority = 'P1';
  } else if (score >= 61) {
    severity = 'HIGH';
    priority = 'P2';
  } else if (score >= 31) {
    severity = 'MEDIUM';
    priority = 'P3';
  }

  return { priorityScore: score, severity, priority };
}

// Integrated API Service
export const api = {
  // Threat scanner export
  analyzeThreat,

  // Authentication
  auth: {
    login: async (credentials) => {
      try {
        const res = await apiClient.post('/auth/login', {
          serviceId: credentials.serviceId.trim(),
          password: credentials.password,
        });
        return res.data;
      } catch (err) {
        // Fallback for mock demo accounts if server rejects
        const mockUser = MOCK_USERS.find(
          (u) => u.serviceId.toLowerCase() === credentials.serviceId.toLowerCase()
        );
        if (mockUser && credentials.password === 'DemoPass@123') {
          return {
            success: true,
            data: { user: mockUser, token: 'mock-jwt-token-' + mockUser._id },
          };
        }
        throw err;
      }
    },

    register: async (userData) => {
      try {
        const res = await apiClient.post('/auth/register', {
          fullName: userData.fullName.trim(),
          serviceId: userData.serviceId.trim().toUpperCase(),
          email: userData.email.trim().toLowerCase(),
          phone: userData.phone.trim(),
          userType: userData.userType || 'DEFENCE_PERSONNEL',
          organization: userData.organization || 'Indian Army',
          rank: userData.rank || '',
          password: userData.password,
          confirmPassword: userData.confirmPassword,
          securityQuestion: userData.securityQuestion || '',
          securityAnswer: userData.securityAnswer || '',
          role: userData.role || 'USER',
        });
        return res.data;
      } catch (err) {
        throw err;
      }
    },

    getMe: async () => {
      try {
        const res = await apiClient.get('/auth/me');
        return res.data;
      } catch (err) {
        return { success: false, error: err };
      }
    },

    logout: async () => {
      try {
        await apiClient.post('/auth/logout');
      } catch (e) {
        // ignore logout errors
      }
    },
  },

  // Incidents
  incidents: {
    getAll: async (filter = {}) => {
      try {
        const res = await apiClient.get('/incidents', { params: filter });
        return res.data;
      } catch (err) {
        console.warn('Backend unavailable, using cached incidents:', err.message);
        return { success: true, data: incidents };
      }
    },

    getById: async (id) => {
      try {
        const res = await apiClient.get(`/incidents/${id}`);
        return res.data;
      } catch (err) {
        const inc = incidents.find((i) => i._id === id || i.complaintId === id);
        if (inc) return { success: true, data: inc };
        throw err;
      }
    },

    create: async (payload, user) => {
      try {
        const cleanPayload = {
          incidentType: payload.incidentType,
          title: payload.title,
          description: payload.description,
          incidentDate: payload.incidentDate,
          incidentTime: payload.incidentTime || '12:00',
          channel: payload.channel || 'WEB',
          suspectedSource: payload.suspectedSource || 'Unknown',
          financialLoss: Boolean(payload.financialLoss),
          lossAmount: Number(payload.lossAmount) || 0,
          currency: payload.currency || 'INR',
          location: payload.location || 'Unit Military Station',
          localId: payload.localId,
          evidences: (payload.evidences || []).map((ev) => ({
            fileName: ev.fileName,
            fileType: ev.fileType || 'FILE',
            mimeType: ev.mimeType || 'application/octet-stream',
            fileSize: ev.fileSize || 1,
            sha256Hash: ev.sha256Hash,
            blockchain: ev.blockchain,
          })),
        };

        const res = await apiClient.post('/incidents', cleanPayload);

        // Also update local array cache
        if (res.data?.data?.incident) {
          incidents.unshift(res.data.data.incident);
        }

        return res.data;
      } catch (err) {
        throw err;
      }
    },

    updateStatus: async (id, status, note, officer) => {
      try {
        const res = await apiClient.patch(`/incidents/${id}`, {
          status,
          note,
          assignedOfficerId: officer?._id,
        });
        return res.data;
      } catch (err) {
        // Fallback to local state if needed
        const inc = incidents.find((i) => i._id === id || i.complaintId === id);
        if (inc) {
          inc.status = status;
          inc.updatedAt = new Date().toISOString();
          inc.timeline.push({
            status,
            timestamp: new Date().toISOString(),
            note: note || `Status updated to ${status}`,
          });
          return { success: true, data: inc };
        }
        throw err;
      }
    },

    addNote: async (id, text, author) => {
      try {
        const res = await apiClient.patch(`/incidents/${id}`, {
          note: text,
        });
        return res.data;
      } catch (err) {
        const inc = incidents.find((i) => i._id === id || i.complaintId === id);
        if (inc) {
          inc.officerNotes = inc.officerNotes || [];
          inc.officerNotes.push({
            id: Date.now(),
            author: author?.fullName || 'Investigating Officer',
            date: new Date().toLocaleString(),
            text,
          });
          return { success: true, data: inc };
        }
        throw err;
      }
    },
  },

  // Threat Detection Tools
  threatDetection: {
    analyzeUrl: async (url) => {
      return analyzeThreat({ url, text: url, inputType: 'URL' });
    },
    analyzeEmail: async ({ senderEmail, subject, body, headers }) => {
      return analyzeThreat({
        text: `Sender: ${senderEmail} Subject: ${subject} Body: ${body} Headers: ${headers || ''}`,
        inputType: 'EMAIL',
      });
    },
    analyzePhone: async ({ phoneNumber, countryCode, message, callType }) => {
      return analyzeThreat({
        text: `Phone: ${phoneNumber} Type: ${callType} Message: ${message || ''}`,
        phoneNumber,
        inputType: 'PHONE',
      });
    },
  },

  // Threat Intelligence & Admin stats
  intelligence: {
    getAll: async () => ({ success: true, data: threatIntel }),
    getMetrics: async () => ({ success: true, data: MOCK_ML_METRICS }),
    getAuditLogs: async () => ({ success: true, data: auditLogs }),
    getAlerts: async () => ({ success: true, data: alerts }),
  },
};
