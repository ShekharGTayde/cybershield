# CyberShield Server — Backend System

Production-grade RESTful API and WebSocket backend for the **Cyber Fraud Reporting and Prevention Portal for Defence Personnel**.

---

## Features

- **Authentication & RBAC**: JWT Access & Refresh token rotation, bcrypt password hashing, defense-specific roles (`USER`, `INVESTIGATOR`, `ADMIN`).
- **Incident Management**: Multi-step reporting, unique atomic complaint tracking IDs (`CRF-YYYY-XXXXXX`), lifecycle timeline, officer notes.
- **Evidence Integrity**: Multer-based multipart uploads, server-side SHA-256 integrity hashing, MIME type allowlist, magic byte verification, blockchain anchoring readiness.
- **ML Integration Layer**: Client layer communicating with Python FastAPI threat detection microservice with automated heuristics fallback.
- **Priority Engine**: Rule-based and ML-weighted urgency calculation (P1 to P4 priority, LOW to CRITICAL severity).
- **Security**: Helmet, CORS origin restriction, rate limiting (auth, API, ML), XSS cleaning, and NoSQL query injection prevention.
- **Real-Time Updates**: Socket.IO authenticated channels for instant notification and case status dispatching.
- **Audit Logging**: Immutable security event logs for all critical actions.

---

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB instance (local or MongoDB Atlas)

### Setup & Installation

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Configure `MONGO_URI` and JWT secrets in `.env`:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/cybershield
   JWT_SECRET=your_super_secret_jwt_key
   JWT_REFRESH_SECRET=your_super_secret_refresh_key
   CLIENT_URL=http://localhost:5173
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

---

## API Endpoints (Steps 1–10)

### Auth (`/api/v1/auth`)

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/v1/auth/register` | Register new defence personnel | Public (Rate-limited) |
| `POST` | `/api/v1/auth/login` | Login with Service ID and password | Public (Rate-limited) |
| `POST` | `/api/v1/auth/refresh` | Refresh access token | Public |
| `POST` | `/api/v1/auth/logout` | Invalidate session | Authenticated |
| `GET` | `/api/v1/auth/me` | Get current user profile | Authenticated |

### Incidents (`/api/v1/incidents`)

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/v1/incidents` | Create incident report (Draft / Submitted) | Authenticated |
| `GET` | `/api/v1/incidents` | List incidents (Self or All by role) | Authenticated |
| `GET` | `/api/v1/incidents/:id` | Get incident by ID or Complaint ID | Authenticated |
| `PATCH` | `/api/v1/incidents/:id` | Update draft incident | Owner |
| `POST` | `/api/v1/incidents/:id/submit` | Submit draft incident for investigation | Owner |
| `DELETE` | `/api/v1/incidents/:id` | Soft delete draft incident | Owner / Admin |

### Evidence (`/api/v1/incidents/:id/evidence`)

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/v1/incidents/:id/evidence` | Upload evidence files with SHA-256 verification | Owner / Officer |
| `GET` | `/api/v1/incidents/:id/evidence` | Get attached evidence list | Owner / Officer |
| `GET` | `/api/v1/incidents/:id/evidence/:evidenceId/download` | Securely download evidence file | Owner / Officer |
| `DELETE` | `/api/v1/incidents/:id/evidence/:evidenceId` | Remove evidence from draft | Owner |

---

## Directory Structure

```text
server/
├── src/
│   ├── config/          # Central configuration & DB connection
│   ├── controllers/     # Route controllers (Auth, Incidents)
│   ├── middleware/      # Auth, Error handling, Rate limiting, Uploads
│   ├── models/          # Mongoose Schemas (User, Incident, Evidence, AuditLog, Notification)
│   ├── routes/          # Express route definitions
│   ├── services/        # ML client, Notification service, Priority engine
│   ├── utils/           # JWT, AppError, Logger, FileUtils, ComplaintId generator
│   ├── validators/      # Express-validator input validation
│   ├── app.js           # Express application factory
│   └── server.js        # Server boot and Socket.IO
├── uploads/             # Gitignored secure upload directory
├── tests/               # Test suites
├── package.json
└── README.md
```
