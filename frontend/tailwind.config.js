/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#F0F5FA',
          100: '#E1ECF4',
          200: '#BDD5E7',
          300: '#94BCDA',
          600: '#1E527B',
          700: '#164265',
          800: '#123653', // Primary navy
          900: '#0B2540', // Deep navy
          DEFAULT: '#123653',
        },
        teal: {
          50: '#F0FAF9',
          100: '#E6F5F4',
          200: '#C2E7E4',
          300: '#8FD4CF',
          500: '#0AA699',
          600: '#078F83', // Primary teal
          700: '#067568', // Dark teal
          800: '#055D53',
          900: '#04423B',
          DEFAULT: '#078F83',
        },
        charcoal: {
          DEFAULT: '#172B42', // Primary text
          muted: '#64748B',   // Secondary text
          subtle: '#94A3B8',
        },
        surface: {
          bg: '#F7F9FC',     // Background
          card: '#FFFFFF',   // Surface
          border: '#DFE7EF', // Border
          hover: '#F1F5F9',
        },
        status: {
          available: '#0D9876', // Available status
          'available-bg': '#E6F7F2',
          occupied: '#6675A8',  // Occupied status
          'occupied-bg': '#F0F2FA',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
      },
      borderRadius: {
        DEFAULT: '0.375rem',
        sm: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
      },
      boxShadow: {
        subtle: '0 1px 2px 0 rgba(18, 54, 83, 0.05)',
        card: '0 1px 3px 0 rgba(18, 54, 83, 0.08), 0 1px 2px -1px rgba(18, 54, 83, 0.04)',
        elevated: '0 4px 6px -1px rgba(18, 54, 83, 0.08), 0 2px 4px -2px rgba(18, 54, 83, 0.04)',
      },
    },
  },
  plugins: [],
}
