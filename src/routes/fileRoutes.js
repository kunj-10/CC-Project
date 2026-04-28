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

const UPLOAD_DIR = path.join(__dirname, '..', '..', 'uploads');

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
});

router.post('/upload', upload.single('file'), uploadFile);
router.get('/download', downloadFile);
router.get('/file/:key', getFileInfo);
router.get('/metrics', getMetrics);
router.get('/health', healthCheck);

module.exports = router;
