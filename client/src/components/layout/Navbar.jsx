import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Bell, 
  Radio, 
  Wifi, 
  WifiOff, 
  User, 
  LogOut, 
  ChevronDown, 
  Activity, 
  Layers, 
  Zap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { useSync } from '../../context/SyncContext';

export function Navbar() {
  const { user, logout, switchDemoRole } = useAuth();
  const { unreadCount, setIsDrawerOpen } = useNotifications();
  const { isOnline } = useSync();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-defence-slate/90 backdrop-blur-md border-b border-defence-border">
      {/* Live Threat Ticker Header */}
      <div className="bg-defence-dark/95 border-b border-slate-800/80 px-4 py-1 flex items-center text-[11px] font-mono text-defence-muted overflow-hidden">
        <div className="flex items-center gap-1.5 text-cyan-400 font-semibold shrink-0 mr-4">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
          <Radio className="w-3.5 h-3.5" />
          <span>CERT-ARMY LIVE FEED:</span>
        </div>
        <div className="overflow-hidden whitespace-nowrap">
          <div className="inline-block animate-marquee text-slate-300">
            [ADVISORY] Block fake SPARSH pension URLs ending in .xyz • [MALWARE] Indian_Army_Awards_2026.apk contains Trojan dropper • [CSD ALERT] Do not transfer token fees via personal UPI • [OPSEC] Turn off military cantonment GPS tags
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-glow-cyan">
                <Shield className="w-5 h-5 text-white transform group-hover:scale-110 transition-transform" />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
                </span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-extrabold tracking-wider bg-gradient-to-r from-white via-slate-100 to-cyan-400 bg-clip-text text-transparent">
                    CYBERSHIELD
                  </span>
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                    DEFENCE
                  </span>
                </div>
                <p className="text-[10px] text-defence-muted font-mono tracking-tight -mt-0.5">
                  Cyber Fraud Reporting & Prevention Portal
                </p>
              </div>
            </Link>
          </div>

          {/* Quick Actions & Navigation */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* Network connectivity badge */}
            <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono border ${
              isOnline 
                ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/80' 
                : 'bg-amber-950/60 text-amber-400 border-amber-800/80 animate-pulse'
            }`}>
              {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
              <span>{isOnline ? 'DEFENCE-NET SECURE' : 'OFFLINE MODE'}</span>
            </div>

            {/* Quick Demo Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-xs font-mono text-cyan-300 border border-slate-700 transition"
                title="Switch Demo Role"
              >
                <Zap className="w-3.5 h-3.5 text-yellow-400" />
                <span className="hidden md:inline">Role:</span>
                <span className="font-bold text-white">{user?.role || 'USER'}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isRoleMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-1.5 z-50">
                  <div className="px-3 py-1 text-[10px] font-mono text-slate-400 uppercase tracking-wider border-b border-slate-800">
                    Switch Test Perspective
                  </div>
                  <button
                    onClick={() => { switchDemoRole('USER'); setIsRoleMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-cyan-950/60 hover:text-cyan-300 flex items-center justify-between"
                  >
                    <span>Defence Personnel</span>
                    <span className="text-[10px] font-mono text-slate-500">USER</span>
                  </button>
                  <button
                    onClick={() => { switchDemoRole('INVESTIGATOR'); setIsRoleMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-cyan-950/60 hover:text-cyan-300 flex items-center justify-between"
                  >
                    <span>Col. Rajeshwar (CERT)</span>
                    <span className="text-[10px] font-mono text-amber-500">INVESTIGATOR</span>
                  </button>
                  <button
                    onClick={() => { switchDemoRole('ADMIN'); setIsRoleMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-cyan-950/60 hover:text-cyan-300 flex items-center justify-between"
                  >
                    <span>Brig. A. S. Nair (HQ)</span>
                    <span className="text-[10px] font-mono text-purple-400">ADMIN</span>
                  </button>
                  <button
                    onClick={() => { switchDemoRole('FAMILY'); setIsRoleMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-cyan-950/60 hover:text-cyan-300 flex items-center justify-between"
                  >
                    <span>Family / Veteran</span>
                    <span className="text-[10px] font-mono text-slate-500">USER</span>
                  </button>
                </div>
              )}
            </div>

            {/* Notification Bell Button */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="relative p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
              title="Threat Advisories"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-glow-red">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* User Profile Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
                >
                  <div className="w-7 h-7 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center font-mono font-bold text-xs">
                    {user.fullName?.charAt(0) || 'U'}
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-xs font-semibold text-white leading-none">{user.fullName}</p>
                    <p className="text-[10px] font-mono text-cyan-400">{user.serviceId}</p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-800">
                      <p className="text-xs font-semibold text-white">{user.fullName}</p>
                      <p className="text-[11px] font-mono text-cyan-400">{user.serviceId}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user.organization}</p>
                      <span className="inline-block mt-1 text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {user.userType?.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/dashboard"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white"
                      >
                        <Layers className="w-4 h-4 text-cyan-400" />
                        Dashboard
                      </Link>
                      <Link
                        to="/track"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white"
                      >
                        <Activity className="w-4 h-4 text-emerald-400" />
                        Track Complaints
                      </Link>
                    </div>

                    <div className="border-t border-slate-800 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-400 hover:bg-red-950/40"
                      >
                        <LogOut className="w-4 h-4" />
                        Secure Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-xs font-medium text-white hover:text-cyan-400 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 text-xs font-medium rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white shadow-glow-cyan transition"
                >
                  Register
                </Link>
              </div>
            )}

          </div>

        </div>
      </div>
    </header>
  );
}
