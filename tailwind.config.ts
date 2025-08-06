import type { Config } from "tailwindcss"

const config: Config = {
  content: ["./pages/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./app/**/*.{js,ts,jsx,tsx,mdx}", "*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Cyberpunk colors
        'cyber-dark': '#050714',
        'cyber-blue': '#00ffff',
        'cyber-light': '#66ffff',
        'cyber-pink': '#ff0080',
        'cyber-purple': '#8b59fb',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        'cyber': ['Cyberpunk', 'Courier New', 'monospace'],
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'glitch': 'glitch-animation 3s infinite linear alternate-reverse',
        'scanline': 'scanline 8s linear infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': {
            boxShadow: '0 0 5px #00ffff',
          },
          '50%': {
            boxShadow: '0 0 20px #00ffff, 0 0 30px #00ffff',
          },
        },
        'glitch-animation': {
          '0%': { clipPath: 'inset(29% 0 25% 0)' },
          '5%': { clipPath: 'inset(9% 0 38% 0)' },
          '10%': { clipPath: 'inset(96% 0 1% 0)' },
          '15%': { clipPath: 'inset(75% 0 23% 0)' },
          '20%': { clipPath: 'inset(46% 0 50% 0)' },
          '25%': { clipPath: 'inset(3% 0 46% 0)' },
          '30%': { clipPath: 'inset(82% 0 2% 0)' },
          '35%': { clipPath: 'inset(88% 0 1% 0)' },
          '40%': { clipPath: 'inset(15% 0 79% 0)' },
          '45%': { clipPath: 'inset(40% 0 22% 0)' },
          '50%': { clipPath: 'inset(37% 0 30% 0)' },
          '55%': { clipPath: 'inset(73% 0 5% 0)' },
          '60%': { clipPath: 'inset(59% 0 38% 0)' },
          '65%': { clipPath: 'inset(48% 0 35% 0)' },
          '70%': { clipPath: 'inset(67% 0 18% 0)' },
          '75%': { clipPath: 'inset(9% 0 71% 0)' },
          '80%': { clipPath: 'inset(25% 0 57% 0)' },
          '85%': { clipPath: 'inset(75% 0 18% 0)' },
          '90%': { clipPath: 'inset(56% 0 43% 0)' },
          '95%': { clipPath: 'inset(5% 0 29% 0)' },
          '100%': { clipPath: 'inset(57% 0 21% 0)' },
        },
        'scanline': {
          '0%': { transform: 'translateY(-4px)' },
          '100%': { transform: 'translateY(calc(100vh - 4px))' },
        },
      },
    },
  },
  plugins: [],
}

export default config
