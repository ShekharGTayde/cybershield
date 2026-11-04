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
      <label className="block text-xs font-cyber text-[#869F90] uppercase tracking-wider font-bold">
        SECURITY VERIFICATION // CAPTCHA
      </label>
      
      <div className="flex items-center gap-3">
        {/* Captcha Display Box with noise pattern */}
        <div className="relative flex items-center justify-center px-4 py-2 bg-black/80 border border-red-500/40 rounded-xl select-none overflow-hidden h-11 w-36 shadow-[0_0_15px_rgba(255,38,56,0.1)]">
          <div className="absolute inset-0 opacity-25 pointer-events-none bg-[radial-gradient(#00ff41_1px,transparent_1px)] [background-size:8px_8px]"></div>
          <span className="font-display text-xl tracking-[0.25em] font-black text-[#F20D25] italic drop-shadow-[0_0_8px_rgba(255,38,56,0.6)]">
            {captchaCode}
          </span>
          {/* Strike-through noise line */}
          <div className="absolute inset-x-2 top-1/2 h-[1px] bg-[#F20D25]/40 transform -rotate-6"></div>
        </div>

        <button
          type="button"
          onClick={generateCaptcha}
          className="p-3 bg-black/60 hover:bg-red-500/15 text-slate-300 hover:text-[#F20D25] rounded-xl border border-red-500/30 transition cursor-pointer"
          title="Refresh Captcha"
        >
          <RotateCw className="w-4 h-4" />
        </button>

        <input
          type="text"
          maxLength={5}
          value={userInput}
          onChange={handleInputChange}
          placeholder="ENTER CODE"
          className="w-full bg-black/60 border border-red-500/25 rounded-xl px-4 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-[#F20D25] focus:ring-1 focus:ring-[#F20D25]/40 uppercase tracking-widest"
          required
        />
      </div>
      {userInput.length === 5 && userInput === captchaCode && (
        <p className="text-xs text-[#F20D25] flex items-center gap-1 font-mono">
          <ShieldCheck className="w-3.5 h-3.5" /> SECURITY VERIFICATION PASSED
        </p>
      )}
    </div>
  );
}
