import React from 'react';
import { Shield, Lock, ExternalLink, Award } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-defence-dark border-t border-defence-border mt-auto py-8 text-xs text-defence-muted font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-cyan-400" />
              <span className="font-bold text-white tracking-wider">CYBERSHIELD DEFENCE PORTAL</span>
            </div>
            <p className="text-defence-muted leading-relaxed max-w-md">
              Specialized cyber fraud reporting, automated threat classification, and tamper-proof evidence preservation system for Armed Forces personnel, veterans, and military families.
            </p>
            <div className="flex items-center gap-3 text-[11px] font-mono text-cyan-400/90">
              <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> AES-256 Encrypted</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Award className="w-3 h-3" /> SHA-256 Blockchain Anchored</span>
              <span>•</span>
              <span>TLS 1.3 Strict</span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-2 uppercase tracking-wider text-[11px] font-mono text-cyan-300">
              Emergency Numbers
            </h4>
            <ul className="space-y-1.5 font-mono text-slate-400">
              <li>National Cyber Crime: <strong className="text-white">1930</strong></li>
              <li>CERT-Army Helpline: <strong className="text-cyan-400">011-26701700</strong></li>
              <li>DCA Operations: <strong className="text-emerald-400">011-23019800</strong></li>
              <li>SPARSH Pension Help: <strong className="text-amber-400">1800-180-5325</strong></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-2 uppercase tracking-wider text-[11px] font-mono text-cyan-300">
              Defence Portals
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <a href="https://sparsh.defencepension.gov.in" target="_blank" rel="noreferrer" className="hover:text-white flex items-center gap-1">
                  SPARSH Pension <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a href="https://echs.gov.in" target="_blank" rel="noreferrer" className="hover:text-white flex items-center gap-1">
                  ECHS Healthcare <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a href="https://mod.gov.in" target="_blank" rel="noreferrer" className="hover:text-white flex items-center gap-1">
                  Ministry of Defence <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a href="https://cert-in.org.in" target="_blank" rel="noreferrer" className="hover:text-white flex items-center gap-1">
                  CERT-In Advisories <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-800/80 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-mono text-slate-500">
          <div>
            Cyber Fraud Reporting and Prevention Portal • Major Project • MIT Sambhajinagar
          </div>
          <div>
            Team: Rushikesh Mundhe, Shekhar Tayde, Ashish Vaidya | Guide: Mr. R. N. Patil Sir
          </div>
        </div>
      </div>
    </footer>
  );
}
