/**
 * ============================================================
 * Vidya Bharati University — Express Backend Server
 * Entry Point: server.js
 * ============================================================
 */

const express    = require('express');
const mongoose   = require('mongoose');
const cors       = require('cors');
const dotenv     = require('dotenv');
const path       = require('path');
const morgan     = require('morgan');

// Load environment variables
dotenv.config();

// Route imports
const admissionsRouter = require('./routes/admissions');
const contactRouter    = require('./routes/contact');
const coursesRouter    = require('./routes/courses');
const facultyRouter    = require('./routes/faculty');
const authRouter       = require('./routes/auth');

// Initialize Express
const app = express();
const PORT = process.env.PORT || 5000;

/* -------- MIDDLEWARE -------- */
app.use(cors({ origin: process.env.CLIENT_URL || '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Serve static frontend
app.use(express.static(path.join(__dirname, 'public')));

/* -------- DATABASE CONNECTION -------- */
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/vbu_db')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

/* -------- API ROUTES -------- */
app.use('/api/admissions', admissionsRouter);
app.use('/api/contact',    contactRouter);
app.use('/api/courses',    coursesRouter);
app.use('/api/faculty',    facultyRouter);
app.use('/api/auth',       authRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), server: 'VBU Backend v1.0' });
});

/* -------- SPA FALLBACK -------- */
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

/* -------- GLOBAL ERROR HANDLER -------- */
app.use((err, req, res, next) => {
  console.error('🔥 Error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

app.listen(PORT, () => {
  console.log(`🚀 VBU Server running at http://localhost:${PORT}`);
});

module.exports = app;
