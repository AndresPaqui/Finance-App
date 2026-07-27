import { create, TwConfig } from "twrnc";

// ⚠️  NO pasamos tailwind.config.js a create():
// ese archivo contiene require('nativewind/preset') que falla silenciosamente
// en el runtime RN, dejando a twrnc sin los colores custom.
//
// Solución: importar directamente la fuente de verdad de colores y extender
// el tema base de twrnc (que ya incluye zinc, slate, white, etc.).
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { walletThemes: _walletThemes, ...neoColors } = require('../../core/theme/neoThemeColors');

const tw = create({
    theme: {
        extend: {
            colors: neoColors,
        },
    },
} as TwConfig);

export default tw;