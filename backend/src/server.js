const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
// const connectDB = require('./config/database');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Connect to MongoDB - temporarily disabled for testing
// connectDB();

// CORS configuration for production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL || 'https://your-app.vercel.app']
    : ['http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Test route for debugging
app.get('/test', (req, res) => {
  res.json({ 
    message: 'Backend is working!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Debug route to check what's loaded
app.get('/debug', (req, res) => {
  res.json({
    message: 'Debug information',
    routes: app._router.stack.map(layer => {
      if (layer.route) {
        return `${Object.keys(layer.route.methods).join(',').toUpperCase()} ${layer.route.path}`;
      }
      return null;
    }).filter(Boolean),
    middleware: app._router.stack.map(layer => {
      if (layer.name) {
        return layer.name;
      }
      return null;
    }).filter(Boolean)
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Class Management API is running',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Class Management API',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Simplified route loading for debugging
console.log('Attempting to load routes...');

// Test with just auth routes first
try {
  console.log('Loading auth routes...');
  const authRouter = require('./routes/auth');
  console.log('Auth router loaded:', typeof authRouter);
  console.log('Auth router stack:', authRouter.stack ? authRouter.stack.length : 'No stack');
  
  app.use('/api/auth', authRouter);
  console.log('✓ Auth routes mounted successfully');
} catch (error) {
  console.error('✗ Failed to load auth routes:', error.message);
  console.error('Error stack:', error.stack);
}

// Test a simple route directly
app.get('/api/test-route', (req, res) => {
  res.json({ message: 'Direct route test' });
});

console.log('Route loading completed.');

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error occurred:', err.stack);
  
  // Don't leak error details in production
  const message = process.env.NODE_ENV === 'production' 
    ? 'Something went wrong!' 
    : err.message;
    
  res.status(500).json({ message });
});

// 404 handler
app.use('*', (req, res) => {
  console.log(`404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ 
    message: 'Route not found',
    requestedUrl: req.originalUrl,
    method: req.method,
    availableRoutes: [
      'GET /test',
      'GET /debug',
      'GET /api/health',
      'GET /',
      'GET /api/test-route',
      'GET /api/auth/test',
      'POST /api/auth/register',
      'POST /api/auth/login'
    ]
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`MongoDB: Temporarily disabled for testing`);
  console.log('Available routes:');
  console.log('- GET  /test');
  console.log('- GET  /debug');
  console.log('- GET  /api/health');
  console.log('- GET  /');
  console.log('- GET  /api/test-route');
  console.log('- GET  /api/auth/test');
  console.log('- POST /api/auth/register');
  console.log('- POST /api/auth/login');
}); 