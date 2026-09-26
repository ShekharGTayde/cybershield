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
  Zap,
  ShieldCheck,
  LifeBuoy
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { useSync } from '../../context/SyncContext';

export function Navbar() {
  const { user, logout } = useAuth();
  const { unreadCount, setIsDrawerOpen } = useNotifications();
  const { isOnline } = useSync();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isInvestigator = user?.role === 'INVESTIGATOR' || user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';

  return (
    <header className="sticky top-0 z-40 bg-[#0B0D14]/96 backdrop-blur-md border-b border-white/[0.06]">
      {/* Live Advisory Ticker */}
      <div className="bg-[#0E1018]/90 border-b border-white/[0.05] px-4 py-1.5 flex items-center gap-3 overflow-hidden">
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E05C1A] animate-pulse" />
          <Radio className="w-3 h-3 text-[#E05C1A]" />
          <span className="text-[10px] font-bold tracking-widest text-[#E05C1A] uppercase">Advisory</span>
        </div>
        <div className="overflow-hidden flex-1">
          <div className="inline-block animate-marquee text-[11px] text-slate-400 whitespace-nowrap">
            Notice: Avoid clicking fake SPARSH pension links ending in unverified domains (.xyz / .top) &nbsp;•&nbsp; Do not install unverified APK files from WhatsApp forwards &nbsp;•&nbsp; Official CSD tokens do not require UPI advance payments &nbsp;•&nbsp; National Cyber Helpline: 1930
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-15 py-3">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#E05C1A] shadow-md group-hover:shadow-[0_0_20px_rgba(224,92,26,0.35)] transition-shadow">
              <Shield className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[17px] font-bold tracking-tight text-white leading-none">
                  CyberShield
                </span>
                <span className="text-[9px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded-sm bg-[#E05C1A]/15 text-[#F0804A] border border-[#E05C1A]/25">
                  Defence
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-normal mt-0.5 leading-none">
                Fraud Reporting & Threat Protection Portal
              </p>
            </div>
          </Link>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            
            {/* Network status */}
            <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${
              isOnline 
                ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/40' 
                : 'bg-amber-950/40 text-amber-400 border-amber-800/40'
            }`}>
              {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
              <span>{isOnline ? 'Secure' : 'Offline'}</span>
            </div>

            {/* Role Display */}
            {user && (
              <div className="relative">
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.05] text-[11px] text-slate-300 border border-white/[0.07] transition">
                  <Zap className="w-3 h-3 text-[#E05C1A]" />
                  <span className="hidden md:inline text-slate-500">Role:</span>
                  <span className="font-semibold text-white">{user.role}</span>
                </div>
              </div>
            )}

            {/* Notifications */}
            {user && (
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="relative p-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.09] text-slate-400 hover:text-white border border-white/[0.07] transition"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#E05C1A] text-[9px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </button>
            )}

            {/* User Profile */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-1.5 pr-2.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.07] transition"
                >
                  <div className="w-7 h-7 rounded-full bg-[#E05C1A]/20 text-[#F0804A] border border-[#E05C1A]/30 flex items-center justify-center font-bold text-xs">
                    {user.fullName?.charAt(0) || 'U'}
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-[11px] font-semibold text-white leading-none">{user.fullName}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{user.serviceId}</p>
                  </div>
                  <ChevronDown className="w-3 h-3 text-slate-500" />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-[#111420] border border-white/[0.08] rounded-xl shadow-2xl py-2 z-50 animate-fadeIn">
                    <div className="px-4 py-2.5 border-b border-white/[0.06]">
                      <p className="text-[12px] font-semibold text-white">{user.fullName}</p>
                      <p className="text-[10px] text-[#F0804A] mt-0.5">{user.serviceId}</p>
                      <p className="text-[10px] text-slate-500 truncate">{user.organization}</p>
                      <span className="inline-block mt-1 text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-white/[0.06] text-slate-300 border border-white/[0.08]">
                        {user.role} · {user.userType?.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <div className="py-1">
                      {[
                        { to: '/dashboard', icon: Layers, label: 'My Dashboard', cls: 'text-slate-300' },
                        ...(isInvestigator ? [{ to: '/investigator', icon: ShieldCheck, label: 'Investigator Queue', cls: 'text-amber-400' }] : []),
                        { to: '/track', icon: Activity, label: 'Track My Complaint', cls: 'text-slate-300' },
                      ].map(({ to, icon: Icon, label, cls }) => (
                        <Link
                          key={to}
                          to={to}
                          onClick={() => setIsProfileOpen(false)}
                          className={`flex items-center gap-2.5 px-4 py-2 text-[11px] hover:bg-white/[0.05] transition ${cls}`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          {label}
                        </Link>
                      ))}
                    </div>

                    <div className="border-t border-white/[0.06] pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-[11px] text-rose-400 hover:bg-rose-950/20 transition"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="px-3 py-1.5 text-[11px] font-medium text-slate-400 hover:text-white transition">
                  Sign In
                </Link>
                <Link to="/register" className="px-3.5 py-1.5 text-[11px] font-semibold rounded-lg bg-[#E05C1A] hover:bg-[#D04E10] text-white shadow-sm transition">
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
