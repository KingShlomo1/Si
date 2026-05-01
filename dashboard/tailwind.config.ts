import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg:        'var(--bg)',
        bg2:       'var(--bg2)',
        surface:   'var(--surface)',
        surface2:  'var(--surface2)',
        surface3:  'var(--surface3)',
        border:    'var(--border)',
        purple: {
          DEFAULT: '#7c3aed',
          light:   '#8b5cf6',
          lighter: '#a78bfa',
        },
        pink: { DEFAULT: '#ec4899' },
        txt:  'var(--text)',
        txt2: 'var(--text2)',
        txt3: 'var(--text3)',
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #7c3aed, #ec4899)',
      },
      borderRadius: {
        DEFAULT: '0.75rem',
        sm: '0.5rem',
        lg: '1rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        glow: '0 0 24px rgba(124,58,237,0.3)',
        card: '0 2px 12px rgba(0,0,0,0.4)',
      },
    },
  },
  plugins: [],
};

export default config;
