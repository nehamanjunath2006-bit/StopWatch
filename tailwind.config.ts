import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['selector', 'body.dark'],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      boxShadow: {
        glass: '0 20px 120px rgba(15, 23, 42, 0.12)',
        soft: '0 18px 80px rgba(15, 23, 42, 0.12)'
      },
      colors: {
        surface: {
          950: '#070b14',
          900: '#0f172a',
          850: '#111827',
          800: '#1f2937'
        }
      },
      backgroundImage: {
        hero: 'radial-gradient(circle at top, rgba(56, 189, 248, 0.12), transparent 30%), radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.09), transparent 20%)'
      }
    }
  },
  plugins: []
};

export default config;
