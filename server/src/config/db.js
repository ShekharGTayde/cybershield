/**
 * MongoDB Connection Manager
 * Handles connect with retry and graceful shutdown.
 */

const mongoose = require('mongoose');
const config = require('./index');
const logger = require('../utils/logger');

let retryCount = 0;
const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 5000;

async function connectDB() {
  try {
    const conn = await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });

    logger.info(`MongoDB connected: ${conn.connection.host} / ${conn.connection.name}`);
    retryCount = 0;

    mongoose.connection.on('error', (err) => {
      logger.error(`MongoDB error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected — attempting reconnect...');
      retryConnect();
    });

  } catch (err) {
    logger.error(`MongoDB connection failed: ${err.message}`);
    retryConnect();
  }
}

function retryConnect() {
  if (retryCount >= MAX_RETRIES) {
    logger.error('MongoDB max retries reached. Exiting process.');
    process.exit(1);
  }
  retryCount += 1;
  logger.info(`Retrying MongoDB connection (${retryCount}/${MAX_RETRIES}) in ${RETRY_DELAY_MS / 1000}s...`);
  setTimeout(connectDB, RETRY_DELAY_MS);
}

async function disconnectDB() {
  await mongoose.connection.close();
  logger.info('MongoDB connection closed.');
}

module.exports = { connectDB, disconnectDB };
