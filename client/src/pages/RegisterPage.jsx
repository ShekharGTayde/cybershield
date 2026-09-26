import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, ShieldCheck, User, Mail, Phone, Lock, Building, Award, HelpCircle, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Captcha } from '../components/common/Captcha';

export function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    serviceId: '',
    email: '',
    phone: '',
    userType: 'DEFENCE_PERSONNEL',
    organization: 'Indian Army',
    rank: '',
    password: '',
    confirmPassword: '',
    securityQuestion: "What is your regimental battalion number or first military station?",
    securityAnswer: '',
    defencePersonName: '',
    dependentRelationship: '',
    role: 'USER'
  });

  const [captchaInput, setCaptchaInput] = useState('');
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&\-_#^()])/;
    if (!passwordRegex.test(formData.password)) {
      setError('Password must contain uppercase, lowercase, a number, and a special character (e.g. @$!%*?&-_#^()).');
      return;
    }

    if (!isCaptchaValid) {
      setError('Please complete the Captcha verification.');
      return;
    }

    if (!agreedTerms) {
      setError('Please acknowledge the Official Defence Security declaration.');
      return;
    }

    setLoading(true);
    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please verify your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-8 px-4 sm:px-6">
      <div className="w-full max-w-2xl space-y-6">

        {/* Card */}
        <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative">

          <div className="text-center space-y-2 mb-6">
            <div className="inline-flex p-3 rounded-2xl bg-slate-800/90 border border-slate-700 text-sky-400 mb-1 shadow-sm">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Create CyberShield Account
            </h1>
            <p className="text-xs text-slate-400">
              Official Portal for Defence Personnel, Dependents & Veterans
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-xl bg-red-950/80 border border-red-800 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">

            {/* User Type Selector */}
            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2 font-semibold">
                Account Registration Category *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'DEFENCE_PERSONNEL', label: 'Active Personnel' },
                  { id: 'VETERAN', label: 'Veteran / ESM' },
                  { id: 'FAMILY_MEMBER', label: 'Defence Dependent' },
                  { id: 'CIVILIAN_STAFF', label: 'Civilian Staff' }
                ].map(t => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setFormData(p => ({ ...p, userType: t.id }))}
                    className={`px-3 py-2 rounded-xl text-xs font-medium border transition text-center truncate ${formData.userType === t.id
                        ? 'bg-sky-600 border-sky-500 text-white font-semibold shadow-sm'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* System Role Selector */}
            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2 font-semibold">
                System Role Authorization *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { id: 'USER', label: 'User / Reporter' },
                  { id: 'INVESTIGATOR', label: 'Investigator' },
                  { id: 'ADMIN', label: 'Administrator' }
                ].map(r => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setFormData(p => ({ ...p, role: r.id }))}
                    className={`px-3 py-2 rounded-xl text-xs font-medium border transition text-center truncate ${formData.role === r.id
                        ? 'bg-amber-600 border-amber-500 text-white font-semibold shadow-sm'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* Full Name */}
              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                  {formData.userType === 'FAMILY_MEMBER' ? "Dependent's Full Name *" : "Full Name (as in Service Records) *"}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder={formData.userType === 'FAMILY_MEMBER' ? "e.g. Sunita Devi" : "e.g. Major Vikram Rathore"}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              {/* Service ID / Registration Number */}
              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                  Service ID / PPO / Family Reg No. *
                </label>
                <div className="relative">
                  <Shield className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    name="serviceId"
                    value={formData.serviceId}
                    onChange={handleChange}
                    placeholder="e.g. IC-78921X or FAM-98210"
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              {/* Defence Person Name - Only for Family Member */}
              {formData.userType === 'FAMILY_MEMBER' && (
                <div>
                  <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                    Defence Person's Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required={formData.userType === 'FAMILY_MEMBER'}
                      name="defencePersonName"
                      value={formData.defencePersonName}
                      onChange={handleChange}
                      placeholder="e.g. Subedar Rajesh Kumar"
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>
              )}

              {/* Relationship - Only for Family Member */}
              {formData.userType === 'FAMILY_MEMBER' && (
                <div>
                  <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                    Relationship with Personnel *
                  </label>
                  <select
                    name="dependentRelationship"
                    required={formData.userType === 'FAMILY_MEMBER'}
                    value={formData.dependentRelationship}
                    onChange={handleChange}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-sky-500"
                  >
                    <option value="" disabled>Select Relationship</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Son">Son</option>
                    <option value="Daughter">Daughter</option>
                    <option value="Parent">Parent</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="official.email@gov.in or personal"
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                  Mobile Number (for SMS Alerts) *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    required
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              {/* Organization */}
              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                  Defence Branch / Unit *
                </label>
                <select
                  name="organization"
                  value={formData.organization}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-sky-500"
                >
                  <option>Indian Army</option>
                  <option>Indian Navy</option>
                  <option>Indian Air Force</option>
                  <option>Coast Guard</option>
                  <option>Defence Civilian / DRDO / OFB</option>
                  <option>Assam Rifles / CAPF</option>
                </select>
              </div>

              {/* Rank / Designation */}
              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                  Rank / Designation (Optional)
                </label>
                <input
                  type="text"
                  name="rank"
                  value={formData.rank}
                  onChange={handleChange}
                  placeholder="e.g. Major / Subedar / Dependent"
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min 8 alphanumeric chars"
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  required
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-sky-500"
                />
              </div>

            </div>

            {/* Security Question & Answer */}
            <div className="pt-2 space-y-3">
              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                  Security Recovery Question *
                </label>
                <select
                  name="securityQuestion"
                  value={formData.securityQuestion}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-sky-500"
                >
                  <option>What is your regimental battalion number or first military station?</option>
                  <option>What was the name of your first commanding officer?</option>
                  <option>What is your mother's maiden cantonment district?</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                  Security Answer *
                </label>
                <input
                  type="text"
                  required
                  name="securityAnswer"
                  value={formData.securityAnswer}
                  onChange={handleChange}
                  placeholder="Your confidential security response"
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            {/* Captcha */}
            <Captcha
              onChange={setCaptchaInput}
              onValidate={setIsCaptchaValid}
            />

            {/* Terms & Declarations */}
            <div className="pt-2">
              <label className="flex items-start gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={agreedTerms}
                  onChange={(e) => setAgreedTerms(e.target.checked)}
                  className="mt-0.5 rounded bg-slate-900 border-slate-700 text-sky-500 focus:ring-sky-500/20"
                />
                <span>
                  I declare that I am an authorized member/dependent of the Armed Forces of India. All details provided for official reporting are true and accurate.
                </span>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm shadow-sm flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              {loading ? 'Creating Defence Profile...' : 'Complete Registration & Enter Portal'}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
            Already registered?{' '}
            <Link to="/login" className="text-sky-400 font-semibold hover:underline">
              Sign In Here
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
