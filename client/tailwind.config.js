/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        defence: {
          dark:    '#0B0D14',
          canvas:  '#0B0D14',
          slate:   '#0F1220',
          card:    '#111420',
          border:  '#1A1E35',
          hover:   '#1A1E35',
          gold:    '#F59E0B',
          accent:  '#E05C1A',   /* saffron-orange */
          blue:    '#2563EB',
          neon:    '#10B981',
          danger:  '#DC2626',
          warning: '#D97706',
          text:    '#F0F2F8',
          muted:   '#8891AA'
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        mono: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['10px', { lineHeight: '14px', letterSpacing: '0.05em' }],
      },
      letterSpacing: {
        tight:  '-0.025em',
        tighter: '-0.04em',
      },
      boxShadow: {
        'soft':    '0 2px 10px rgba(0,0,0,0.25)',
        'panel':   '0 4px 24px rgba(0,0,0,0.4)',
        'card':    '0 1px 3px rgba(0,0,0,0.3)',
        'accent':  '0 4px 16px rgba(224,92,26,0.2)',
        'card-dark': '0 10px 25px -5px rgba(0,0,0,0.5)',
        /* keep glow helpers so old classnames still compile */
        'glow-cyan':    '0 4px 14px rgba(56,189,248,0.18)',
        'glow-emerald': '0 4px 14px rgba(16,185,129,0.18)',
        'glow-amber':   '0 4px 14px rgba(245,158,11,0.18)',
        'glow-red':     '0 4px 14px rgba(220,38,38,0.18)',
        'glow-purple':  '0 4px 14px rgba(168,85,247,0.18)',
        'glow-orange':  '0 4px 14px rgba(224,92,26,0.25)',
      },
      backgroundImage: {
        'india-dots': "radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)",
      },
      animation: {
        'pulse-slow':   'pulse 4s cubic-bezier(0.4,0,0.6,1) infinite',
        'radar-sweep':  'radarSweep 4s linear infinite',
        'marquee':      'marquee 32s linear infinite',
        'fadeIn':       'fadeIn 0.22s ease forwards',
      },
      keyframes: {
        radarSweep: {
          '0%':   { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        },
        marquee: {
          from: { transform: 'translateX(100vw)' },
          to:   { transform: 'translateX(-100%)' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      }
    },
  },
  plugins: [],
}
