// tailwind.config.mjs

/** @type {import('tailwindcss').Config} */
const tailwindConfig = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        /* Backgrounds */
        'background-main': 'var(--background-main)',
        'background-header': 'var(--background-header)',
        'background-card': 'var(--background-card)',
        'background-footer': 'var(--background-footer)',
        'background-button': 'var(--background-button)',
        'background-button-hover': 'var(--background-button-hover)',
        'background-announcement': 'var(--background-announcement)',

        /* Text */
        'text-default': 'var(--text-default)',
        'text-muted': 'var(--text-muted)',
        'text-card': 'var(--text-card)',
        'text-highlight': 'var(--text-highlight)',

        /* Buttons */
        'button-border': 'var(--button-border)',
        'button-text': 'var(--button-text)',

        /* Pagination */
        'pagination-active': 'var(--pagination-active)',
        'pagination-inactive': 'var(--pagination-inactive)',

        /* Borders */
        'border-highlight': 'var(--border-highlight)',
      },
    },
  },
  plugins: [],
};

export default tailwindConfig;