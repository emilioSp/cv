/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.njk', './src/**/*.html', './src/**/*.js'],
  theme: {
    extend: {
      colors: {
        accent: 'var(--accent)',
      },
      fontFamily: {
        // Overrides Tailwind's mono stack — use `font-mono` in templates for JetBrains Mono
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};
