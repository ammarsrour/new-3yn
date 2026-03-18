/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand colors - Navy (primary)
        navy: {
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9fb3c8',
          400: '#829ab1',
          500: '#627d98',
          600: '#486581',
          700: '#334e68',
          800: '#243b53',
          900: '#102a43',
          950: '#0f2942',
        },
        // Semantic colors
        success: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',  // Primary emerald
          600: '#059669',
          700: '#047857',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',  // Amber
          600: '#d97706',
          700: '#b45309',
        },
        danger: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',  // Red
          600: '#dc2626',
          700: '#b91c1c',
        },
        info: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',  // Blue
          600: '#2563eb',
          700: '#1d4ed8',
        },
        // Gold accent
        gold: {
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
        },
        // Warm surface colors (navy-tinted)
        surface: {
          50: '#f8fafc',   // Very light navy tint
          100: '#f1f5f9',  // Light surface
          200: '#e2e8f0',  // Border/divider
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', '-apple-system', 'sans-serif'],
        arabic: ['Cairo', 'Tajawal', 'Amiri', 'sans-serif'],
      },
      fontSize: {
        // Type scale: 1.25 ratio (Major Third)
        // Fixed rem for UI consistency
        'xs': ['0.75rem', { lineHeight: '1.5' }],      // 12px - captions, legal
        'sm': ['0.875rem', { lineHeight: '1.5' }],    // 14px - secondary UI
        'base': ['1rem', { lineHeight: '1.6' }],      // 16px - body
        'lg': ['1.125rem', { lineHeight: '1.5' }],    // 18px - lead text
        'xl': ['1.25rem', { lineHeight: '1.4' }],     // 20px - subheadings
        '2xl': ['1.5rem', { lineHeight: '1.35' }],    // 24px - section heads
        '3xl': ['1.875rem', { lineHeight: '1.25' }],  // 30px - page heads
        '4xl': ['2.25rem', { lineHeight: '1.2' }],    // 36px - display
        '5xl': ['3rem', { lineHeight: '1.1' }],       // 48px - hero
        '6xl': ['3.75rem', { lineHeight: '1.05' }],   // 60px - hero lg
        '7xl': ['4.5rem', { lineHeight: '1' }],       // 72px - hero xl
        '8xl': ['6rem', { lineHeight: '0.95' }],      // 96px - display xl
      },
      letterSpacing: {
        tighter: '-0.03em',
        tight: '-0.02em',
        normal: '0',
        wide: '0.02em',
        wider: '0.05em',
        widest: '0.1em',
        caps: '0.15em',  // For uppercase labels
      },
      lineHeight: {
        none: '1',
        tight: '1.1',
        snug: '1.25',
        normal: '1.5',
        relaxed: '1.6',
        loose: '1.75',
      },
    },
  },
  plugins: [],
};
