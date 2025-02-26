/** @type {import('tailwindcss').Config} */
module.exports = {
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
        'background-footer': 'var(--background-footer)',
        'background-card': 'var(--background-card)',
        'background-heading': 'var(--background-heading)',
        'background-announcement': 'var(--background-announcement)',
        'text-default': 'var(--text-default)',
        'text-highlight': 'var(--text-highlight)',
        'button-background': 'var(--button-background)',
        'text-link': 'var(--text-link)',
        'badge-new': 'var(--badge-new)',
        'border-highlight': 'var(--border-highlight)',
      },
    },
  },
  plugins: [],
}
