/**
 * Complaint ID Generator
 * Produces unique sequential IDs: CRF-YYYY-XXXXXX
 * Uses MongoDB atomic findOneAndUpdate to guarantee uniqueness under concurrency.
 */

const mongoose = require('mongoose');

// Internal counter collection schema
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  year: { type: Number, required: true },
  seq: { type: Number, default: 0 },
});

const Counter = mongoose.models.Counter || mongoose.model('Counter', counterSchema);

/**
 * Generate the next unique complaint ID for the current year.
 * @returns {Promise<string>} e.g. "CRF-2026-000143"
 */
async function generateComplaintId() {
  const year = new Date().getFullYear();
  const counterId = `complaint_${year}`;

  const result = await Counter.findOneAndUpdate(
    { _id: counterId, year },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  const seq = String(result.seq).padStart(6, '0');
  return `CRF-${year}-${seq}`;
}

module.exports = { generateComplaintId };
