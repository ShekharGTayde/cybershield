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
        cyber: {
          dark:    '#0B0B0A',
          canvas:  '#F1EEE8',
          slate:   '#E5E0D8',
          card:    '#FAF8F3',
          border:  'rgba(11, 11, 10, 0.16)',
          hover:   '#E8E2DA',
          neon:    '#F04432',
          lime:    '#D92F20',
          emerald: '#F04432',
          cyan:    '#1B1B19',
          danger:  '#EF4444',
          warning: '#F59E0B',
          text:    '#0B0B0A',
          muted:   '#5F5B55',
        },
        defence: {
          dark:    '#050505',
          canvas:  '#050505',
          slate:   '#0B0809',
          card:    '#120A0C',
          border:  'rgba(255, 38, 56, 0.18)',
          hover:   '#241316',
          gold:    '#F59E0B',
          accent:  '#F20D25',
          blue:    '#F3A0A8',
          neon:    '#F20D25',
          danger:  '#EF4444',
          warning: '#F59E0B',
          text:    '#FFF7F7',
          muted:   '#B9A5A6'
        }
      },
      fontFamily: {
        sans: ['Cinzel', 'serif'],
        display: ['Cinzel', 'serif'],
        tektur: ['Cinzel', 'serif'],
        orbitron: ['Cinzel', 'serif'],
        chakra: ['Cinzel', 'serif'],
        mono: ['Cinzel', 'serif'],
      },
      fontSize: {
        '2xs': ['10px', { lineHeight: '14px', letterSpacing: '0.05em' }],
      },
      letterSpacing: {
        tight:  '-0.025em',
        tighter: '-0.04em',
        widest: '0.15em',
      },
      boxShadow: {
        'soft':    '0 2px 10px rgba(0,0,0,0.3)',
        'panel':   '0 4px 24px rgba(0,0,0,0.5)',
        'card':    '0 1px 3px rgba(0,0,0,0.4)',
        'accent':  '0 4px 20px rgba(255,38,56,0.25)',
        'card-dark': '0 10px 25px -5px rgba(0,0,0,0.6)',
        'neon-glow': '0 0 25px rgba(255,38,56,0.35)',
        'halo': '0 0 80px rgba(255,38,56,0.3)',
        'glow-cyan':    '0 4px 14px rgba(6,182,212,0.22)',
        'glow-emerald': '0 4px 16px rgba(255,38,56,0.28)',
        'glow-amber':   '0 4px 14px rgba(245,158,11,0.2)',
        'glow-red':     '0 4px 14px rgba(239,68,68,0.25)',
        'glow-purple':  '0 4px 14px rgba(168,85,247,0.2)',
        'glow-orange':  '0 4px 14px rgba(249,115,22,0.25)',
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
