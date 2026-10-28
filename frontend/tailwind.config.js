/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Required exact palette
        forest: {
          50: '#F2F7F4',
          100: '#E2ECE7',
          200: '#C5D9CF',
          300: '#9DBEB0',
          400: '#5F9983',
          500: '#2A7257',
          600: '#1E6149',
          700: '#1A5641',
          800: '#174D3A', // Primary Deep Forest Green
          900: '#103729',
          950: '#092119',
          DEFAULT: '#174D3A',
        },
        sage: {
          50: '#F7FAF7',
          100: '#E8EFE9', // Secondary Muted Sage
          200: '#D6E2D8',
          300: '#B9CCC0',
          400: '#93AE9D',
          DEFAULT: '#E8EFE9',
        },
        warm: {
          bg: '#FAF9F6', // Main Warm Off-White
          card: '#FFFFFF',
          border: '#E4E7E2', // Subtle Neutral Gray
          hover: '#F3F2EE',
          muted: '#F5F4F0',
        },
        charcoal: {
          DEFAULT: '#202824', // Primary Text
          muted: '#707873',   // Secondary Muted Gray
          subtle: '#949E97',
        },
        amber: {
          50: '#FDFBF5',
          100: '#FBF5E8',
          200: '#F7E9CE',
          300: '#F0D59D',
          400: '#E6B566', // Accent Soft Amber
          500: '#DDA03D',
          600: '#B87E25',
          DEFAULT: '#E6B566',
        },
        // Semantic aliases for smooth transition & consistency
        primary: {
          DEFAULT: '#174D3A',
          hover: '#133F30',
          light: '#E8EFE9',
        },
        surface: {
          bg: '#FAF9F6',
          card: '#FFFFFF',
          border: '#E4E7E2',
          hover: '#F3F2EE',
        },
        status: {
          available: '#174D3A',
          'available-bg': '#E8EFE9',
          occupied: '#707873',
          'occupied-bg': '#EBECE9',
        },
      },
      fontFamily: {
        sans: [
          'Manrope',
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
        subtle: '0 1px 2px 0 rgba(32, 40, 36, 0.04)',
        card: '0 1px 3px 0 rgba(32, 40, 36, 0.06), 0 1px 2px -1px rgba(32, 40, 36, 0.04)',
        elevated: '0 4px 12px -2px rgba(32, 40, 36, 0.08), 0 2px 4px -2px rgba(32, 40, 36, 0.04)',
      },
    },
  },
  plugins: [],
}
