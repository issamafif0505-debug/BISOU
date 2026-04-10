import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/collections/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
    './src/seed/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '1100px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        gold: {
          DEFAULT: '#D4AF37',
          light: '#F5E6A3',
          mid: '#C9A84C',
          dark: '#A8862E',
        },
        black: {
          DEFAULT: '#0D0D0D',
          soft: '#1A1A1A',
        },
        card: '#111111',
        cream: '#FDF6E3',
        rose: '#F2D7D5',
        whatsapp: '#25D366',
        grey: '#AAAAAA',
        status: {
          green: '#2ECC71',
          red: '#E74C3C',
          orange: '#F39C12',
          blue: '#3498DB',
        },
      },
      fontFamily: {
        serif: ['var(--font-cormorant)', 'Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['var(--font-jost)', 'Jost', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display': ['clamp(2.5rem, 6vw, 5rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'hero': ['clamp(2rem, 4.5vw, 3.5rem)', { lineHeight: '1.15', letterSpacing: '-0.015em' }],
        'h1': ['clamp(1.75rem, 3.5vw, 2.75rem)', { lineHeight: '1.2' }],
        'h2': ['clamp(1.5rem, 2.8vw, 2.25rem)', { lineHeight: '1.25' }],
        'h3': ['clamp(1.25rem, 2.2vw, 1.75rem)', { lineHeight: '1.3' }],
      },
      borderRadius: {
        DEFAULT: '12px',
        sm: '8px',
        lg: '20px',
        xl: '28px',
      },
      boxShadow: {
        'gold-glow': '0 0 32px rgba(212, 175, 55, 0.25)',
        'gold-glow-lg': '0 0 48px rgba(212, 175, 55, 0.35)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.4)',
        'card-hover': '0 8px 32px rgba(212, 175, 55, 0.18)',
      },
      transitionTimingFunction: {
        bisou: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      transitionDuration: {
        bisou: '300ms',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #D4AF37 0%, #F5E6A3 50%, #A8862E 100%)',
        'dark-radial': 'radial-gradient(circle at 50% 0%, #1A1A1A 0%, #0D0D0D 60%)',
      },
      maxWidth: {
        'content': '1200px',
        'prose-fr': '68ch',
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '1.5rem',
          lg: '2rem',
        },
      },
    },
  },
  plugins: [require('tailwindcss-rtl')],
};

export default config;
