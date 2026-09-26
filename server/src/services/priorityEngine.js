/**
 * Priority Engine — SRD Section 23
 * Calculates incident severity and priority based on multiple factors.
 * Backend is the single authority for priority decisions.
 * Thresholds are configurable via config, not hardcoded.
 */

const config = require('../config');

const { riskThresholds, priorityThresholds } = config;

/**
 * Calculate risk level label from a numeric score
 * @param {number} score - 0 to 100
 * @returns {'LOW'|'MEDIUM'|'HIGH'|'CRITICAL'}
 */
function getRiskLevel(score) {
  if (score >= riskThresholds.CRITICAL.min) return 'CRITICAL';
  if (score >= riskThresholds.HIGH.min) return 'HIGH';
  if (score >= riskThresholds.MEDIUM.min) return 'MEDIUM';
  return 'LOW';
}

/**
 * Calculate priority label from a numeric score
 * @param {number} score - 0 to 100
 * @returns {'P1'|'P2'|'P3'|'P4'}
 */
function getPriorityLabel(score) {
  if (score >= priorityThresholds.P1) return 'P1';
  if (score >= priorityThresholds.P2) return 'P2';
  if (score >= priorityThresholds.P3) return 'P3';
  return 'P4';
}

/**
 * Calculate incident priority using multiple factors.
 * The ML risk score is the base, then weighted by:
 *   - Incident type (espionage/malware are elevated)
 *   - Financial loss amount
 *   - ML confidence (lower confidence = conservative score)
 *
 * @param {object} params
 * @param {string} params.incidentType
 * @param {number} params.mlRiskScore       - 0-100 from ML service (null if unavailable)
 * @param {number} params.mlConfidence      - 0-1 from ML service (null if unavailable)
 * @param {string} params.mlClassification  - ML classification label
 * @param {boolean} params.financialLoss
 * @param {number} params.lossAmount
 * @param {boolean} params.hasEvidence
 *
 * @returns {{ priorityScore: number, severity: string, priority: string }}
 */
function calculatePriority(params) {
  const {
    incidentType,
    mlRiskScore,
    mlConfidence,
    mlClassification,
    financialLoss,
    lossAmount,
    hasEvidence,
  } = params;

  // Start with ML risk score if available; fall back to type-based heuristic
  let score = mlRiskScore != null ? mlRiskScore : getTypeBasedBaseScore(incidentType);

  // Apply confidence weighting: low confidence pulls score toward 50
  if (mlRiskScore != null && mlConfidence != null) {
    const confidenceWeight = 0.5 + mlConfidence * 0.5; // 0.5 at 0% conf, 1.0 at 100% conf
    score = Math.round(score * confidenceWeight + (1 - confidenceWeight) * 50);
  }

  // Type-based floor — some types always get minimum elevated treatment
  const typeFloor = getTypeFloor(incidentType);
  score = Math.max(score, typeFloor);

  // Financial loss boost
  if (financialLoss && lossAmount > 0) {
    if (lossAmount >= 100000) score = Math.max(score, 85);       // >= 1 lakh → CRITICAL floor
    else if (lossAmount >= 50000) score = Math.max(score, 75);   // >= 50k → HIGH floor
    else if (lossAmount >= 10000) score = Math.max(score, 60);   // >= 10k → MEDIUM floor
    else score = Math.max(score, 40);
  }

  // Evidence availability boosts confidence in assessment
  if (hasEvidence) {
    score = Math.min(100, score + 3);
  }

  // Clamp
  score = Math.min(100, Math.max(0, Math.round(score)));

  return {
    priorityScore: score,
    severity: getRiskLevel(score),
    priority: getPriorityLabel(score),
  };
}

/**
 * Type-based base score when ML is unavailable
 */
function getTypeBasedBaseScore(incidentType) {
  const baseScores = {
    ESPIONAGE: 85,
    OPSEC_RISK: 82,
    MALWARE: 80,
    PHISHING: 65,
    IDENTITY_THEFT: 65,
    FINANCIAL_FRAUD: 60,
    SOCIAL_ENGINEERING: 58,
    MALICIOUS_URL: 55,
    FAKE_EMAIL: 50,
    FAKE_CALL: 45,
    SPAM: 35,
    OTHER: 30,
  };
  return baseScores[incidentType] || 30;
}

/**
 * Minimum score floor by incident type — backend always enforces these
 */
function getTypeFloor(incidentType) {
  const floors = {
    ESPIONAGE: 75,
    OPSEC_RISK: 70,
    MALWARE: 65,
    PHISHING: 50,
    IDENTITY_THEFT: 50,
  };
  return floors[incidentType] || 0;
}

module.exports = { calculatePriority, getRiskLevel, getPriorityLabel };
