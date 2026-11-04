import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  CheckCircle2,
  Cpu,
  Plus,
  Search,
  Shield,
  ShieldAlert,
  Terminal,
} from 'lucide-react';
import { api } from '../services/api';

const STATS = [
  ['97.4%', 'CLASSIFICATION PRECISION'],
  ['< 45ms', 'TRIAGE RESPONSE'],
  ['SHA-256', 'EVIDENCE LEDGER'],
];

export function LandingPage() {
  const [quickScanInput, setQuickScanInput] = useState('');
  const [quickScanResult, setQuickScanResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  const handleQuickScan = async (event) => {
    event.preventDefault();
    if (!quickScanInput.trim()) return;

    setIsScanning(true);
    try {
      const isUrl = quickScanInput.startsWith('http') || /\.(com|xyz|in)\b/i.test(quickScanInput);
      const result = await api.analyzeThreat({
        text: quickScanInput,
        url: isUrl ? quickScanInput : undefined,
        inputType: isUrl ? 'URL' : 'TEXT',
      });
      setQuickScanResult(result);
    } catch (error) {
      console.error(error);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="reference-page">
      <section className="reference-hero">
        <div className="reference-hero-top">
          <span className="reference-brand">CYBER//SHIELD <Shield size={12} /></span>
          <span className="reference-micro">DEFENCE FRAUD REPORTING PORTAL</span>
          <span className="reference-micro">EST. 2026</span>
        </div>

        <div className="reference-hero-grid">
          <div className="reference-side-copy">
            <span className="reference-corner-label">01 / FRONTLINE</span>
            <h1>BUILT<br />TO<br /><em>PROTECT.</em></h1>
            <p>SECURE REPORTING<br />FOR THE HUMAN<br />STANDARD.</p>
            <span className="reference-dots">••••••</span>
          </div>

          <div className="reference-figure" aria-label="CyberShield active protection">
            <div className="reference-orbit reference-orbit-one" />
            <div className="reference-orbit reference-orbit-two" />
            <div className="reference-orbit reference-orbit-three" />
            <div className="reference-figure-mark">
              <Shield size={96} strokeWidth={1.1} />
              <span>ACTIVE<br />DEFENCE</span>
            </div>
            <div className="reference-figure-shadow" />
          </div>

          <div className="reference-side-copy reference-side-right">
            <span className="reference-corner-label">02 / COMMAND</span>
            <h2>THE HUMAN<br /><em>STANDARD.</em></h2>
            <p>REPORT SCAMS.<br />PRESERVE EVIDENCE.<br />STAY IN RANGE.</p>
            <Link to="/report" className="reference-link">
              EXPLORE THE PORTAL <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>

        <div className="reference-red-band">
          <span>CYBER</span><span>SHIELD</span><span>DEFENCE</span>
        </div>
      </section>

      <section className="reference-actions">
        <div className="reference-action-copy">
          <span className="reference-corner-label">03 / ACCESS POINT</span>
          <h2>STAY<br /><em>IN RANGE.</em></h2>
          <p>One secure channel for every service member, veteran, and family.</p>
          <div className="reference-buttons">
            <Link to="/report" className="reference-button reference-button-red">
              REPORT INCIDENT <ArrowUpRight size={17} />
            </Link>
            <Link to="/track" className="reference-button">
              TRACK COMPLAINT <Search size={16} />
            </Link>
          </div>
        </div>
        <div className="reference-stat-grid">
          {STATS.map(([value, label]) => (
            <div className="reference-stat" key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="reference-scanner">
        <div className="reference-section-heading">
          <span className="reference-corner-label">04 / VERIFY</span>
          <h2>CHECK YOUR<br /><em>THREAT.</em></h2>
          <p>Paste a suspicious URL, SMS, or message. Our threat engine will classify it before you act.</p>
        </div>
        <form onSubmit={handleQuickScan} className="reference-scan-form">
          <div className="reference-input-wrap">
            <Terminal size={16} />
            <input
              value={quickScanInput}
              onChange={(event) => setQuickScanInput(event.target.value)}
              placeholder="ENTER URL OR MESSAGE..."
              aria-label="Suspicious URL or message"
            />
          </div>
          <button type="submit" className="reference-button reference-button-red" disabled={isScanning}>
            {isScanning ? 'SCANNING...' : 'RUN SCAN'} <Cpu size={16} />
          </button>
        </form>
        {quickScanResult && (
          <div className="reference-result">
            <CheckCircle2 size={17} />
            <span>SCAN COMPLETE — REVIEW THE THREAT ANALYSIS FOR THIS INPUT.</span>
          </div>
        )}
      </section>

      <section className="reference-feature-grid">
        {[
          ['01', 'AUTOMATED TRIAGE', 'Immediate classification for phishing, honeytraps, Trojan APKs, and payment scams.'],
          ['02', 'EVIDENCE VAULT', 'SHA-256 hashed files preserve legal integrity and chain of custody.'],
          ['03', 'OFFLINE READY', 'Draft securely at the border and sync encrypted evidence when connected.'],
        ].map(([number, title, description]) => (
          <article className="reference-feature" key={number}>
            <span className="reference-feature-number">{number}</span>
            <Plus size={19} />
            <h3>{title}</h3>
            <p>{description}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
