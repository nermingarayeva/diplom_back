const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/database');
const config = require('./config/config');

// Routes import
const authRoutes = require('./routes/auth');
const accountRoutes = require('./routes/accounts');
const transactionRoutes = require('./routes/transactions');
const budgetRoutes = require('./routes/budgets');
const goalRoutes = require('./routes/goals');
const userRoutes = require('./routes/user');

// Middleware import
const errorHandler = require('./middleware/errorHandler');
const logger = require('./middleware/logger');

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Bu IP-dən çox sayda sorğu göndərildi, zəhmət olmasa sonra cəhd edin.'
  }
});
app.use(limiter);

app.use(logger);

app.use(express.json({ 
  limit: '10mb',
  verify: (req, res, buf) => {
    try {
      JSON.parse(buf);
    } catch(e) {
      res.status(400).json({
        success: false,
        message: 'JSON formatında xəta'
      });
      return;
    }
  }
}));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(cors({
    origin: [
      'http://localhost:3001',  
      'http://localhost:5173',  
      'http://localhost:5174',  
      process.env.FRONTEND_URL  
    ].filter(Boolean), 
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

connectDB();

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Personal Finance API-ya xoş gəlmisiniz!',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      accounts: '/api/accounts',
      transactions: '/api/transactions',
      budgets: '/api/budgets',
      goals: '/api/goals',
      users: '/api/users'
    }
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/users', userRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server mükəmməl işləyir!',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Documentation endpoint
app.get('/api/docs', (req, res) => {
  res.json({
    success: true,
    message: 'Personal Finance API Documentation',
    version: '1.0.0',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login'
      },
      accounts: {
        get: 'GET /api/accounts',
        create: 'POST /api/accounts',
        update: 'PUT /api/accounts/:id',
        delete: 'DELETE /api/accounts/:id'
      },
      transactions: {
        get: 'GET /api/transactions',
        create: 'POST /api/transactions',
        update: 'PUT /api/transactions/:id',
        delete: 'DELETE /api/transactions/:id'
      },
      budgets: {
        get: 'GET /api/budgets',
        create: 'POST /api/budgets',
        update: 'PUT /api/budgets/:id',
        delete: 'DELETE /api/budgets/:id'
      },
      goals: {
        get: 'GET /api/goals',
        create: 'POST /api/goals',
        update: 'PUT /api/goals/:id',
        delete: 'DELETE /api/goals/:id'
      },
      users: {
        profile: 'GET /api/users/me',
        update: 'PUT /api/users/me',
        delete: 'DELETE /api/users/me'
      }
    }
  });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint tapılmadı',
    requestedUrl: req.originalUrl,
    method: req.method,
    availableEndpoints: '/api/docs'
  });
});

// 404 handler for all other routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Səhifə tapılmadı',
    requestedUrl: req.originalUrl
  });
});

// Global error handler
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

const PORT = config.port;

const server = app.listen(PORT, () => {
  console.log(` Server ${PORT} portunda işləyir`);
  console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(` API Documentation: http://localhost:${PORT}/api/docs`);
  console.log(` Health Check: http://localhost:${PORT}/api/health`);
});

module.exports = app;