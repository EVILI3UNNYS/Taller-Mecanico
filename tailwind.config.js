/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // --- AÑADIMOS ESTO PARA EL EFECTO NEÓN ---
      boxShadow: {
        'neon-cyan': '0 0 5px #22d3ee, 0 0 20px #22d3ee',
        'neon-inset': 'inset 0 0 10px #22d3ee',
      }
    },
  },
  plugins: [],
}