/**
 * Auth Controller — SRD Section 7
 * Handles register, login, logout, refresh, and me.
 */

const bcrypt = require('bcryptjs');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const { sendSuccess } = require('../utils/response');
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  buildTokenPayload,
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
} = require('../utils/jwt');
const { createAuditLog } = require('../utils/auditLogger');
const logger = require('../utils/logger');

// ── Register ──────────────────────────────────────────────

async function register(req, res, next) {
  try {
    const {
      fullName, serviceId, email, phone, userType, organization,
      rank, password, securityQuestion, securityAnswer, role
    } = req.body;

    // Check for existing serviceId or email
    const existing = await User.findOne({
      $or: [
        { serviceId: serviceId.toUpperCase() },
        { email: email.toLowerCase() },
      ],
    });

    if (existing) {
      const field = existing.serviceId === serviceId.toUpperCase() ? 'Service ID' : 'Email';
      return next(AppError.conflict(`${field} is already registered.`));
    }

    // Create user
    const user = new User({
      fullName,
      serviceId: serviceId.toUpperCase(),
      email: email.toLowerCase(),
      phone,
      userType,
      organization: organization || 'Indian Armed Forces',
      rank: rank || '',
      role: role,
      isVerified: true, // Auto-verified for now; can add email verification later
      isActive: true,
      securityQuestion: securityQuestion || null,
    });

    // Hash password using model method
    await user.setPassword(password);

    // Hash security answer if provided
    if (securityAnswer) {
      user.securityAnswerHash = await bcrypt.hash(securityAnswer.toLowerCase().trim(), 10);
    }

    await user.save();

    // Generate tokens
    const payload = buildTokenPayload(user);
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    // Store hashed refresh token
    user.refreshTokenHash = await bcrypt.hash(refreshToken, 8);
    user.lastLoginAt = new Date();
    await user.save();

    // Set refresh token cookie
    setRefreshTokenCookie(res, refreshToken);

    // Audit log
    await createAuditLog({
      actorId: user._id.toString(),
      actorRole: user.role,
      action: 'REGISTER',
      resourceType: 'USER',
      resourceId: user._id.toString(),
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      metadata: { serviceId: user.serviceId, userType: user.userType },
    });

    logger.info(`New user registered: ${user.serviceId} (${user.role})`);

    return sendSuccess(
      res,
      { user: user.toPublicJSON(), token: accessToken },
      201,
      'Registration successful'
    );
  } catch (err) {
    next(err);
  }
}

// ── Login ─────────────────────────────────────────────────

async function login(req, res, next) {
  try {
    const { serviceId, password } = req.body;

    // Fetch user with password hash (select: false by default)
    const user = await User.findOne({ serviceId: serviceId.toUpperCase() }).select(
      '+passwordHash +refreshTokenHash'
    );

    if (!user) {
      // Delay to prevent timing attacks
      await new Promise((r) => setTimeout(r, 300));
      return next(AppError.unauthorized('Invalid Service ID or password.'));
    }

    if (!user.isActive) {
      return next(AppError.unauthorized('Account is deactivated. Contact administration.'));
    }

    const passwordValid = await user.comparePassword(password);
    if (!passwordValid) {
      return next(AppError.unauthorized('Invalid Service ID or password.'));
    }

    // Generate tokens
    const payload = buildTokenPayload(user);
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    // Store hashed refresh token (allows only one active session per user)
    user.refreshTokenHash = await bcrypt.hash(refreshToken, 8);
    user.lastLoginAt = new Date();
    await user.save();

    setRefreshTokenCookie(res, refreshToken);

    // Audit log
    await createAuditLog({
      actorId: user._id.toString(),
      actorRole: user.role,
      action: 'LOGIN',
      resourceType: 'AUTH',
      resourceId: user._id.toString(),
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      metadata: { serviceId: user.serviceId },
    });

    logger.info(`Login: ${user.serviceId} (${user.role})`);

    return sendSuccess(res, { user: user.toPublicJSON(), token: accessToken });
  } catch (err) {
    next(err);
  }
}

// ── Logout ────────────────────────────────────────────────

async function logout(req, res, next) {
  try {
    // Invalidate refresh token in DB
    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, { refreshTokenHash: null });

      await createAuditLog({
        actorId: req.user._id.toString(),
        actorRole: req.user.role,
        action: 'LOGOUT',
        resourceType: 'AUTH',
        resourceId: req.user._id.toString(),
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        metadata: {},
      });
    }

    clearRefreshTokenCookie(res);
    return sendSuccess(res, null, 200, 'Logged out successfully');
  } catch (err) {
    next(err);
  }
}

// ── Refresh Token ─────────────────────────────────────────

async function refresh(req, res, next) {
  try {
    // Accept refresh token from cookie OR body (body for clients that can't use cookies)
    const token = req.cookies?.cybershield_refresh || req.body?.refreshToken;

    if (!token) {
      return next(AppError.unauthorized('Refresh token not provided.'));
    }

    const payload = verifyRefreshToken(token);

    const user = await User.findById(payload.sub).select('+refreshTokenHash');
    if (!user || !user.refreshTokenHash) {
      return next(AppError.unauthorized('Session invalid. Please log in again.'));
    }

    // Verify stored hash matches
    const tokenValid = await bcrypt.compare(token, user.refreshTokenHash);
    if (!tokenValid) {
      // Potential token reuse attack — invalidate session
      user.refreshTokenHash = null;
      await user.save();
      return next(AppError.unauthorized('Invalid refresh token. Please log in again.'));
    }

    if (!user.isActive) {
      return next(AppError.unauthorized('Account is deactivated.'));
    }

    // Rotate tokens
    const newPayload = buildTokenPayload(user);
    const newAccessToken = signAccessToken(newPayload);
    const newRefreshToken = signRefreshToken(newPayload);

    user.refreshTokenHash = await bcrypt.hash(newRefreshToken, 8);
    await user.save();

    setRefreshTokenCookie(res, newRefreshToken);

    await createAuditLog({
      actorId: user._id.toString(),
      actorRole: user.role,
      action: 'TOKEN_REFRESH',
      resourceType: 'AUTH',
      resourceId: user._id.toString(),
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      metadata: {},
    });

    return sendSuccess(res, { token: newAccessToken });
  } catch (err) {
    next(err);
  }
}

// ── Get Current User ──────────────────────────────────────

async function getMe(req, res, next) {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return next(AppError.notFound('User'));
    return sendSuccess(res, user.toPublicJSON());
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, logout, refresh, getMe };
