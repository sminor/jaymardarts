/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'background-main': 'var(--background-main)',
        'background-secondary': 'var(--background-secondary)',
        'background-announcement': 'var(--background-announcement)',
        'background-card': 'var(--background-card)',
        'background-heading': 'var(--background-heading)',
        'background-footer': 'var(--background-footer)',

        'text-default': 'var(--text-default)',
        'text-highlight': 'var(--text-highlight)',
        'text-link': 'var(--text-link)',

        'button-background': 'var(--button-background)',

        'badge-new': 'var(--badge-new)',
        'badge-today': 'var(--badge-today)',
        'badge-special': 'var(--badge-special)',

        'border-highlight': 'var(--border-highlight)',

        'select-background': 'var(--select-background)',
        'select-text': 'var(--select-text)',
        'select-border': 'var(--select-border)',
        'select-focus-outline': 'var(--select-focus-outline)',

        'past-event-text': 'var(--past-event-text)',
        'past-event-badge': 'var(--past-event-badge)',
        'past-event-background': 'var(--past-event-background)',
      },
    },
  },
  plugins: [],
};

export default config;
