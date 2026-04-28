const express = require('express');
const cors = require('cors');
const fileRoutes = require('./routes/fileRoutes');
const errorHandler = require('./middlewares/errorHandler');
const { trackActiveRequests } = require('./controllers/fileController');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Global middleware ──────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(trackActiveRequests);

// ── Request logger ─────────────────────────────────────────────────────
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ── API routes ─────────────────────────────────────────────────────────
app.use('/', fileRoutes);

// ── Error handler (must be last) ───────────────────────────────────────
app.use(errorHandler);

// ── Start server ───────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n========================================`);
  console.log(`  P2V2C File Sharing Service`);
  console.log(`  Running on http://localhost:${PORT}`);
  console.log(`========================================\n`);
  console.log(`Endpoints:`);
  console.log(`  POST   /upload          Upload a file`);
  console.log(`  GET    /download?key=   Download a file`);
  console.log(`  GET    /file/:key       File metadata`);
  console.log(`  GET    /metrics         Server metrics`);
  console.log(`  GET    /health          Health check\n`);
});

module.exports = app;
