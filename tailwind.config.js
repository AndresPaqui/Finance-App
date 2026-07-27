// Importamos la paleta NeoTheme desde la fuente única de verdad.
// Destructuramos walletThemes para que Tailwind solo reciba colores planos (strings hex)
// y no intente generar clases a partir del objeto de degradados anidados.
const { walletThemes: _walletThemes, ...neoColors } = require('./src/core/theme/neoThemeColors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  // Le dice a Tailwind qué archivos revisar para aplicar los estilos
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  // Preset de NativeWind: habilita las utilidades de React Native
  // (flex, absolute, etc.) y el procesamiento de CSS via global.css
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: neoColors,
    },
  },
  plugins: [],
}