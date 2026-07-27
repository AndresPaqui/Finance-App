//Empaquetador, ¿Qué hace? Su trabajo es tomar los archivos ts, tsx, imagenes, configuraciones del proyecto y empaquetarlos en un archivo JS (bundle) que se inyectara en el APK de android o IPA de IOS
const { getDefaultConfig } = require('expo/metro-config');
// withNativeWind conecta el pipeline de Tailwind CSS con Metro para que
// las clases de className (NativeWind) sean procesadas en tiempo de build.
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Agregamos 'sql' a las extensiones de código fuente que Metro puede procesar
config.resolver.sourceExts.push('sql');

module.exports = withNativeWind(config, { input: './global.css' });