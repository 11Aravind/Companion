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
      fontFamily: {
        sans: [
          '"Uber Move"',
          '"UberMoveText"',
          'system-ui',
          '-apple-system',
          '"Segoe UI"',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
        uber: [
          '"Uber Move"',
          '"UberMoveText"',
          'system-ui',
          '-apple-system',
          '"Segoe UI"',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        // Uber Black & White Palette
        uber: {
          black: '#000000',
          white: '#FFFFFF',
          gray: {
            50: '#F6F6F6',
            100: '#EEEEEE',
            200: '#E2E2E2',
            300: '#CBCBCB',
            400: '#AFAFAF',
            500: '#757575',
            600: '#5E5E5E',
            700: '#333333',
            800: '#1F1F1F',
            900: '#000000',
          },
        },
        navy: {
          50: '#F6F6F6',
          100: '#EEEEEE',
          200: '#E2E2E2',
          300: '#CBCBCB',
          400: '#757575',
          500: '#5E5E5E',
          600: '#333333',
          700: '#1F1F1F',
          800: '#121212',
          900: '#000000', // Jet Black
          950: '#000000',
        },
        charcoal: {
          DEFAULT: '#000000', // Black
          muted: '#5E5E5E',   // Secondary Grey
          border: '#EEEEEE',  // Light Grey Border
          surface: '#F6F6F6', // Uber Grey Background
        },
        primary: {
          DEFAULT: '#000000', // Jet Black
          foreground: '#FFFFFF',
          50: '#F6F6F6',
          100: '#EEEEEE',
          500: '#000000',
          600: '#000000',
          700: '#000000',
        },
        secondary: {
          DEFAULT: '#F6F6F6',
          foreground: '#000000',
        },
        accent: {
          DEFAULT: '#000000',
          foreground: '#FFFFFF',
          hover: '#333333',
          light: '#F6F6F6',
          emerald: '#16A36A',
          teal: '#0D9488',
        },
        yellow: {
          DEFAULT: '#000000',
          50: '#F6F6F6',
          100: '#EEEEEE',
          200: '#E2E2E2',
          300: '#CBCBCB',
          400: '#000000',
          500: '#000000',
          600: '#000000',
          700: '#000000',
          warm: '#000000',
        },
        map: {
          accent: '#000000',
          route: '#000000',
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
