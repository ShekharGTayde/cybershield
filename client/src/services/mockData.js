/**
 * Pre-populated defence datasets conforming to SRD Specifications
 */

export const MOCK_USERS = [
  {
    _id: 'usr-101',
    fullName: 'Major Vikram Rathore',
    serviceId: 'IC-78921X',
    email: 'vikram.rathore@defence.gov.in',
    phone: '+91 98765 43210',
    userType: 'DEFENCE_PERSONNEL',
    organization: 'Indian Army - Northern Command',
    rank: 'Major',
    role: 'USER',
    isVerified: true,
    isActive: true,
    lastLoginAt: '2026-08-21T09:30:00Z',
    createdAt: '2026-01-15T08:00:00Z'
  },
  {
    _id: 'usr-102',
    fullName: 'Col. Rajeshwar Singh (CERT-Army)',
    serviceId: 'CERT-ARMY-042',
    email: 'rajeshwar.cert@defence.nic.in',
    phone: '+91 98111 22334',
    userType: 'DEFENCE_PERSONNEL',
    organization: 'CERT-Army Cyber Operations Center',
    rank: 'Colonel',
    role: 'INVESTIGATOR',
    isVerified: true,
    isActive: true,
    lastLoginAt: '2026-08-21T10:15:00Z',
    createdAt: '2025-11-10T08:00:00Z'
  },
  {
    _id: 'usr-103',
    fullName: 'Brig. A. S. Nair (Chief Admin)',
    serviceId: 'ADMIN-HQ-001',
    email: 'admin.cyberdefense@gov.in',
    phone: '+91 98222 33445',
    userType: 'DEFENCE_PERSONNEL',
    organization: 'Defence Cyber Agency (DCA)',
    rank: 'Brigadier',
    role: 'ADMIN',
    isVerified: true,
    isActive: true,
    lastLoginAt: '2026-08-21T08:00:00Z',
    createdAt: '2025-08-01T08:00:00Z'
  },
  {
    _id: 'usr-104',
    fullName: 'Sunita Devi',
    serviceId: 'FAM-67210',
    email: 'sunita.devi88@gmail.com',
    phone: '+91 98333 44556',
    userType: 'FAMILY_MEMBER',
    organization: 'Army Welfare Housing Organisation',
    rank: 'Spouse of Sub. Major R. Kumar',
    role: 'USER',
    isVerified: true,
    isActive: true,
    lastLoginAt: '2026-08-20T18:20:00Z',
    createdAt: '2026-03-10T08:00:00Z'
  }
];

export const MOCK_INCIDENTS = [
  {
    _id: 'inc-001',
    complaintId: 'CRF-2026-000142',
    userId: 'usr-101',
    incidentType: 'PHISHING',
    title: 'Fake SPARSH Defence Pension Portal & Credential Harvesting Link',
    description: 'Received an urgent SMS claiming defence SPARSH pension account was locked and required immediate Aadhaar and Service Number verification via a suspicious link: https://sparsh-defence-update-portal.xyz/login. Submitting screenshot and SMS text.',
    incidentDate: '2026-08-20',
    incidentTime: '14:30',
    channel: 'SMS',
    suspectedSource: '+91 98451 09281',
    financialLoss: false,
    lossAmount: 0,
    currency: 'INR',
    location: 'Udhampur Military Station, J&K',
    status: 'UNDER_INVESTIGATION',
    severity: 'CRITICAL',
    priority: 'P1',
    assignedOfficerId: 'usr-102',
    assignedOfficerName: 'Col. Rajeshwar Singh',
    aiAnalysis: {
      classification: 'PHISHING',
      confidence: 0.98,
      riskScore: 94,
      modelVersion: '2.1.0-mil-fastapi',
      analyzedAt: '2026-08-20T14:32:10Z',
      probabilities: {
        phishing: 0.98,
        malware: 0.01,
        spam: 0.01,
        espionage: 0.85,
        opsecRisk: 0.75,
        financialFraud: 0.92,
        socialEngineering: 0.89,
        legitimate: 0.01
      },
      featuresUsed: ['Domain entropy', 'Keyword: SPARSH', 'Credential harvest form', 'SMS Sender spoofing'],
      indicators: [
        'Urgent spoofed language',
        'Unauthorized domain mimicking SPARSH',
        'Requests military Service ID & OTP'
      ],
      recommendation: 'Block domain at gateway immediately. Issue red advisory to command units. Do NOT click link or input credentials.'
    },
    evidences: [
      {
        _id: 'ev-101',
        evidenceId: 'EV-2026-8821',
        fileName: 'sparsh_fake_sms_screenshot.png',
        fileType: 'IMAGE',
        mimeType: 'image/png',
        fileSize: 482910,
        storagePath: '/secure/evidence/EV-2026-8821.png',
        sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        encryptionAlgorithm: 'AES-256-GCM',
        blockchain: {
          network: 'MIL-HYPERLEDGER-POLYGON-GOV',
          transactionId: '0x8f2d9c1b4e6a8d7e9f0123456789abcdef0123456789abcdef0123456789abcd',
          blockNumber: 18452109,
          timestamp: '2026-08-20T14:31:05Z'
        },
        uploadedAt: '2026-08-20T14:31:05Z'
      }
    ],
    timeline: [
      { status: 'SUBMITTED', timestamp: '2026-08-20T14:30:12Z', note: 'Complaint submitted by Major Vikram Rathore' },
      { status: 'AI_ANALYSIS', timestamp: '2026-08-20T14:31:00Z', note: 'AI Threat Classifier assigned Risk Score 94 (CRITICAL / P1)' },
      { status: 'UNDER_REVIEW', timestamp: '2026-08-20T14:35:00Z', note: 'Triaged by CERT-Army Automated Engine' },
      { status: 'ASSIGNED', timestamp: '2026-08-20T15:00:00Z', note: 'Assigned to Col. Rajeshwar Singh (Cyber Forensics Wing)' },
      { status: 'UNDER_INVESTIGATION', timestamp: '2026-08-20T16:15:00Z', note: 'Domain DNS sinkhole requested. ISP notified.' }
    ],
    officerNotes: [
      { id: 1, author: 'Col. Rajeshwar Singh', date: '2026-08-20 16:15', text: 'Domain registered via anonymous offshore registrar yesterday. High probability of state-sponsored credential harvesting campaign targeting Indian Armed Forces personnel.' }
    ],
    createdAt: '2026-08-20T14:30:12Z',
    updatedAt: '2026-08-20T16:15:00Z'
  },
  {
    _id: 'inc-002',
    complaintId: 'CRF-2026-000139',
    userId: 'usr-104',
    incidentType: 'FINANCIAL_FRAUD',
    title: 'Fraudulent Army Welfare Canteen (CSD) Card Recharge Scam',
    description: 'Impersonator called claiming to be from Army CSD Smart Card unit offering 50% extra canteen quota upon UPI transfer of Rs. 4,500. Money was transferred before realizing it was fraudulent.',
    incidentDate: '2026-08-19',
    incidentTime: '11:15',
    channel: 'CALL',
    suspectedSource: '+91 94002 11984',
    financialLoss: true,
    lossAmount: 4500,
    currency: 'INR',
    location: 'Pune Military Cantonment',
    status: 'ESCALATED',
    severity: 'HIGH',
    priority: 'P2',
    assignedOfficerId: 'usr-102',
    assignedOfficerName: 'Col. Rajeshwar Singh',
    aiAnalysis: {
      classification: 'FINANCIAL_FRAUD',
      confidence: 0.94,
      riskScore: 78,
      modelVersion: '2.1.0-mil-fastapi',
      analyzedAt: '2026-08-19T11:20:00Z',
      probabilities: {
        phishing: 0.40,
        malware: 0.05,
        spam: 0.88,
        espionage: 0.15,
        opsecRisk: 0.30,
        financialFraud: 0.94,
        socialEngineering: 0.91,
        legitimate: 0.02
      },
      featuresUsed: ['Call spoofing pattern', 'UPI Beneficiary analysis', 'CSD Impersonation'],
      indicators: [
        'Impersonating Army Welfare Canteen officer',
        'Demanded direct UPI payment',
        'Number flagged in 14 previous complaints'
      ],
      recommendation: 'Lodge formal cyber cell complaint for UPI freeze with nodal bank. Circulate awareness advisory to regimental family welfare centers.'
    },
    evidences: [
      {
        _id: 'ev-102',
        evidenceId: 'EV-2026-8790',
        fileName: 'upi_transaction_slip.pdf',
        fileType: 'FILE',
        mimeType: 'application/pdf',
        fileSize: 129400,
        storagePath: '/secure/evidence/EV-2026-8790.pdf',
        sha256Hash: '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
        encryptionAlgorithm: 'AES-256-GCM',
        blockchain: {
          network: 'MIL-HYPERLEDGER-POLYGON-GOV',
          transactionId: '0x1a2b3c4d5e6f708192a3b4c5d6e7f8091a2b3c4d5e6f708192a3b4c5d6e7f809',
          blockNumber: 18451800,
          timestamp: '2026-08-19T11:18:22Z'
        },
        uploadedAt: '2026-08-19T11:18:22Z'
      }
    ],
    timeline: [
      { status: 'SUBMITTED', timestamp: '2026-08-19T11:15:00Z', note: 'Report lodged by Sunita Devi' },
      { status: 'AI_ANALYSIS', timestamp: '2026-08-19T11:16:00Z', note: 'Automated Risk Score 78 (HIGH / P2)' },
      { status: 'ASSIGNED', timestamp: '2026-08-19T12:00:00Z', note: 'Assigned to Cyber Fraud Cell' },
      { status: 'ESCALATED', timestamp: '2026-08-19T14:30:00Z', note: 'Escalated to Bank Fraud Nodal Officer for UPI freeze' }
    ],
    officerNotes: [
      { id: 1, author: 'Col. Rajeshwar Singh', date: '2026-08-19 14:30', text: 'UPI reference transmitted to SBI Military Banking Unit for account lien and recovery.' }
    ],
    createdAt: '2026-08-19T11:15:00Z',
    updatedAt: '2026-08-19T14:30:00Z'
  },
  {
    _id: 'inc-003',
    complaintId: 'CRF-2026-000135',
    userId: 'usr-101',
    incidentType: 'ESPIONAGE',
    title: 'Suspicious Honeytrap & Military Deployment Probing on Social Media',
    description: 'Profile posing as a defence journalist on LinkedIn repeatedly attempted to elicit unit movement details, high-altitude gear procurement notes, and personal WhatsApp contact.',
    incidentDate: '2026-08-18',
    incidentTime: '20:45',
    channel: 'WEB',
    suspectedSource: 'https://linkedin.com/in/fake-def-reporter-sarah',
    financialLoss: false,
    lossAmount: 0,
    currency: 'INR',
    location: 'Northern Command HQ',
    status: 'UNDER_INVESTIGATION',
    severity: 'CRITICAL',
    priority: 'P1',
    assignedOfficerId: 'usr-102',
    assignedOfficerName: 'Col. Rajeshwar Singh',
    aiAnalysis: {
      classification: 'ESPIONAGE',
      confidence: 0.99,
      riskScore: 97,
      modelVersion: '2.1.0-mil-fastapi',
      analyzedAt: '2026-08-18T20:50:00Z',
      probabilities: {
        phishing: 0.35,
        malware: 0.10,
        spam: 0.20,
        espionage: 0.99,
        opsecRisk: 0.98,
        financialFraud: 0.05,
        socialEngineering: 0.99,
        legitimate: 0.01
      },
      featuresUsed: ['OPSEC keyword probe', 'Geotag harvesting inquiry', 'High-profile fake avatar'],
      indicators: [
        'Direct inquiry regarding troop movement & supply logistics',
        'Reverse image search indicates stolen avatar image',
        'Correlates with known adversary social grooming playbook'
      ],
      recommendation: 'Immediately terminate communication. Preserve chat logs with cryptographic hashes. Report profile for takedown.'
    },
    evidences: [],
    timeline: [
      { status: 'SUBMITTED', timestamp: '2026-08-18T20:45:00Z', note: 'Lodged by Major Vikram Rathore' },
      { status: 'AI_ANALYSIS', timestamp: '2026-08-18T20:50:00Z', note: 'AI classified as ESPIONAGE / OPSEC RISK (Score 97)' },
      { status: 'UNDER_INVESTIGATION', timestamp: '2026-08-19T09:00:00Z', note: 'Forwarded to Military Intelligence / CERT-Army Directorate' }
    ],
    officerNotes: [],
    createdAt: '2026-08-18T20:45:00Z',
    updatedAt: '2026-08-19T09:00:00Z'
  },
  {
    _id: 'inc-004',
    complaintId: 'CRF-2026-000128',
    userId: 'usr-101',
    incidentType: 'MALWARE',
    title: 'Malicious Android APK disguised as Indian Army Gallantry Awards App',
    description: 'Received WhatsApp forward with an APK file named `Army_Awards_2026.apk`. Decompiled analysis shows persistent background audio recording and contact exfiltration capabilities.',
    incidentDate: '2026-08-15',
    incidentTime: '09:00',
    channel: 'WHATSAPP',
    suspectedSource: '+91 88761 99012',
    financialLoss: false,
    lossAmount: 0,
    currency: 'INR',
    location: 'New Delhi Cantt',
    status: 'RESOLVED',
    severity: 'CRITICAL',
    priority: 'P1',
    assignedOfficerId: 'usr-102',
    assignedOfficerName: 'Col. Rajeshwar Singh',
    aiAnalysis: {
      classification: 'MALWARE',
      confidence: 0.99,
      riskScore: 98,
      modelVersion: '2.1.0-mil-fastapi',
      analyzedAt: '2026-08-15T09:10:00Z',
      probabilities: {
        phishing: 0.30,
        malware: 0.99,
        spam: 0.10,
        espionage: 0.95,
        opsecRisk: 0.96,
        financialFraud: 0.40,
        socialEngineering: 0.85,
        legitimate: 0.00
      },
      featuresUsed: ['APK Signature anomaly', 'Permission: RECORD_AUDIO & READ_CONTACTS', 'C2 Server: 185.220.101.5'],
      indicators: [
        'Remote Access Trojan (RAT) payload identified',
        'Command & Control telemetry targeting defence IP ranges',
        'Dangerous Android permissions requested silently'
      ],
      recommendation: 'Blacklist APK SHA-256 signature in enterprise MDM. Wipe affected mobile handsets.'
    },
    evidences: [],
    timeline: [
      { status: 'SUBMITTED', timestamp: '2026-08-15T09:00:00Z', note: 'Submitted with sample APK' },
      { status: 'AI_ANALYSIS', timestamp: '2026-08-15T09:10:00Z', note: 'Malware Trojan detected' },
      { status: 'UNDER_INVESTIGATION', timestamp: '2026-08-15T10:00:00Z', note: 'Forensic sandbox decompilation completed' },
      { status: 'RESOLVED', timestamp: '2026-08-16T18:00:00Z', note: 'Signatures pushed to Defence MDM and CERT advisory dispatched' }
    ],
    officerNotes: [
      { id: 1, author: 'Col. Rajeshwar Singh', date: '2026-08-16 18:00', text: 'C2 IP blocked across all defence firewalls. IOC shared with NCIIPC.' }
    ],
    createdAt: '2026-08-15T09:00:00Z',
    updatedAt: '2026-08-16T18:00:00Z'
  }
];

export const MOCK_ALERTS = [
  {
    _id: 'alt-001',
    userId: 'all',
    type: 'CRITICAL_THREAT',
    title: 'RED ALERT: Active Phishing Campaign Impersonating SPARSH Pension Portal',
    message: 'Adversary groups are sending SMS regarding immediate digital life certificate verification. Do not click links ending in .xyz or .top.',
    severity: 'CRITICAL',
    createdAt: '2026-08-21T08:00:00Z',
    isRead: false
  },
  {
    _id: 'alt-002',
    userId: 'all',
    type: 'SECURITY_WARNING',
    title: 'OPSEC Advisory: Disable Geotagging & Public Location Sharing on Military Bases',
    message: 'Ensure location services and automatic fitness tracker uploads are deactivated near all operational units and sensitive defence zones.',
    severity: 'HIGH',
    createdAt: '2026-08-20T16:00:00Z',
    isRead: false
  },
  {
    _id: 'alt-003',
    userId: 'usr-101',
    type: 'CASE_STATUS_CHANGE',
    title: 'Case Update: CRF-2026-000142',
    message: 'Your reported incident has been updated to UNDER_INVESTIGATION by Col. Rajeshwar Singh.',
    severity: 'INFO',
    createdAt: '2026-08-20T16:15:00Z',
    isRead: true
  }
];

export const MOCK_THREAT_INTELLIGENCE = [
  {
    _id: 'ti-1',
    indicatorType: 'URL',
    indicatorValue: 'https://sparsh-defence-update-portal.xyz',
    classification: 'PHISHING',
    riskScore: 96,
    source: 'CERT-Army Automated Scanner',
    confidence: 0.99,
    firstSeen: '2026-08-19',
    lastSeen: '2026-08-21',
    isActive: true
  },
  {
    _id: 'ti-2',
    indicatorType: 'PHONE',
    indicatorValue: '+91 94002 11984',
    classification: 'FINANCIAL_FRAUD',
    riskScore: 88,
    source: 'User Reports Aggregate (14 cases)',
    confidence: 0.95,
    firstSeen: '2026-08-10',
    lastSeen: '2026-08-21',
    isActive: true
  },
  {
    _id: 'ti-3',
    indicatorType: 'EMAIL',
    indicatorValue: 'notice-verify@indian-army-advisory.org',
    classification: 'ESPIONAGE',
    riskScore: 98,
    source: 'Defence Cyber Agency Threat Feeds',
    confidence: 0.99,
    firstSeen: '2026-08-12',
    lastSeen: '2026-08-20',
    isActive: true
  },
  {
    _id: 'ti-4',
    indicatorType: 'IP',
    indicatorValue: '185.220.101.5',
    classification: 'MALWARE_C2',
    riskScore: 99,
    source: 'Sandboxed Malware Telemetry',
    confidence: 1.0,
    firstSeen: '2026-08-15',
    lastSeen: '2026-08-21',
    isActive: true
  }
];

export const MOCK_ML_METRICS = {
  modelName: 'cyber-threat-classifier',
  modelVersion: '2.1.0-mil-fastapi',
  overallAccuracy: 97.4,
  precision: 96.2,
  recall: 98.6,
  f1Score: 97.4,
  rocAuc: 0.992,
  averageInferenceLatencyMs: 42,
  totalScansProcessed: 28940,
  threatsNeutralized: 4120,
  confusionMatrix: [
    { actual: 'Phishing', predicted: { Phishing: 982, Malware: 4, Spam: 10, Espionage: 4 } },
    { actual: 'Malware', predicted: { Phishing: 2, Malware: 490, Spam: 2, Espionage: 6 } },
    { actual: 'Espionage', predicted: { Phishing: 3, Malware: 5, Spam: 0, Espionage: 388 } },
    { actual: 'Financial Fraud', predicted: { Phishing: 8, Malware: 1, Spam: 5, Espionage: 0 } },
    { actual: 'Legitimate', predicted: { Phishing: 12, Malware: 3, Spam: 8, Espionage: 1 } }
  ]
};

export const MOCK_AUDIT_LOGS = [
  {
    _id: 'log-001',
    actorId: 'usr-102',
    actorName: 'Col. Rajeshwar Singh',
    actorRole: 'INVESTIGATOR',
    action: 'CHANGE_STATUS',
    resourceType: 'INCIDENT',
    resourceId: 'CRF-2026-000142',
    ipAddress: '10.240.12.91 (MIL-VPN)',
    userAgent: 'CyberShield-SecureClient/2.4',
    metadata: { oldStatus: 'UNDER_REVIEW', newStatus: 'UNDER_INVESTIGATION' },
    timestamp: '2026-08-20T16:15:00Z'
  },
  {
    _id: 'log-002',
    actorId: 'usr-101',
    actorName: 'Major Vikram Rathore',
    actorRole: 'USER',
    action: 'UPLOAD_EVIDENCE',
    resourceType: 'EVIDENCE',
    resourceId: 'EV-2026-8821',
    ipAddress: '10.118.45.22',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    metadata: { sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' },
    timestamp: '2026-08-20T14:31:05Z'
  },
  {
    _id: 'log-003',
    actorId: 'SYSTEM_AI',
    actorName: 'FastAPI ML Engine',
    actorRole: 'SYSTEM',
    action: 'AI_ANALYSIS',
    resourceType: 'INCIDENT',
    resourceId: 'CRF-2026-000142',
    ipAddress: '127.0.0.1:8000',
    userAgent: 'Python-FastAPI/0.115',
    metadata: { classification: 'PHISHING', confidence: 0.98, riskScore: 94 },
    timestamp: '2026-08-20T14:32:10Z'
  },
  {
    _id: 'log-004',
    actorId: 'usr-103',
    actorName: 'Brig. A. S. Nair',
    actorRole: 'ADMIN',
    action: 'ADMIN_ACTION',
    resourceType: 'SYSTEM_CONFIG',
    resourceId: 'GATEWAY_FIREWALL_RULE_99',
    ipAddress: '10.200.0.1 (SECURE-GATEWAY)',
    userAgent: 'CyberShield-AdminConsole',
    metadata: { blockedDomain: 'sparsh-defence-update-portal.xyz' },
    timestamp: '2026-08-20T17:00:00Z'
  }
];

export const AWARENESS_MODULES = [
  {
    id: 'opsec',
    title: 'Operational Security (OPSEC) for Armed Forces',
    category: 'Military Protocol',
    readTime: '6 min read',
    icon: 'ShieldAlert',
    summary: 'Essential guidelines on safeguarding unit location, troop strength, operational movements, and equipment details from hostile intelligence collection.',
    rules: [
      'Never discuss postings, deployments, training exercises, or equipment readiness on unclassified platforms.',
      'Deactivate GPS geotagging, fitness tracker public maps, and social check-ins inside all military cantonments.',
      'Beware of digital honeytraps and unknown contacts posing as defence correspondents, military historians, or job recruiters.',
      'Report any unsolicited queries regarding military infrastructure to CERT-Army immediately.'
    ]
  },
  {
    id: 'phishing',
    title: 'Recognizing Defence-Themed Phishing & Impersonation',
    category: 'Threat Defense',
    readTime: '5 min read',
    icon: 'MailWarning',
    summary: 'Tactics used by threat actors mimicking official defence portals like SPARSH, ECHS, AGIF, PCDA(P), and Army Welfare schemes.',
    rules: [
      'Official defence portals will always end with `.gov.in` or `.nic.in`. Never trust `.xyz`, `.top`, `.online`, or `.club` extensions.',
      'SPARSH never requests OTP or debit card PINs via SMS or WhatsApp for Digital Life Certificate submission.',
      'Verify sender email headers for domain alignment before clicking attachments or entering Service IDs.',
      'Use the CyberShield URL and Email Checker tools before opening suspicious files.'
    ]
  },
  {
    id: 'mobile',
    title: 'Mobile Security & Untrusted APK Guidelines',
    category: 'Endpoint Security',
    readTime: '4 min read',
    icon: 'Smartphone',
    summary: 'How hostile intelligence services deploy weaponized Android applications to exfiltrate location, microphone audio, and contact lists.',
    rules: [
      'Never side-load APK files received over WhatsApp, Telegram, or third-party web links.',
      'Audit app permissions regularly. A gallery or calculator app should never have SMS or microphone access.',
      'Keep mobile OS updated with the latest monthly Android/iOS security patches.',
      'Only use MDM-approved military communication tools for sensitive discussions.'
    ]
  },
  {
    id: 'financial',
    title: 'Preventing Defence Canteen (CSD) & Loan Scams',
    category: 'Fraud Prevention',
    readTime: '5 min read',
    icon: 'CreditCard',
    summary: 'Protection against fraudsters targeting veterans and service personnel with fake CSD token booking, pension advance loans, and car schemes.',
    rules: [
      'AFD CSD portal does not charge booking fees via personal UPI IDs or QR codes.',
      'Validate all pension loan queries directly with your regimental welfare center or bank branch.',
      'Do not share PAN, Aadhaar, or Service Book copies with unverified intermediaries.',
      'Report suspected fake numbers to CyberShield to update the national defence spam blacklist.'
    ]
  }
];
