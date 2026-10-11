import type { Config } from 'tailwindcss'

/**
 * Design tokens live in CSS variables (globals.css). Tailwind can only apply opacity modifiers
 * (`bg-teal/10`, `border-border/50`) to colors it can parse, so each token is wrapped in
 * color-mix with the `<alpha-value>` placeholder. Without this, `/NN` utilities silently emit nothing.
 */
const token = (name: string) => `color-mix(in srgb, var(--${name}) calc(<alpha-value> * 100%), transparent)`

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          0: token('bg-0'),
          1: token('bg-1'),
          2: token('bg-2'),
          3: token('bg-3'),
        },
        border: token('border'),
        'border-hi': token('border-hi'),
        teal: {
          DEFAULT: token('teal'),
          hi: token('teal-hi'),
          dim: token('teal-dim'),
        },
        amber: token('amber'),
        danger: token('danger'),
        info: token('info'),
        text: {
          1: token('text-1'),
          2: token('text-2'),
          3: token('text-3'),
        },
      },
      boxShadow: {
        focus: '0 0 0 3px var(--teal-10)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        serif: ['var(--font-serif)'],
        mono: ['var(--font-mono)'],
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      screens: {
        xs: '420px',
      },
    },
  },
  plugins: [],
} satisfies Config
