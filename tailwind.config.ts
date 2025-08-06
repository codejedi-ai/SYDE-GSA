import type { Config } from "tailwindcss"

const config: Config = {
  content: ["./pages/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./app/**/*.{js,ts,jsx,tsx,mdx}", "*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        'cyber-blue': '#00ffff',
        'cyber-pink': '#ff00ff',
        'cyber-light': '#00ffff',
        'cyber-dark': '#0a0a0a',
      },
      fontFamily: {
        'cyber': ['Orbitron', 'monospace'],
        'inter': ['Inter', 'sans-serif'],
      },
      animation: {
        'pulse-neon': 'pulse-neon 2s ease-in-out infinite alternate',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        'pulse-neon': {
          '0%': {
            textShadow: '0 0 5px #00ffff, 0 0 10px #00ffff, 0 0 15px #00ffff, 0 0 20px #00ffff',
          },
          '100%': {
            textShadow: '0 0 2px #00ffff, 0 0 5px #00ffff, 0 0 8px #00ffff, 0 0 12px #00ffff',
          },
        },
        'glow': {
          '0%': {
            boxShadow: '0 0 5px #00ffff, 0 0 10px #00ffff, inset 0 0 5px #00ffff',
          },
          '100%': {
            boxShadow: '0 0 10px #00ffff, 0 0 20px #00ffff, inset 0 0 10px #00ffff',
          },
        },
      },
    },
  },
  plugins: [],
}

export default config
