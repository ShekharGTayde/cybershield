const { calculatePriority, getRiskLevel, getPriorityLabel } = require('../src/services/priorityEngine');

describe('Priority Engine', () => {
  test('correctly maps risk levels', () => {
    expect(getRiskLevel(85)).toBe('CRITICAL');
    expect(getRiskLevel(70)).toBe('HIGH');
    expect(getRiskLevel(45)).toBe('MEDIUM');
    expect(getRiskLevel(20)).toBe('LOW');
  });

  test('correctly maps priority labels', () => {
    expect(getPriorityLabel(90)).toBe('P1');
    expect(getPriorityLabel(75)).toBe('P2');
    expect(getPriorityLabel(50)).toBe('P3');
    expect(getPriorityLabel(20)).toBe('P4');
  });

  test('enforces floor for Espionage and OPSEC threats', () => {
    const result = calculatePriority({
      incidentType: 'ESPIONAGE',
      mlRiskScore: 40,
      mlConfidence: 0.9,
      mlClassification: 'ESPIONAGE',
      financialLoss: false,
      lossAmount: 0,
      hasEvidence: false,
    });

    expect(result.priorityScore).toBeGreaterThanOrEqual(75);
    expect(['P1', 'P2']).toContain(result.priority);
  });

  test('elevates priority when financial loss is substantial', () => {
    const result = calculatePriority({
      incidentType: 'FINANCIAL_FRAUD',
      mlRiskScore: 30,
      mlConfidence: 0.8,
      mlClassification: 'FINANCIAL_FRAUD',
      financialLoss: true,
      lossAmount: 150000,
      hasEvidence: true,
    });

    expect(result.priorityScore).toBeGreaterThanOrEqual(85);
    expect(result.severity).toBe('CRITICAL');
    expect(result.priority).toBe('P1');
  });
});
