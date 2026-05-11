const path = require('path');
const fs = require('fs');
const { saveFileMetadata, getFileMetadata, getTotalFiles } = require('../services/storageService');
const { decryptBuffer } = require('../utils/encryption');

const metrics = {
  startTime: Date.now(),
  totalUploads: 0,
  totalDownloads: 0,
  activeRequests: 0,
};

function trackActiveRequests(req, res, next) {
  metrics.activeRequests++;
  res.on('finish', () => {
    metrics.activeRequests = Math.max(0, metrics.activeRequests - 1);
  });
  next();
}


function uploadFile(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded. Use field name "file".' });
    }

    const { key, filename } = saveFileMetadata(req.file);
    metrics.totalUploads++;

    console.log(`[UPLOAD] key=${key}  file=${filename}  (encrypted on disk)`);
    res.status(201).json({ key, filename });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /download?key=...
 * Validates the key, decrypts the file using the key, and sends back the decrypted content.
 */
function downloadFile(req, res, next) {
  try {
    const { key } = req.query;

    if (!key) {
      return res.status(400).json({ error: 'Missing required query parameter: key' });
    }

    const metadata = getFileMetadata(key);
    if (!metadata) {
      return res.status(404).json({ error: 'Invalid key or file not found.' });
    }

    metrics.totalDownloads++;

    // Read encrypted file from disk and decrypt it using the key
    const encryptedData = fs.readFileSync(path.resolve(metadata.path));
    const decryptedData = decryptBuffer(encryptedData, key);

    console.log(`[DOWNLOAD] key=${key}  file=${metadata.filename}  (decrypted)`);

    // Send decrypted file as a download
    res.setHeader('Content-Disposition', `attachment; filename="${metadata.filename}"`);
    res.setHeader('Content-Type', metadata.mimetype || 'application/octet-stream');
    res.setHeader('Content-Length', decryptedData.length);
    res.send(decryptedData);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /file/:key
 * Returns metadata about the uploaded file (no file content).
 */
function getFileInfo(req, res, next) {
  try {
    const { key } = req.params;
    const metadata = getFileMetadata(key);

    if (!metadata) {
      return res.status(404).json({ error: 'Invalid key or file not found.' });
    }

    res.json({
      filename: metadata.filename,
      size: metadata.size,
      mimetype: metadata.mimetype,
      uploadedAt: metadata.uploadedAt,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /metrics
 * Returns runtime metrics: uptime, upload/download counts, active requests.
 */
function getMetrics(req, res) {
  res.json({
    uptime: Math.floor((Date.now() - metrics.startTime) / 1000),
    totalUploads: metrics.totalUploads,
    totalDownloads: metrics.totalDownloads,
    totalFilesStored: getTotalFiles(),
    activeRequests: metrics.activeRequests,
  });
}

/**
 * GET /health
 * Simple health-check endpoint.
 */
function healthCheck(req, res) {
  res.json({ status: 'ok' });
}

module.exports = {
  trackActiveRequests,
  uploadFile,
  downloadFile,
  getFileInfo,
  getMetrics,
  healthCheck,
};
