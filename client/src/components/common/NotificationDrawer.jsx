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
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-defence-slate border-l border-defence-border shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-4 border-b border-defence-border flex items-center justify-between bg-defence-dark/60">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-cyan-400" />
              <h2 className="font-semibold text-white tracking-wide">Threat Advisories & Alerts</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={markAllAsRead}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" /> Mark All Read
              </button>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-1 rounded-lg text-defence-muted hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {notifications.length === 0 ? (
              <div className="text-center py-12 text-defence-muted">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p>No active alerts at this moment</p>
              </div>
            ) : (
              notifications.map((notif) => {
                const isCrit = notif.severity === 'CRITICAL';
                return (
                  <div
                    key={notif._id}
                    onClick={() => markAsRead(notif._id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      !notif.isRead 
                        ? (isCrit ? 'bg-red-950/40 border-red-800/80 shadow-glow-red' : 'bg-slate-800/80 border-cyan-500/40 shadow-glow-cyan')
                        : 'bg-slate-900/60 border-slate-800 opacity-75'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {isCrit ? (
                          <AlertOctagon className="w-4 h-4 text-red-400 animate-pulse" />
                        ) : notif.severity === 'HIGH' ? (
                          <ShieldAlert className="w-4 h-4 text-amber-400" />
                        ) : (
                          <Info className="w-4 h-4 text-cyan-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className={`text-xs font-bold leading-snug ${isCrit ? 'text-red-300' : 'text-white'}`}>
                            {notif.title}
                          </h4>
                          {!notif.isRead && (
                            <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0"></span>
                          )}
                        </div>
                        <p className="text-xs text-defence-muted mt-1 leading-relaxed">
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
          <div className="p-3 bg-defence-dark/80 border-t border-defence-border text-[11px] font-mono text-defence-muted text-center">
            Defence Cyber Alert Broadcast System • CERT-Army
          </div>
        </div>
      </div>
    </div>
  );
}
