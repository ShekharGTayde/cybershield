const path = require('path');
const fs = require('fs');
const { computeSHA256, validateFileType, generateSafeFilename } = require('../src/utils/fileUtils');

describe('File Utilities', () => {
  const testFilePath = path.join(__dirname, 'test_sample.txt');

  beforeAll(() => {
    fs.writeFileSync(testFilePath, 'CyberShield Defence Integrity Test 2026');
  });

  afterAll(() => {
    if (fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath);
    }
  });

  test('computes predictable SHA-256 hash', async () => {
    const hash = await computeSHA256(testFilePath);
    expect(hash).toHaveLength(64);
    expect(typeof hash).toBe('string');
  });

  test('validates permitted and rejected file types', () => {
    expect(validateFileType('image/png', 'screenshot.png').valid).toBe(true);
    expect(validateFileType('application/pdf', 'report.pdf').valid).toBe(true);
    expect(validateFileType('application/x-msdownload', 'malware.exe').valid).toBe(false);
    expect(validateFileType('image/jpeg', 'fake.png').valid).toBe(false);
  });

  test('generates randomized safe filenames', () => {
    const safeName1 = generateSafeFilename('my-confidential-report.pdf');
    const safeName2 = generateSafeFilename('my-confidential-report.pdf');
    expect(safeName1).toMatch(/^[a-f0-9]+\.pdf$/);
    expect(safeName1).not.toBe(safeName2);
  });
});
