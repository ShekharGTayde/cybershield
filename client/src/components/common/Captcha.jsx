import React, { useState, useEffect } from 'react';
import { RotateCw, ShieldCheck } from 'lucide-react';

export function Captcha({ onValidate, onChange }) {
  const [captchaCode, setCaptchaCode] = useState('');
  const [userInput, setUserInput] = useState('');

  const generateCaptcha = () => {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
    setUserInput('');
    if (onChange) onChange('');
    if (onValidate) onValidate(false);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleInputChange = (e) => {
    const val = e.target.value.toUpperCase();
    setUserInput(val);
    if (onChange) onChange(val);
    const isValid = val === captchaCode;
    if (onValidate) onValidate(isValid);
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-mono text-defence-muted uppercase tracking-wider">
        Security Verification (Captcha)
      </label>
      
      <div className="flex items-center gap-3">
        {/* Captcha Display Box with noise pattern */}
        <div className="relative flex items-center justify-center px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg select-none overflow-hidden h-11 w-36">
          <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:8px_8px]"></div>
          <span className="font-mono text-xl tracking-[0.3em] font-extrabold text-cyan-400 italic skew-x-[-10deg] drop-shadow">
            {captchaCode}
          </span>
          {/* Strike-through noise line */}
          <div className="absolute inset-x-2 top-1/2 h-[1px] bg-cyan-500/40 transform -rotate-6"></div>
        </div>

        <button
          type="button"
          onClick={generateCaptcha}
          className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition"
          title="Refresh Captcha"
        >
          <RotateCw className="w-4 h-4" />
        </button>

        <input
          type="text"
          maxLength={5}
          value={userInput}
          onChange={handleInputChange}
          placeholder="Enter code"
          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-cyan-500 uppercase tracking-widest"
          required
        />
      </div>
      {userInput.length === 5 && userInput === captchaCode && (
        <p className="text-xs text-emerald-400 flex items-center gap-1 font-mono">
          <ShieldCheck className="w-3.5 h-3.5" /> Verification passed
        </p>
      )}
    </div>
  );
}
