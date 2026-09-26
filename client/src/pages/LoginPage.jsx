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
    <div className="min-h-[80vh] flex items-center justify-center py-10 px-4 sm:px-6">
      <div className="w-full max-w-md space-y-6">
        
        {/* Card */}
        <div className="glass-panel rounded-2xl p-8 border border-slate-800 shadow-2xl relative">
          
          <div className="text-center space-y-2 mb-6">
            <div className="inline-flex p-3 rounded-2xl bg-slate-800/90 border border-slate-700 text-sky-400 mb-1 shadow-sm">
              <Shield className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Defence Cyber Portal Login
            </h1>
            <p className="text-xs text-slate-400">
              Authorized access for Defence Personnel, Veterans & Families
            </p>
          </div>

          {/* Quick Demo Selector Chips */}
          <div className="mb-6 p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <p className="text-[10px] font-mono text-slate-400 font-semibold uppercase tracking-wider">
              Quick Test Profiles:
            </p>
            <div className="grid grid-cols-3 gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => handleQuickDemoSelect('USER')}
                className="px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-center truncate transition"
              >
                Maj. Vikram
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoSelect('INVESTIGATOR')}
                className="px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 text-center truncate transition"
              >
                Col. CERT
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoSelect('ADMIN')}
                className="px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-purple-300 border border-slate-700 text-center truncate transition"
              >
                Brig. Admin
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-950/70 border border-red-800 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            
            {/* Service ID */}
            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                Service ID / PPO / Family Reg No.
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={serviceId}
                  onChange={(e) => setServiceId(e.target.value)}
                  placeholder="e.g. IC-78921X or FAM-67210"
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs text-sky-400 hover:text-sky-300 underline font-sans"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-sky-500"
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
              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberDevice}
                  onChange={(e) => setRememberDevice(e.target.checked)}
                  className="rounded bg-slate-900 border-slate-700 text-sky-500 focus:ring-sky-500/20"
                />
                <span>Remember this secure device</span>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm shadow-sm flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Authenticating...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  Sign In to CyberShield
                </>
              )}
            </button>
          </form>

          {/* Registration Link */}
          <div className="mt-6 pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
            First time reporting or new family member?{' '}
            <Link to="/register" className="text-sky-400 font-semibold hover:underline">
              Create an Account
            </Link>
          </div>
        </div>

        {/* Security Note */}
        <div className="text-center text-[11px] text-slate-500">
          Official Government & Defence Cyber Infrastructure. All unauthorized access attempts are logged.
        </div>
      </div>

      {/* Forgot Password / Recovery Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-sky-400" />
              Account Recovery
            </h3>
            <p className="text-xs text-slate-300">
              Enter your registered official email or mobile number to receive security verification instructions.
            </p>
            {recoverySent ? (
              <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs">
                Password recovery token dispatched to your registered defence contact.
              </div>
            ) : (
              <div className="space-y-3">
                <input
                  type="text"
                  value={recoveryEmail}
                  onChange={(e) => setRecoveryEmail(e.target.value)}
                  placeholder="Service ID or gov.in Email"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-sky-500"
                />
                <button
                  onClick={() => setRecoverySent(true)}
                  className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold"
                >
                  Send Verification Token
                </button>
              </div>
            )}
            <div className="flex justify-end pt-2">
              <button
                onClick={() => { setShowForgotModal(false); setRecoverySent(false); }}
                className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
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
