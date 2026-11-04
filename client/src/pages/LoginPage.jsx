import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Lock, User, KeyRound, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Captcha } from '../components/common/Captcha';
import { MOCK_USERS } from '../services/mockData';

export function LoginPage() {
  const [serviceId, setServiceId] = useState('IC-78921X');
  const [password, setPassword] = useState('SecurePass@2026');
  const [captchaInput, setCaptchaInput] = useState('');
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoverySent, setRecoverySent] = useState(false);

  const { login, switchDemoRole } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!isCaptchaValid) {
      setError('Please enter the security verification code displayed below.');
      return;
    }

    setLoading(true);
    try {
      await login({ serviceId, password, rememberDevice });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify your Defence Service ID or credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoSelect = (roleKey) => {
    switchDemoRole(roleKey);
    let target = MOCK_USERS[0];
    if (roleKey === 'INVESTIGATOR') target = MOCK_USERS[1];
    if (roleKey === 'ADMIN') target = MOCK_USERS[2];
    if (roleKey === 'FAMILY') target = MOCK_USERS[3];

    setServiceId(target.serviceId);
    setPassword('DemoPass@123');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-10 px-4 sm:px-6 relative">
      <div className="w-full max-w-md space-y-6">
        
        {/* Card */}
        <div className="glass-panel-glow rounded-3xl p-8 border border-red-500/25 shadow-2xl relative overflow-hidden backdrop-blur-2xl">
          <div className="pointer-events-none absolute -top-16 -right-16 w-48 h-48 rounded-full bg-[#F20D25]/15 blur-3xl" />
          
          <div className="text-center space-y-2 mb-7 relative z-10">
            <div className="inline-flex p-3 rounded-2xl bg-[#F20D25]/10 border border-[#F20D25]/40 text-[#F20D25] mb-2 shadow-[0_0_20px_rgba(255,38,56,0.25)]">
              <Shield className="w-8 h-8 stroke-[2.2]" />
            </div>
            <h1 className="font-display text-2xl font-black text-white tracking-wide uppercase">
              DEFENCE CYBER LOGIN
            </h1>
            <p className="text-xs text-[#869F90] font-mono">
              Authorized access for Armed Forces, Veterans & Defence Kin
            </p>
          </div>

          {/* Quick Demo Selector Chips */}
          <div className="mb-6 p-3.5 rounded-2xl bg-black/60 border border-red-500/20 space-y-2 relative z-10">
            <p className="text-[10px] font-mono text-[#869F90] font-bold uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F20D25] animate-pulse" />
              QUICK TEST PROFILES:
            </p>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickDemoSelect('USER')}
                className="px-2 py-1.5 rounded-xl bg-black/50 hover:bg-[#F20D25]/15 text-slate-200 hover:text-[#F20D25] border border-red-500/30 text-center truncate transition font-cyber font-bold cursor-pointer"
              >
                Maj. Vikram
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoSelect('INVESTIGATOR')}
                className="px-2 py-1.5 rounded-xl bg-black/50 hover:bg-amber-500/15 text-amber-300 border border-amber-500/30 text-center truncate transition font-cyber font-bold cursor-pointer"
              >
                Col. CERT
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoSelect('ADMIN')}
                className="px-2 py-1.5 rounded-xl bg-black/50 hover:bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 text-center truncate transition font-cyber font-bold cursor-pointer"
              >
                Brig. Admin
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-2xl bg-red-950/80 border border-red-500/50 text-red-300 text-xs flex items-center gap-2.5 font-mono">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4.5 relative z-10">
            
            {/* Service ID */}
            <div>
              <label className="block text-xs font-cyber text-[#869F90] uppercase tracking-wider mb-1.5 font-bold">
                SERVICE ID / PPO / DEFENCE KIN REG NO.
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#869F90] absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={serviceId}
                  onChange={(e) => setServiceId(e.target.value)}
                  placeholder="e.g. IC-78921X or FAM-67210"
                  className="w-full bg-black/60 border border-red-500/25 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-[#F20D25] focus:ring-1 focus:ring-[#F20D25]/40 transition"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-cyber text-[#869F90] uppercase tracking-wider font-bold">
                  PASSWORD
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs text-[#F20D25] hover:underline font-cyber cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-[#869F90] absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-black/60 border border-red-500/25 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-[#F20D25] focus:ring-1 focus:ring-[#F20D25]/40 transition"
                />
              </div>
            </div>

            {/* Captcha Component */}
            <Captcha
              onChange={setCaptchaInput}
              onValidate={setIsCaptchaValid}
            />

            {/* Remember Device Checkbox */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberDevice}
                  onChange={(e) => setRememberDevice(e.target.checked)}
                  className="rounded bg-black border-red-500/40 text-[#F20D25] focus:ring-[#F20D25]/40"
                />
                <span className="font-mono text-[11px] text-[#869F90]">Remember this trusted defence terminal</span>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full bg-[#F20D25] hover:bg-[#34d399] text-black font-cyber font-bold text-sm shadow-[0_0_20px_rgba(255,38,56,0.4)] flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer uppercase tracking-wider mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  AUTHENTICATING…
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
                  SIGN IN TO CYBERSHIELD
                </>
              )}
            </button>
          </form>

          {/* Registration Link */}
          <div className="mt-6 pt-4 border-t border-red-500/15 text-center text-xs text-[#869F90] font-mono">
            First time reporting or new military family member?{' '}
            <Link to="/register" className="text-[#F20D25] font-bold hover:underline font-cyber">
              CREATE CREDENTIALS
            </Link>
          </div>
        </div>

        {/* Security Note */}
        <div className="text-center text-[10px] text-[#869F90] font-mono">
          OFFICIAL DEFENCE CYBER PLATFORM // ALL ACCESS LOGS CRYPTOGRAPHICALLY SECURED
        </div>
      </div>

      {/* Forgot Password / Recovery Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md p-6 bg-[#080D0A] border border-red-500/30 rounded-3xl shadow-2xl space-y-4">
            <h3 className="text-base font-display font-bold text-white flex items-center gap-2 uppercase">
              <KeyRound className="w-5 h-5 text-[#F20D25]" />
              Account Recovery
            </h3>
            <p className="text-xs text-[#869F90] font-sans">
              Enter your registered official email or mobile number to receive security verification instructions.
            </p>
            {recoverySent ? (
              <div className="p-3.5 rounded-2xl bg-red-950/80 border border-red-500/50 text-[#F20D25] text-xs font-mono">
                Password recovery token dispatched to your registered defence contact.
              </div>
            ) : (
              <div className="space-y-3">
                <input
                  type="text"
                  value={recoveryEmail}
                  onChange={(e) => setRecoveryEmail(e.target.value)}
                  placeholder="Service ID or gov.in Email"
                  className="w-full bg-black/60 border border-red-500/25 rounded-2xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-[#F20D25]"
                />
                <button
                  onClick={() => setRecoverySent(true)}
                  className="w-full py-2.5 rounded-full bg-[#F20D25] hover:bg-[#34d399] text-black text-xs font-cyber font-bold cursor-pointer shadow-[0_0_15px_rgba(255,38,56,0.3)]"
                >
                  DISPATCH VERIFICATION TOKEN
                </button>
              </div>
            )}
            <div className="flex justify-end pt-2">
              <button
                onClick={() => { setShowForgotModal(false); setRecoverySent(false); }}
                className="px-4 py-1.5 rounded-full bg-black/60 hover:bg-red-500/10 text-slate-300 text-xs font-mono border border-red-500/20 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
