/**
 * User Model — SRD Section 6
 * Stores all defence personnel, family members, veterans, and staff.
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 12;

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [2, 'Full name must be at least 2 characters'],
      maxlength: [100, 'Full name must not exceed 100 characters'],
    },
    serviceId: {
      type: String,
      required: [true, 'Service ID is required'],
      unique: true,
      trim: true,
      uppercase: true,
      minlength: [3, 'Service ID must be at least 3 characters'],
      maxlength: [30, 'Service ID must not exceed 30 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    userType: {
      type: String,
      required: true,
      enum: {
        values: ['DEFENCE_PERSONNEL', 'FAMILY_MEMBER', 'VETERAN', 'CIVILIAN_STAFF'],
        message: '{VALUE} is not a valid user type',
      },
      default: 'DEFENCE_PERSONNEL',
    },
    organization: {
      type: String,
      trim: true,
      default: 'Indian Armed Forces',
    },
    rank: {
      type: String,
      trim: true,
      default: '',
    },
    passwordHash: {
      type: String,
      required: true,
      select: false, // Never returned in queries by default
    },
    role: {
      type: String,
      enum: {
        values: ['USER', 'INVESTIGATOR', 'ADMIN', 'SUPER_ADMIN'],
        message: '{VALUE} is not a valid role',
      },
      default: 'USER',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
    securityQuestion: {
      type: String,
      select: false,
    },
    securityAnswerHash: {
      type: String,
      select: false,
    },
    // Refresh token storage (hashed) — for token rotation / invalidation
    refreshTokenHash: {
      type: String,
      select: false,
      default: null,
    },
  },
  {
    timestamps: true, // adds createdAt, updatedAt
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        delete ret.passwordHash;
        delete ret.refreshTokenHash;
        delete ret.securityAnswerHash;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// ── Indexes ──────────────────────────────────────────────
UserSchema.index({ role: 1 });
UserSchema.index({ isActive: 1 });

// ── Instance Methods ─────────────────────────────────────

/**
 * Hash and set the user's password
 */
UserSchema.methods.setPassword = async function (plainPassword) {
  this.passwordHash = await bcrypt.hash(plainPassword, SALT_ROUNDS);
};

/**
 * Compare a plain-text password against the stored hash
 */
UserSchema.methods.comparePassword = async function (plainPassword) {
  return bcrypt.compare(plainPassword, this.passwordHash);
};

/**
 * Check if the user has a specific role or higher
 */
UserSchema.methods.hasRole = function (...roles) {
  return roles.includes(this.role);
};

/**
 * Safe public profile (no sensitive fields)
 */
UserSchema.methods.toPublicJSON = function () {
  return {
    _id: this._id,
    fullName: this.fullName,
    serviceId: this.serviceId,
    email: this.email,
    phone: this.phone,
    userType: this.userType,
    organization: this.organization,
    rank: this.rank,
    role: this.role,
    isVerified: this.isVerified,
    isActive: this.isActive,
    lastLoginAt: this.lastLoginAt,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
