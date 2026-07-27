// Importamos los colores desde la fuente única de verdad (CommonJS)
// para que tanto tailwind.config.js como este archivo compartan exactamente
// los mismos valores sin duplicación.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const {
    walletThemes: _walletThemes,
    ...rawColors
} = require('./neoThemeColors') as {
    walletThemes: Record<string, { gradient: [string, string]; accent: string; icon: string }>;
    primaryBlue:   string;
    successMint:   string;
    warningOrange: string;
    background:    string;
    card:          string;
    border:        string;
    textPrimary:   string;
    textSecondary: string;
    errorRed:      string;
};

// eslint-disable-next-line @typescript-eslint/no-require-imports
const _wt = require('./neoThemeColors').walletThemes as Record<
    'OCEAN' | 'FOREST' | 'SUNSET' | 'CRIMSON' | 'NEBULA' | 'STEEL',
    { gradient: [string, string]; accent: string; icon: string }
>;

export const NeoTheme = {
    colors: rawColors,
    walletThemes: _wt,
} as const;

export type AppColors      = typeof rawColors;
export type WalletThemeKey = 'OCEAN' | 'FOREST' | 'SUNSET' | 'CRIMSON' | 'NEBULA' | 'STEEL';
export type WalletTheme    = { gradient: [string, string]; accent: string; icon: string };