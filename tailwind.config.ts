import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    // 🎯 MOBILE-FIRST BREAKPOINTS
    screens: {
      'xs': '375px',     // Small phones
      'sm': '640px',     // Large phones  
      'md': '768px',     // Tablets
      'lg': '1024px',    // Laptops
      'xl': '1280px',    // Desktops
      '2xl': '1536px',   // Large desktops
      
      // 🎯 DEVICE-SPECIFIC BREAKPOINTS
      'mobile': { 'max': '767px' },
      'tablet': { 'min': '768px', 'max': '1023px' },
      'desktop': { 'min': '1024px' },
      'tall': { 'raw': '(min-height: 800px)' },
      'short': { 'raw': '(max-height: 700px)' },
      'landscape': { 'raw': '(orientation: landscape)' },
      'portrait': { 'raw': '(orientation: portrait)' },
      'standalone': { 'raw': '(display-mode: standalone)' },
      'pwa': { 'raw': '(display-mode: standalone)' },
    },

    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        xs: '1rem',
        sm: '1.5rem',
        md: '2rem',
        lg: '3rem',
        xl: '4rem',
      },
      screens: {
        xs: '100%',
        sm: '100%', 
        md: '100%',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1400px'
      }
    },

    extend: {
      // 🎯 PRESERVE EXISTING COLORS - From original config
      colors: {
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16'
        },
      },
      
      fontFamily: {
        'sans': ['Quicksand', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'],
      },
      
      fontSize: {
        'touch': ['1.125rem', { lineHeight: '1.75rem' }],
        'mobile-h1': ['1.75rem', { lineHeight: '2.25rem' }],
        'mobile-h2': ['1.5rem', { lineHeight: '2rem' }],
        'mobile-h3': ['1.25rem', { lineHeight: '1.75rem' }],
      },

      // 🎯 MOBILE-OPTIMIZED SPACING
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)', 
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
        'touch': '44px',
        'touch-sm': '40px',
        'touch-lg': '48px',
        'header': '56px',
        'toolbar': '48px',
        'fab': '56px',
        'tab': '48px',
      },

      // 🎯 MODERN VIEWPORT UNITS
      height: {
        'dvh': '100dvh',
        'svh': '100svh', 
        'lvh': '100lvh',
        'screen-safe': 'calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom))',
      },

      minHeight: {
        'dvh': '100dvh',
        'svh': '100svh',
        'lvh': '100lvh', 
        'touch': '44px',
        'screen-safe': 'calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom))',
      },

      maxHeight: {
        'dvh': '100dvh',
        'svh': '100svh',
        'lvh': '100lvh',
      },

      width: {
        'dvw': '100dvw',
        'touch': '44px',
      },

      // 🎯 MOBILE-OPTIMIZED DESIGN TOKENS
      borderRadius: {
        'mobile': '12px',
        'card': '16px', 
        'sheet': '20px',
        'fab': '28px',
        'pill': '9999px',
      },

      boxShadow: {
        'mobile': '0 2px 8px rgba(0, 0, 0, 0.1)',
        'card': '0 4px 16px rgba(0, 0, 0, 0.1)',
        'floating': '0 8px 24px rgba(0, 0, 0, 0.15)',
        'sheet': '0 -2px 16px rgba(0, 0, 0, 0.1)',
        'fab': '0 4px 12px rgba(34, 197, 94, 0.3)',
      },

      backdropBlur: {
        'mobile': '8px',
        'sheet': '16px',
      },

      // 🎯 MOBILE ANIMATIONS
      keyframes: {
        'slide-up': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'bounce-gentle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        'shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-4px)' },
          '75%': { transform: 'translateX(4px)' },
        },
      },

      animation: {
        'slide-up': 'slide-up 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-down': 'slide-down 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        'fade-in': 'fade-in 0.3s ease-in-out',
        'bounce-gentle': 'bounce-gentle 1s ease-in-out infinite',
        'shake': 'shake 0.5s ease-in-out',
      },

      transitionTimingFunction: {
        'mobile': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'ease-ios': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },

      zIndex: {
        'dropdown': '1000',
        'sticky': '1020', 
        'fixed': '1030',
        'modal-backdrop': '1040',
        'modal': '1050',
        'popover': '1060',
        'tooltip': '1070',
        'toast': '1080',
        'fab': '1090',
      },
    }
  },
  
  plugins: [
    // PWA Custom Utilities
    function({ addUtilities }: any) {
      addUtilities({
        '.safe-top': { paddingTop: 'env(safe-area-inset-top)' },
        '.safe-bottom': { paddingBottom: 'env(safe-area-inset-bottom)' },
        '.safe-left': { paddingLeft: 'env(safe-area-inset-left)' },
        '.safe-right': { paddingRight: 'env(safe-area-inset-right)' },
        '.safe-x': { 
          paddingLeft: 'env(safe-area-inset-left)',
          paddingRight: 'env(safe-area-inset-right)' 
        },
        '.safe-y': { 
          paddingTop: 'env(safe-area-inset-top)',
          paddingBottom: 'env(safe-area-inset-bottom)' 
        },
        '.safe-all': { 
          padding: 'env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)' 
        },
        '.touch-manipulation': { touchAction: 'manipulation' },
        '.touch-none': { touchAction: 'none' },
        '.touch-pan-x': { touchAction: 'pan-x' },
        '.touch-pan-y': { touchAction: 'pan-y' },
        '.scroll-smooth-mobile': { 
          scrollBehavior: 'smooth',
          '-webkit-overflow-scrolling': 'touch' 
        },
        '.overscroll-none': { overscrollBehavior: 'none' },
        '.overscroll-contain': { overscrollBehavior: 'contain' },
        '.ios-bounce-disable': { 
          '-webkit-overflow-scrolling': 'auto',
          overscrollBehavior: 'none' 
        },
        '.select-none-mobile': { 
          '-webkit-user-select': 'none',
          'user-select': 'none',
          '-webkit-touch-callout': 'none' 
        },
        '.gpu': { 
          transform: 'translateZ(0)',
          willChange: 'transform' 
        },
      })
    },
  ],
} satisfies Config;