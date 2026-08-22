import { MOCK_USERS, MOCK_INCIDENTS, MOCK_ALERTS, MOCK_THREAT_INTELLIGENCE, MOCK_ML_METRICS, MOCK_AUDIT_LOGS } from './mockData';
import { calculateSHA256, generateBlockchainRecord } from './crypto';

// In-memory runtime state for interactive demo persistence
let incidents = [...MOCK_INCIDENTS];
let alerts = [...MOCK_ALERTS];
let threatIntel = [...MOCK_THREAT_INTELLIGENCE];
let auditLogs = [...MOCK_AUDIT_LOGS];

/**
 * Intelligent client-side AI Threat Detection Heuristic
 * Generates exact SRD Section 31 ML Output Contract
 */
export async function analyzeThreat(input) {
  await new Promise(r => setTimeout(r, 600)); // Simulate ML inference latency

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

  const matchedPhishing = isPhishingKeywords.filter(k => text.includes(k));
  const matchedEspionage = isEspionageKeywords.filter(k => text.includes(k));
  const matchedMalware = isMalwareKeywords.filter(k => text.includes(k));
  const matchedFinancial = isFinancialKeywords.filter(k => text.includes(k));

  if (matchedEspionage.length > 0) {
    classification = 'ESPIONAGE';
    riskScore = Math.min(99, 85 + matchedEspionage.length * 4);
    confidence = 0.97;
    indicators = matchedEspionage.map(k => `OPSEC Sensitive Keyword: "${k}"`);
    indicators.push('Hostile information gathering pattern detected');
    recommendation = 'CRITICAL OPSEC THREAT: Do NOT disclose information. Report immediately to CERT-Army Counter-Espionage Wing.';
  } else if (matchedMalware.length > 0) {
    classification = 'MALWARE';
    riskScore = 96;
    confidence = 0.98;
    indicators = ['Suspicious file extension / distribution vector', ...matchedMalware.map(k => `Malware Indicator: "${k}"`)];
    recommendation = 'MALWARE ALERT: Do NOT install or execute this file. Quarantine infected device immediately.';
  } else if (matchedPhishing.length >= 2 || (inputType === 'URL' && (text.includes('.xyz') || text.includes('.top') || text.includes('sparsh')))) {
    classification = 'PHISHING';
    riskScore = Math.min(98, 80 + matchedPhishing.length * 3);
    confidence = 0.96;
    indicators = matchedPhishing.map(k => `Phishing Keyword: "${k}"`);
    indicators.push('Urgency and credential harvesting indicators detected');
    recommendation = 'Do NOT open the URL or provide military credentials/OTP. Block sender domain.';
  } else if (matchedFinancial.length > 0) {
    classification = 'FINANCIAL_FRAUD';
    riskScore = 78;
    confidence = 0.94;
    indicators = matchedFinancial.map(k => `Fraud Keyword: "${k}"`);
    indicators.push('Fraudulent payment solicitations');
    recommendation = 'Suspicious financial demand. Validate directly with official military welfare cell.';
  } else if (text.length > 0 && inputType === 'PHONE' && (text.includes('94002') || text.includes('98451'))) {
    classification = 'SPAM';
    riskScore = 82;
    confidence = 0.91;
    indicators = ['Number matched in active Defence Threat Intelligence Database'];
    recommendation = 'Spam/Robocaller flagged in previous defence incidents. Block number.';
  }

  // Calculate probabilities object
  const probabilities = {
    PHISHING: classification === 'PHISHING' ? confidence : 0.02,
    MALWARE: classification === 'MALWARE' ? confidence : 0.01,
    SPAM: classification === 'SPAM' ? confidence : 0.03,
    FINANCIAL_FRAUD: classification === 'FINANCIAL_FRAUD' ? confidence : 0.02,
    ESPIONAGE: classification === 'ESPIONAGE' ? confidence : 0.01,
    OPSEC_RISK: classification === 'ESPIONAGE' ? 0.95 : 0.05,
    SOCIAL_ENGINEERING: (classification === 'PHISHING' || classification === 'ESPIONAGE') ? 0.85 : 0.05,
    LEGITIMATE: classification === 'LEGITIMATE' ? 0.95 : 0.02
  };

  return {
    requestId: 'REQ-' + Math.floor(100000 + Math.random() * 900000),
    modelName: 'cyber-threat-classifier',
    modelVersion: '2.1.0-mil-fastapi',
    prediction: {
      label: classification,
      confidence,
      riskScore
    },
    probabilities,
    indicators,
    recommendation,
    processedAt: new Date().toISOString()
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

// API Service exports
export const api = {
  // Authentication
  auth: {
    login: async (credentials) => {
      await new Promise(r => setTimeout(r, 400));
      const user = MOCK_USERS.find(u => u.serviceId.toLowerCase() === credentials.serviceId.toLowerCase()) || {
        _id: 'usr-' + Math.floor(Math.random() * 1000),
        fullName: 'Defence User (' + credentials.serviceId + ')',
        serviceId: credentials.serviceId,
        email: `${credentials.serviceId.toLowerCase()}@defence.nic.in`,
        phone: '+91 99887 76655',
        userType: 'DEFENCE_PERSONNEL',
        organization: 'Indian Armed Forces',
        rank: 'Officer',
        role: 'USER',
        isVerified: true,
        isActive: true,
        lastLoginAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };
      return { success: true, data: { user, token: 'jwt-mil-token-' + Date.now() } };
    },
    register: async (data) => {
      await new Promise(r => setTimeout(r, 400));
      const newUser = {
        _id: 'usr-' + Math.floor(Math.random() * 1000),
        ...data,
        role: 'USER',
        isVerified: true,
        isActive: true,
        createdAt: new Date().toISOString()
      };
      return { success: true, data: { user: newUser, token: 'jwt-mil-token-' + Date.now() } };
    },
    getMe: async (currentUser) => {
      return { success: true, data: currentUser || MOCK_USERS[0] };
    }
  },

  // Incidents
  incidents: {
    getAll: async (filter = {}) => {
      await new Promise(r => setTimeout(r, 300));
      let results = [...incidents];
      if (filter.userId && filter.userId !== 'all') {
        results = results.filter(i => i.userId === filter.userId);
      }
      if (filter.status) {
        results = results.filter(i => i.status === filter.status);
      }
      return { success: true, data: results };
    },
    getById: async (id) => {
      await new Promise(r => setTimeout(r, 200));
      const inc = incidents.find(i => i._id === id || i.complaintId === id);
      if (!inc) return { success: false, error: { code: 'RESOURCE_NOT_FOUND', message: 'Incident not found' } };
      return { success: true, data: inc };
    },
    create: async (payload, user) => {
      await new Promise(r => setTimeout(r, 500));
      const nextNum = 143 + incidents.length;
      const complaintId = `CRF-2026-${String(nextNum).padStart(6, '0')}`;

      // Run AI threat analysis
      const aiResult = await analyzeThreat({
        text: `${payload.title} ${payload.description} ${payload.suspectedSource || ''}`,
        inputType: 'TEXT'
      });

      const { severity, priority } = calculatePriorityScore(
        payload.incidentType,
        aiResult.prediction.riskScore,
        payload.financialLoss,
        Number(payload.lossAmount) || 0
      );

      const newIncident = {
        _id: 'inc-' + Math.floor(1000 + Math.random() * 9000),
        complaintId,
        userId: user?._id || 'usr-101',
        incidentType: payload.incidentType,
        title: payload.title,
        description: payload.description,
        incidentDate: payload.incidentDate || new Date().toISOString().split('T')[0],
        incidentTime: payload.incidentTime || '12:00',
        channel: payload.channel || 'WEB',
        suspectedSource: payload.suspectedSource || 'Unknown',
        financialLoss: Boolean(payload.financialLoss),
        lossAmount: Number(payload.lossAmount) || 0,
        currency: payload.currency || 'INR',
        location: payload.location || 'Unit Military Station',
        status: 'SUBMITTED',
        severity,
        priority,
        assignedOfficerId: null,
        assignedOfficerName: 'Pending Assignment',
        aiAnalysis: {
          classification: aiResult.prediction.label,
          confidence: aiResult.prediction.confidence,
          riskScore: aiResult.prediction.riskScore,
          modelVersion: aiResult.modelVersion,
          probabilities: aiResult.probabilities,
          indicators: aiResult.indicators,
          recommendation: aiResult.recommendation,
          analyzedAt: aiResult.processedAt
        },
        evidences: payload.evidences || [],
        timeline: [
          { status: 'SUBMITTED', timestamp: new Date().toISOString(), note: `Report submitted by ${user?.fullName || 'Personnel'}` },
          { status: 'AI_ANALYSIS', timestamp: new Date().toISOString(), note: `AI classified as ${aiResult.prediction.label} (Risk Score ${aiResult.prediction.riskScore} - ${severity}/${priority})` }
        ],
        officerNotes: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      incidents.unshift(newIncident);

      // Create an audit log
      auditLogs.unshift({
        _id: 'log-' + Date.now(),
        actorId: user?._id || 'usr-101',
        actorName: user?.fullName || 'Major Vikram Rathore',
        actorRole: user?.role || 'USER',
        action: 'CREATE_INCIDENT',
        resourceType: 'INCIDENT',
        resourceId: complaintId,
        ipAddress: '10.240.1.12',
        userAgent: navigator.userAgent,
        metadata: { incidentType: payload.incidentType, riskScore: aiResult.prediction.riskScore },
        timestamp: new Date().toISOString()
      });

      return {
        success: true,
        data: {
          incidentId: newIncident._id,
          complaintId: newIncident.complaintId,
          status: newIncident.status,
          severity: newIncident.severity,
          priority: newIncident.priority,
          aiAnalysis: newIncident.aiAnalysis,
          incident: newIncident
        }
      };
    },
    updateStatus: async (id, status, note, officer) => {
      await new Promise(r => setTimeout(r, 300));
      const inc = incidents.find(i => i._id === id || i.complaintId === id);
      if (!inc) return { success: false, error: { code: 'RESOURCE_NOT_FOUND', message: 'Incident not found' } };

      inc.status = status;
      inc.updatedAt = new Date().toISOString();
      inc.timeline.push({
        status,
        timestamp: new Date().toISOString(),
        note: note || `Status updated to ${status} by ${officer?.fullName || 'Officer'}`
      });

      if (officer) {
        inc.assignedOfficerId = officer._id;
        inc.assignedOfficerName = officer.fullName;
      }

      // Add audit log
      auditLogs.unshift({
        _id: 'log-' + Date.now(),
        actorId: officer?._id || 'officer',
        actorName: officer?.fullName || 'Officer',
        actorRole: officer?.role || 'INVESTIGATOR',
        action: 'CHANGE_STATUS',
        resourceType: 'INCIDENT',
        resourceId: inc.complaintId,
        ipAddress: '10.240.12.91',
        userAgent: navigator.userAgent,
        metadata: { newStatus: status, note },
        timestamp: new Date().toISOString()
      });

      return { success: true, data: inc };
    },
    addNote: async (id, text, author) => {
      await new Promise(r => setTimeout(r, 200));
      const inc = incidents.find(i => i._id === id || i.complaintId === id);
      if (!inc) return { success: false, error: { code: 'RESOURCE_NOT_FOUND', message: 'Incident not found' } };

      const note = {
        id: Date.now(),
        author: author?.fullName || 'Investigating Officer',
        date: new Date().toLocaleString(),
        text
      };
      inc.officerNotes = inc.officerNotes || [];
      inc.officerNotes.push(note);
      return { success: true, data: inc };
    }
  },

  // Threat Detection Tools
  threatDetection: {
    analyzeUrl: async (url) => {
      return analyzeThreat({ url, text: url, inputType: 'URL' });
    },
    analyzeEmail: async ({ senderEmail, subject, body, headers }) => {
      return analyzeThreat({
        text: `Sender: ${senderEmail} Subject: ${subject} Body: ${body} Headers: ${headers || ''}`,
        inputType: 'EMAIL'
      });
    },
    analyzePhone: async ({ phoneNumber, countryCode, message, callType }) => {
      return analyzeThreat({
        text: `Phone: ${phoneNumber} Type: ${callType} Message: ${message || ''}`,
        phoneNumber,
        inputType: 'PHONE'
      });
    }
  },

  // Threat Intelligence & Admin stats
  intelligence: {
    getAll: async () => ({ success: true, data: threatIntel }),
    getMetrics: async () => ({ success: true, data: MOCK_ML_METRICS }),
    getAuditLogs: async () => ({ success: true, data: auditLogs }),
    getAlerts: async () => ({ success: true, data: alerts })
  }
};
