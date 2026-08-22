import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, User, Mail, Phone, Lock, Building, Award, HelpCircle, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    serviceId: '',
    email: '',
    phone: '',
    userType: 'DEFENCE_PERSONNEL',
    organization: '',
    rank: '',
    password: '',
    confirmPassword: '',
    securityQuestion: 'What is your regimental battalion number or first military station?',
    securityAnswer: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters with alphanumeric security.');
      return;
    }

    setLoading(true);
    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-10 px-4 sm:px-6 max-w-2xl mx-auto">
      <div className="glass-panel rounded-2xl p-8 border border-slate-700/80 shadow-2xl">
        
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex p-3 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 mb-1 shadow-glow-cyan">
            <Shield className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-wide">
            Defence Cyber Registration
          </h1>
          <p className="text-xs text-defence-muted font-mono">
            Official Portal for Defence Personnel, Dependents & Veterans (SRD §7.1)
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-red-950/80 border border-red-800 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* User Type Selector */}
          <div>
            <label className="block text-xs font-mono text-cyan-400 uppercase tracking-wider mb-2 font-semibold">
              Select User Category (userType)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                { id: 'DEFENCE_PERSONNEL', label: 'Defence Personnel', desc: 'Serving Army/Navy/Air Force' },
                { id: 'VETERAN', label: 'Ex-Serviceman / Veteran', desc: 'Retired Armed Forces' },
                { id: 'FAMILY_MEMBER', label: 'Family Member', desc: 'Dependents / Spouse' }
              ].map(cat => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setFormData(prev => ({ ...prev, userType: cat.id }))}
                  className={`p-3 rounded-xl text-left border transition-all ${
                    formData.userType === cat.id
                      ? 'bg-cyan-950/80 border-cyan-500 text-white shadow-glow-cyan'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <p className="text-xs font-bold">{cat.label}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{cat.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Full Name */}
            <div>
              <label className="block text-xs font-mono text-defence-muted uppercase tracking-wider mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                required
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="e.g. Maj. Ananya Roy"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Service ID */}
            <div>
              <label className="block text-xs font-mono text-defence-muted uppercase tracking-wider mb-1.5">
                Service ID / PPO / Army No. *
              </label>
              <input
                type="text"
                required
                name="serviceId"
                value={formData.serviceId}
                onChange={handleChange}
                placeholder="e.g. IC-90214K or PPO-88219"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-cyan-500 uppercase"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-mono text-defence-muted uppercase tracking-wider mb-1.5">
                Email Address *
              </label>
              <input
                type="email"
                required
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="ananya.roy@defence.gov.in"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-mono text-defence-muted uppercase tracking-wider mb-1.5">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Organization / Formation */}
            <div>
              <label className="block text-xs font-mono text-defence-muted uppercase tracking-wider mb-1.5">
                Organization / Regiment / Unit *
              </label>
              <input
                type="text"
                required
                name="organization"
                value={formData.organization}
                onChange={handleChange}
                placeholder="e.g. Corps of Signals / Southern Command"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Rank / Designation */}
            <div>
              <label className="block text-xs font-mono text-defence-muted uppercase tracking-wider mb-1.5">
                Rank / Relation *
              </label>
              <input
                type="text"
                required
                name="rank"
                value={formData.rank}
                onChange={handleChange}
                placeholder="e.g. Captain / Subedar / Dependent"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-mono text-defence-muted uppercase tracking-wider mb-1.5">
                Password *
              </label>
              <input
                type="password"
                required
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••••••"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-mono text-defence-muted uppercase tracking-wider mb-1.5">
                Confirm Password *
              </label>
              <input
                type="password"
                required
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••••••"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

          </div>

          {/* Security Question & Answer (SRD Section 7.1) */}
          <div className="pt-2 space-y-3">
            <div>
              <label className="block text-xs font-mono text-defence-muted uppercase tracking-wider mb-1.5">
                Security Recovery Question *
              </label>
              <select
                name="securityQuestion"
                value={formData.securityQuestion}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
              >
                <option>What is your regimental battalion number or first military station?</option>
                <option>What was the name of your first commanding officer?</option>
                <option>What is your mother's maiden cantonment district?</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-defence-muted uppercase tracking-wider mb-1.5">
                Security Answer *
              </label>
              <input
                type="text"
                required
                name="securityAnswer"
                value={formData.securityAnswer}
                onChange={handleChange}
                placeholder="Your confidential security response"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-sm shadow-glow-cyan flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            {loading ? 'Creating Defence Profile...' : 'Complete Registration & Enter Portal'}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
          Already registered?{' '}
          <Link to="/login" className="text-cyan-400 font-semibold hover:underline">
            Sign In Here
          </Link>
        </div>

      </div>
    </div>
  );
}
