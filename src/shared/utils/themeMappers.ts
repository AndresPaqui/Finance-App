// src/shared/utils/themeMappers.ts

export const ACCOUNT_THEMES = {
    EFECTIVO: {
        colorIcon: 'text-[#4EDEA3]',
        bg: 'bg-[#00A572]/20',
        border: 'border-emerald-500/30',
        gradient: ['#065F46', '#022C22'] as const,
        icon: '💵',
    },
    BANCO: {
        colorIcon: 'text-[#4D8EFF]',
        bg: 'bg-[#4D8EFF]/20',
        border: 'border-blue-500/30',
        gradient: ['#1E3A8A', '#172554'] as const,
        icon: '🏦',
    },
    TARJETA_CREDITO: {
        colorIcon: 'text-[#CA8100]',
        bg: 'bg-[#CA8100]/20',
        border: 'border-orange-500/30',
        gradient: ['#9A3412', '#431407'] as const,
        icon: '💳',
    },
};