import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase } from './database';
import { initializeRedis } from './services/redis';
import chatRoutes from './routes/chat';
import leadRoutes from './routes/leads';
import qualificationRoutes from './routes/qualification';
import fineTuningRoutes from './routes/fine-tuning';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'https://ai-lead-chatbot.vercel.app',
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(null, true); // Allow all for PoC
  },
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Initialize services (non-blocking - server starts even if services fail)
async function initializeServices() {
  // Database
  try {
    console.log('Initializing database...');
    await initializeDatabase();
    console.log('✓ Database connected');
  } catch (error) {
    console.error('✗ Database initialization failed:', error);
    console.log('⚠ Server will continue without database - some features may not work');
  }

  // Redis (already has fallback to in-memory)
  try {
    console.log('Initializing Redis...');
    await initializeRedis();
  } catch (error) {
    console.error('✗ Redis initialization failed:', error);
    console.log('⚠ Using in-memory session storage');
  }

  console.log('Service initialization complete');
}

// Routes
app.use('/api/chat', chatRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/qualification', qualificationRoutes);
app.use('/api/fine-tuning', fineTuningRoutes);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.statusCode || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Start server first, then initialize services
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  // Initialize services after server is listening
  initializeServices();
});

export default app;
