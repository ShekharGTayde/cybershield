/**
 * CyberShield Server Entry Point
 * Boots HTTP server, Socket.IO, and database connection.
 */

const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const config = require('./config');
const { connectDB, disconnectDB } = require('./config/db');
const { verifyAccessToken } = require('./utils/jwt');
const { initNotificationService } = require('./services/notificationService');
const logger = require('./utils/logger');

// Create HTTP server
const server = http.createServer(app);

// Attach Socket.IO
const io = new Server(server, {
  cors: {
    origin: [config.clientUrl, 'http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST'],
  },
  pingTimeout: 60000,
});

// Socket Authentication Middleware
io.use((socket, next) => {
  const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1];
  if (!token) {
    return next(new Error('Authentication token required'));
  }

  try {
    const decoded = verifyAccessToken(token);
    socket.user = decoded;
    next();
  } catch (err) {
    next(new Error('Invalid or expired socket token: ' + err.message));
  }
});

// Socket Connection Handler
io.on('connection', (socket) => {
  const { sub: userId, role } = socket.user;
  logger.info(`Socket connected: user=${userId} role=${role} socketId=${socket.id}`);

  // Join personal user room for private alerts
  socket.join(`user:${userId}`);

  // Join role-based room (INVESTIGATOR, ADMIN)
  if (role === 'INVESTIGATOR' || role === 'ADMIN') {
    socket.join(`role:${role}`);
    socket.join('staff');
  }

  socket.on('disconnect', (reason) => {
    logger.info(`Socket disconnected: user=${userId} reason=${reason}`);
  });
});

// Initialize Notification Service with Socket.IO instance
initNotificationService(io);

// ── Server Boot ───────────────────────────────────────────

async function startServer() {
  try {
    logger.info('Initializing CyberShield Server...');

    // Connect to MongoDB
    await connectDB();

    // Start listening
    server.listen(config.port, () => {
      logger.info(`====================================================`);
      logger.info(` CyberShield Server running on port ${config.port}`);
      logger.info(` Environment: ${config.nodeEnv}`);
      logger.info(` Client URL:  ${config.clientUrl}`);
      logger.info(` ML Service:  ${config.mlServiceUrl}`);
      logger.info(`====================================================`);
    });
  } catch (err) {
    logger.error(`Failed to start server: ${err.message}`, { stack: err.stack });
    process.exit(1);
  }
}

// ── Graceful Shutdown ─────────────────────────────────────

async function gracefulShutdown(signal) {
  logger.info(`${signal} received. Closing HTTP server and database connections...`);

  server.close(async () => {
    logger.info('HTTP server closed.');
    await disconnectDB();
    logger.info('Database connection closed.');
    process.exit(0);
  });

  // Force close if graceful shutdown takes longer than 10 seconds
  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Promise Rejection at:', { promise, reason });
});

process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception: ${err.message}`, { stack: err.stack });
  process.exit(1);
});

if (process.env.NODE_ENV !== 'test') {
  startServer();
}

module.exports = { app, server, io };
