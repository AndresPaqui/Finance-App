// src/core/theme/neoThemeColors.js
// ─────────────────────────────────────────────────────────
// FUENTE ÚNICA DE VERDAD para la paleta NeoTheme.
// Exportado en CommonJS para que tailwind.config.js pueda
// hacer require() directamente sin necesitar TypeScript.
// colors.ts importa este mismo objeto y añade el tipado.
// ─────────────────────────────────────────────────────────
module.exports = {
    // Colores Principales
    primaryBlue:   '#3B82F6',   // Botones, CTA, Entrada de Voz
    successMint:   '#10B981',   // Ingresos, Ahorros, Metas
    warningOrange: '#F59E0B',   // Gastos Hormiga, Alertas, Burn Rate

    // Neutros / Fondos (Slate Palette)
    background:    '#030914',   // Azul oscuro profundo unificado (Wallet & Root background)
    card:          '#1E293B',   // Tarjetas y contenedores
    border:        '#334155',   // Bordes sutiles

    // Tipografía
    textPrimary:   '#F8FAFC',   // Texto principal de alta visibilidad
    textSecondary: '#94A3B8',   // Leyendas, subtítulos e insights

    // Extras
    errorRed:      '#EF4444',
};

// ─────────────────────────────────────────────────────────
// WALLET THEMES — Camino 1: paleta predefinida de degradados
// Cada tema tiene: gradient (tupla inicio→fin para LinearGradient),
// accent (color de énfasis del texto/ícono) e icon (emoji por defecto).
// El usuario elige un key ('OCEAN', 'FOREST', etc.) al crear la wallet;
// ese string se guarda en Drizzle. NO se exporta a Tailwind (ver tailwind.config.js).
// ─────────────────────────────────────────────────────────
module.exports.walletThemes = {
    OCEAN:   { gradient: ['#1E3A8A', '#172554'], accent: '#4D8EFF',  icon: '💳' }, // Azul — Débito/Banco
    FOREST:  { gradient: ['#065F46', '#022C22'], accent: '#4EDEA3',  icon: '💵' }, // Verde — Efectivo/Ahorro
    SUNSET:  { gradient: ['#92400E', '#431407'], accent: '#FFB95F',  icon: '💳' }, // Ámbar — Crédito
    CRIMSON: { gradient: ['#7F1D1D', '#450A0A'], accent: '#FF9B9B',  icon: '💳' }, // Rojo — Tarjeta de emergencia
    NEBULA:  { gradient: ['#4C1D95', '#2E1065'], accent: '#C084FC',  icon: '📈' }, // Morado — Inversiones
    STEEL:   { gradient: ['#1E293B', '#0F172A'], accent: '#94A3B8',  icon: '🏦' }, // Gris — Fondo de emergencia
};
