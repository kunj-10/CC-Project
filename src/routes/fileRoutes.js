const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const {
  uploadFile,
  downloadFile,
  getFileInfo,
  getMetrics,
  healthCheck,
} = require('../controllers/fileController');

const router = express.Router();

// ── Multer configuration ───────────────────────────────────────────────
// Resolve uploads/ relative to the project root (one level above src/)
const UPLOAD_DIR = path.join(__dirname, '..', '..', 'uploads');

// Ensure the uploads directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    // Prefix with timestamp to avoid collisions
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB max
});

// ── Routes ─────────────────────────────────────────────────────────────
router.post('/upload', upload.single('file'), uploadFile);
router.get('/download', downloadFile);
router.get('/file/:key', getFileInfo);
router.get('/metrics', getMetrics);
router.get('/health', healthCheck);

module.exports = router;
