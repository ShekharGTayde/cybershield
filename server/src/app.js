/**
 * Express Application Factory — CyberShield Backend
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

const config = require('./config');
const authRoutes = require('./routes/authRoutes');
const incidentRoutes = require('./routes/incidentRoutes');
const errorHandler = require('./middleware/errorHandler');
const AppError = require('./utils/AppError');
const { sendSuccess } = require('./utils/response');
const logger = require('./utils/logger');

const app = express();

// ── Security Middlewares ──────────────────────────────────

app.use(
  helmet({
    contentSecurityPolicy: false, // Managed by client build/deployment
    crossOriginEmbedderPolicy: false,
  })
);

// CORS configuration
const allowedOrigins = [
  config.clientUrl,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Blocked by CORS policy'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Client-Version'],
  })
);

// ── Request Parsing Middlewares ───────────────────────────

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection & XSS
app.use(mongoSanitize());
app.use(xss());

// HTTP Request Logging
if (!config.isProduction) {
  app.use(morgan('dev'));
} else {
  app.use(
    morgan('combined', {
      stream: {
        write: (message) => logger.http(message.trim()),
      },
    })
  );
}

// ── Health Check Endpoints ────────────────────────────────

const healthResponse = (req, res) => {
  return sendSuccess(res, {
    status: 'HEALTHY',
    service: 'cybershield-server',
    version: '1.0.0',
    environment: config.nodeEnv,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
};

app.get('/health', healthResponse);
app.get('/api/v1/health', healthResponse);

// ── API Routes ────────────────────────────────────────────

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/incidents', incidentRoutes);

// ── 404 Handler ───────────────────────────────────────────

app.all('*', (req, res, next) => {
  next(AppError.notFound(`Cannot find ${req.method} ${req.originalUrl} on this server`));
});

// ── Centralized Error Handler ─────────────────────────────

app.use(errorHandler);

module.exports = app;
