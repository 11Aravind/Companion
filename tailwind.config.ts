import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        // Mobility Theme System Tokens
        navy: {
          50: '#F7F8FA',
          100: '#E8EBF0',
          200: '#D5DAE3',
          300: '#A9B4C7',
          400: '#737B89',
          500: '#4D586E',
          600: '#2E3B56',
          700: '#20242C',
          800: '#1A2949',
          900: '#14213D', // Deep Navy (Primary)
          950: '#0E172B',
        },
        charcoal: {
          DEFAULT: '#20242C', // Primary Text
          muted: '#737B89',   // Secondary Text
          border: '#E8EBF0',  // Borders
          surface: '#F7F8FA', // Background
        },
        primary: {
          DEFAULT: '#14213D', // Deep Navy
          foreground: '#FFFFFF',
          50: '#F7F8FA',
          100: '#E8EBF0',
          500: '#2583E8', // Map Accent
          600: '#14213D',
          700: '#0E172B',
        },
        secondary: {
          DEFAULT: '#FFFFFF', // White
          foreground: '#20242C',
        },
        accent: {
          DEFAULT: '#FACC15', // Mobility Yellow (Accent)
          foreground: '#14213D',
          hover: '#EAB308',
          light: '#FEFCE8',
          emerald: '#16A36A',
          teal: '#0D9488',
        },
        yellow: {
          DEFAULT: '#FACC15',
          50: '#FEFCE8',
          100: '#FEF9C3',
          200: '#FEF08A',
          300: '#FDE047',
          400: '#FACC15', // Vibrant Mobility Yellow
          500: '#EAB308', // Deep Mobility Yellow
          600: '#CA8A04',
          700: '#A16207',
          warm: '#F5A623',
        },
        map: {
          accent: '#2583E8', // Map Accent
          route: '#2583E8',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        subtle: '0 1px 3px 0 rgba(20, 33, 61, 0.04), 0 1px 2px -1px rgba(20, 33, 61, 0.04)',
        card: '0 2px 6px -1px rgba(20, 33, 61, 0.05), 0 1px 4px -1px rgba(20, 33, 61, 0.03)',
        floating: '0 12px 28px -4px rgba(20, 33, 61, 0.12), 0 4px 8px -2px rgba(20, 33, 61, 0.04)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [],
};

export default config;
