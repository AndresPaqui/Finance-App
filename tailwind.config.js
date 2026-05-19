/** @type {import('tailwindcss').Config} */
module.exports = {
  // Le dice a Tailwind qué archivos revisar para aplicar los estilos
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primaryBlue: '#3B82F6',
        successMint: '#10B981',
        warningOrange: '#F59E0B',

        background: '#0F172A',
        card: '#1E293B',
        border: '#334155',

        textPrimary: '#F8FAFC',
        textSecondary: '#94A3B8',
        errorRed: '#EF4444',
      },
    },
  },
  plugins: [],
}