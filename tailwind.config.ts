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
        brand: {
          DEFAULT: token('brand'),
          hi: token('brand-hi'),
          dim: token('brand-dim'),
        },
        // legacy alias: `teal` resolves to the brand color
        teal: {
          DEFAULT: token('brand'),
          hi: token('brand-hi'),
          dim: token('brand-dim'),
        },
        'on-brand': token('on-brand'),
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
        focus: '0 0 0 3px var(--brand-20)',
        sm: 'var(--shadow-sm)',
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
        display: ['var(--font-display)'],
        serif: ['var(--font-display)'],
        mono: ['var(--font-sans)'],
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
