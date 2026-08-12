import express from 'express';
import cors from 'cors';
import { initDb } from './db.js';

import authRoutes from './routes/auth.js';
import purohitsRoutes from './routes/purohits.js';
import devoteesRoutes from './routes/devotees.js';
import bookingsRoutes from './routes/bookings.js';
import feedbacksRoutes from './routes/feedbacks.js';
import sosRoutes from './routes/sos.js';
import sampradayasRoutes from './routes/sampradayas.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend Vite dev server
app.use(cors());
app.use(express.json());

// Initialize SQLite database schema & initial seed data
initDb();

// Mount REST API Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/purohits', purohitsRoutes);
app.use('/api/devotees', devoteesRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/feedbacks', feedbacksRoutes);
app.use('/api/sos', sosRoutes);
app.use('/api/sampradayas', sampradayasRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Real-Purohit Express SQLite Backend Operational!', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(` Real-Purohit Express API Server running on port ${PORT}`);
  console.log(` Database: SQLite (database.db)`);
  console.log(` Auth: bcryptjs password hashing + JWT tokens`);
  console.log(`====================================================`);
});
