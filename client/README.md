# Defence CyberShield Frontend (Client)
## Cyber Fraud Reporting and Prevention Portal for Defence Personnel

Built in accordance with the 46-page Software Requirements Document (SRD/SRS).

---

## 🛠️ Technology Stack & Architecture

- **Core Framework**: React 19 + Vite + ES Modules
- **Styling & Theme**: Tailwind CSS (Military Defence Dark Theme, Glassmorphism, Tactical Grid, Glowing Badges)
- **Icons**: Lucide React
- **Client Routing**: React Router v7
- **Offline PWA & Storage**: Native Web IndexedDB (`idb`) for offline report drafting, local queue, and cryptographic store
- **Cryptographic Engine**: Web Crypto API (`crypto.subtle.digest`) for real-time SHA-256 evidence hashing & blockchain transaction simulation
- **State Management**: React Context API (`AuthContext`, `NotificationContext`, `SyncContext`)
- **Interactive Features**: Canvas Confetti, Interactive Military Captcha, Threat NLP Heuristic Engine

---

## 📁 SRD Requirements Mapping

| SRD Section | Description | Implementation File(s) |
|---|---|---|
| **§7.1** | Public & Authentication (Login, Captcha, Register, Recover) | [`LoginPage.jsx`](./src/pages/LoginPage.jsx), [`RegisterPage.jsx`](./src/pages/RegisterPage.jsx), [`Captcha.jsx`](./src/components/common/Captcha.jsx) |
| **§8** | Defence User Dashboard (Stats, Quick Actions, Activity) | [`UserDashboard.jsx`](./src/pages/UserDashboard.jsx) |
| **§9, 10, 21, 22** | 3-Step Incident Wizard & Evidence Vault (SHA-256 Hashing) | [`ReportIncidentPage.jsx`](./src/pages/ReportIncidentPage.jsx), [`crypto.js`](./src/services/crypto.js) |
| **§11, 12, 36** | Complaint Tracking, Visual Pipeline & Blockchain Verifier | [`TrackComplaintPage.jsx`](./src/pages/TrackComplaintPage.jsx) |
| **§13, 14, 15** | AI Threat Tools (URL, Email NLP, Phone/Spam, File Sandbox) | [`ThreatAnalysisPage.jsx`](./src/pages/ThreatAnalysisPage.jsx) |
| **§16** | OPSEC Prevention & Defence Awareness Module + Quiz | [`CyberAwarenessPage.jsx`](./src/pages/CyberAwarenessPage.jsx) |
| **§18, 44** | Offline Drafting, IndexedDB Queue & Synchronization | [`OfflineSyncPage.jsx`](./src/pages/OfflineSyncPage.jsx), [`db.js`](./src/services/db.js), [`SyncContext.jsx`](./src/context/SyncContext.jsx) |
| **§34, 35, 40** | CERT-Army Investigator Triage, Notes & Escalation | [`InvestigatorDashboard.jsx`](./src/pages/InvestigatorDashboard.jsx) |
| **§4.3, 23, 24, 45**| HQ Administration, ML Telemetry, Confusion Matrix & Audit Logs | [`AdminDashboard.jsx`](./src/pages/AdminDashboard.jsx) |
| **§30, 31, 33** | ML Input/Output Contracts & Priority Engine | [`api.js`](./src/services/api.js) |

---

## 🚀 Running the Client

```bash
# Navigate to the client directory
cd client

# Install dependencies (if not already installed)
npm install

# Start local development server
npm run dev

# Build production bundle
npm run build
```

---

## 🛡️ Quick Testing & Demo Profiles

Use the **Role Switcher** in the top navbar or quick-login buttons on the login page:
1. **Defence Personnel (USER)**: `Maj. Vikram Rathore` (`IC-78921X`)
2. **CERT-Army Officer (INVESTIGATOR)**: `Col. Rajeshwar Singh` (`CERT-ARMY-042`)
3. **HQ Admin (ADMIN)**: `Brig. A. S. Nair` (`ADMIN-HQ-001`)
4. **Family Member / Veteran (USER)**: `Sunita Devi` (`FAM-67210`)
