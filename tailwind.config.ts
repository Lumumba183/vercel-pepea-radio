import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        red: {
          DEFAULT: '#dc2626',
          dark: '#b91c1c',
        },
        blue: {
          DEFAULT: '#2563eb',
          dark: '#1d4ed8',
        },
        gold: {
          DEFAULT: '#f59e0b',
          dark: '#d97706',
        },
        bg: {
          DEFAULT: '#0a0e1a',
          light: '#111827',
        },
        card: {
          DEFAULT: '#1f2937',
          hover: '#27354f',
        },
        border: {
          DEFAULT: '#374151',
        },
        success: '#10b981',
        warning: '#f59e0b',
      },
      borderRadius: {
        DEFAULT: '12px',
        sm: '8px',
      },
    },
  },
  plugins: [],
}
export default config
