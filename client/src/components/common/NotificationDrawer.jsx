import React from 'react';
import { X, Bell, AlertOctagon, Info, ShieldAlert, Check } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';

export function NotificationDrawer() {
  const { notifications, isDrawerOpen, setIsDrawerOpen, markAsRead, markAllAsRead } = useNotifications();

  if (!isDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={() => setIsDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#060907] border-l border-red-500/30 shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-5 border-b border-slate-800/80 flex items-center justify-between bg-black/60">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-red-950/80 border border-red-500/40 flex items-center justify-center text-red-400">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-display font-bold text-white uppercase tracking-wider">Threat Advisories & Alerts</h2>
                <span className="text-[10px] font-mono text-red-400">MIL-STD Broadcast Feed</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={markAllAsRead}
                className="text-[11px] text-red-400 hover:text-red-300 font-mono flex items-center gap-1 transition"
              >
                <Check className="w-3.5 h-3.5" /> Mark All Read
              </button>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {notifications.length === 0 ? (
              <div className="text-center py-16 text-slate-500 space-y-2">
                <Bell className="w-10 h-10 mx-auto text-red-500/30" />
                <p className="font-mono text-xs">No active alerts at this moment</p>
              </div>
            ) : (
              notifications.map((notif) => {
                const isCrit = notif.severity === 'CRITICAL';
                return (
                  <div
                    key={notif._id}
                    onClick={() => markAsRead(notif._id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      !notif.isRead 
                        ? (isCrit ? 'bg-red-950/40 border-red-500/50 shadow-glow-red' : 'bg-slate-950 border-red-500/40 shadow-glow-neon')
                        : 'bg-slate-950/60 border-slate-900 opacity-70'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {isCrit ? (
                          <AlertOctagon className="w-4 h-4 text-red-400 animate-pulse" />
                        ) : notif.severity === 'HIGH' ? (
                          <ShieldAlert className="w-4 h-4 text-amber-400" />
                        ) : (
                          <Info className="w-4 h-4 text-red-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className={`text-xs font-bold leading-snug ${isCrit ? 'text-red-300 font-mono' : 'text-white'}`}>
                            {notif.title}
                          </h4>
                          {!notif.isRead && (
                            <span className="w-2 h-2 rounded-full bg-red-400 shrink-0 shadow-glow-neon"></span>
                          )}
                        </div>
                        <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                          {notif.message}
                        </p>
                        <span className="text-[10px] font-mono text-slate-500 mt-2 block">
                          {new Date(notif.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer note */}
          <div className="p-3.5 bg-black/90 border-t border-slate-800/80 text-[10px] font-mono text-slate-500 text-center tracking-wider uppercase">
            Defence Cyber Alert Broadcast System • CERT-Army
          </div>
        </div>
      </div>
    </div>
  );
}
