import React from 'react';
import { Shield, Lock, ExternalLink, Award } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#040605] border-t border-red-500/15 mt-auto py-10 text-xs text-[#869F90] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">

          <div className="md:col-span-2 space-y-3.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#F20D25]/15 border border-[#F20D25]/40 flex items-center justify-center text-[#F20D25]">
                <Shield className="w-4.5 h-4.5 stroke-[2.2]" />
              </div>
              <span className="font-display font-bold text-white tracking-wider text-sm">
                CYBER<span className="text-[#F20D25]">SHIELD</span> // DEFENCE PORTAL
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed max-w-md text-xs">
              Specialized cyber fraud reporting, automated threat classification, and tamper-proof evidence preservation system for Armed Forces personnel, veterans, and military families.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-mono">
              <span className="pill-glass px-2.5 py-1 text-[10px] flex items-center gap-1.5 border-red-500/30">
                <Lock className="w-3 h-3 text-[#F20D25]" /> AES-256 ENCRYPTED
              </span>
              <span className="pill-glass px-2.5 py-1 text-[10px] flex items-center gap-1.5 border-red-500/30">
                <Award className="w-3 h-3 text-[#F20D25]" /> SHA-256 EVIDENCE
              </span>
              <span className="pill-glass px-2.5 py-1 text-[10px] text-[#F20D25] border-[#F20D25]/40">
                ● TLS 1.3 VERIFIED
              </span>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3 uppercase tracking-widest text-[11px] font-cyber text-[#F20D25]">
              EMERGENCY HOTLINES
            </h4>
            <ul className="space-y-2 font-mono text-slate-300 text-xs">
              <li>National Cyber Helpline: <strong className="text-[#F20D25]">1930</strong></li>
              <li>CERT-Army Operations: <strong className="text-cyan-300">011-26701700</strong></li>
              <li>DCA Defence Cyber: <strong className="text-red-300">011-23019800</strong></li>
              <li>SPARSH Pension Desk: <strong className="text-amber-400">1800-180-5325</strong></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3 uppercase tracking-widest text-[11px] font-cyber text-[#F20D25]">
              DEFENCE DIRECTORIES
            </h4>
            <ul className="space-y-2 text-slate-400 text-xs font-mono">
              <li>
                <a href="https://sparsh.defencepension.gov.in" target="_blank" rel="noreferrer" className="hover:text-[#F20D25] flex items-center gap-1 transition">
                  SPARSH Pension <ExternalLink className="w-3 h-3 text-[#F20D25]/60" />
                </a>
              </li>
              <li>
                <a href="https://echs.gov.in" target="_blank" rel="noreferrer" className="hover:text-[#F20D25] flex items-center gap-1 transition">
                  ECHS Healthcare <ExternalLink className="w-3 h-3 text-[#F20D25]/60" />
                </a>
              </li>
              <li>
                <a href="https://mod.gov.in" target="_blank" rel="noreferrer" className="hover:text-[#F20D25] flex items-center gap-1 transition">
                  Ministry of Defence <ExternalLink className="w-3 h-3 text-[#F20D25]/60" />
                </a>
              </li>
              <li>
                <a href="https://cert-in.org.in" target="_blank" rel="noreferrer" className="hover:text-[#F20D25] flex items-center gap-1 transition">
                  CERT-In Advisories <ExternalLink className="w-3 h-3 text-[#F20D25]/60" />
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-red-500/15 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#869F90] font-mono">
          <div>
            COPYRIGHT © 2026 // ARMED FORCES CYBER SHIELD INITIATIVE
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[#F20D25]">● MIL-STD-810G COMPLIANT</span>
            <span>RESTRICTED ACCESS</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
