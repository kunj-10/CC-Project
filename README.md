# Express P2V2C Demo — Secure File Sharing & Monitoring Service

A lightweight Express-based backend that demonstrates **secure key-based file sharing** and **basic monitoring**, designed to run identically across **Physical → VM → Cloud** environments.

## Quick Start

```bash
# Install dependencies
npm install

# Start the server
node src/app.js
# → http://localhost:3000
```

## API Reference

| Method | Endpoint           | Description          |
|--------|--------------------|----------------------|
| POST   | `/upload`          | Upload a file        |
| GET    | `/download?key=…`  | Download by key      |
| GET    | `/file/:key`       | File metadata        |
| GET    | `/metrics`         | Server metrics       |
| GET    | `/health`          | Health check         |

### Upload a file

```bash
curl -X POST -F "file=@myfile.pdf" http://localhost:3000/upload
```

**Response:**
```json
{
  "key": "a1b2c3d4e5f6...",
  "filename": "myfile.pdf"
}
```

### Download a file

```bash
curl -OJ "http://localhost:3000/download?key=a1b2c3d4e5f6..."
```

### Get file metadata

```bash
curl http://localhost:3000/file/a1b2c3d4e5f6...
```

**Response:**
```json
{
  "filename": "myfile.pdf",
  "size": 102400,
  "mimetype": "application/pdf",
  "uploadedAt": "2026-04-28T06:00:00.000Z"
}
```

### Metrics

```bash
curl http://localhost:3000/metrics
```

**Response:**
```json
{
  "uptime": 3600,
  "totalUploads": 5,
  "totalDownloads": 3,
  "totalFilesStored": 5,
  "activeRequests": 1
}
```

### Health Check

```bash
curl http://localhost:3000/health
```

**Response:**
```json
{ "status": "ok" }
```

## Project Structure

```
express-p2v2c-demo/
├── src/
│   ├── controllers/
│   │   └── fileController.js    # Request handlers & metrics tracking
│   ├── routes/
│   │   └── fileRoutes.js        # Route definitions & multer config
│   ├── services/
│   │   └── storageService.js    # In-memory metadata store
│   ├── utils/
│   │   └── keyGenerator.js      # Crypto-based key generation
│   ├── middlewares/
│   │   └── errorHandler.js      # Global error handler
│   └── app.js                   # Express app entry point
├── uploads/                     # Uploaded files (auto-created)
├── package.json
└── README.md
```

## Deployment

### Local Machine
```bash
npm install && node src/app.js
```

### VM (VirtualBox / UTM)
```bash
# Same commands — install Node.js first if needed
npm install && node src/app.js
```

### Cloud (GCP / Azure / AWS)
```bash
# Ensure port 3000 is open in firewall/security group
npm install && node src/app.js
```

## Environment Variables

| Variable | Default | Description        |
|----------|---------|--------------------|
| `PORT`   | `3000`  | Server listen port |

## Notes

- **In-memory metadata**: File mappings are stored in memory. Restarting the server clears the key→file index, though files remain on disk.
- **Demo-scale**: Designed for 10–50 concurrent requests (lab/demo workloads).
- **Portable**: No environment-specific configuration — runs identically everywhere.
