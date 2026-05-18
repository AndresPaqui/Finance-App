export const NeoTheme = {
    colors: {
        // colores Principales
        primaryBlue: '#3B82F6',    // Botones, CTA, Entrada de Voz
        successMint: '#10B981',    // Ingresos, Ahorros, Metas
        warningOrange: '#F59E0B',  // Gastos Hormiga, Alertas, Burn Rate

        // Neutros / Fondos (Slate Palette)
        background: '#0F172A',     // Fondo oscuro elegante estilo Stripe
        card: '#1E293B',           // Tarjetas y contenedores
        border: '#334155',         // Bordes sutiles

        // Tipografía
        textPrimary: '#F8FAFC',    // Texto principal de alta visibilidad
        textSecondary: '#94A3B8',  // Leyendas, subtítulos e insights

        // Extras
        errorRed: '#EF4444',
    }
} as const;

export type AppColors = typeof NeoTheme.colors;