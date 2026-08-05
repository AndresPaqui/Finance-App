// src/core/constants/walletPresets.ts

export type AccountType = 'EFECTIVO' | 'BANCO' | 'TARJETA_CREDITO';

export interface WalletPreset {
    id: string;
    nombre: string;
    tipo: AccountType;
    gradientColors: [string, string]; // [Color Inicio, Color Fin]
    iconName: string;
    textColor?: string;               // Color dinámico de texto/ícono para tarjetas claras (ej. '#1F2937')
    darkText?: boolean;               // Habilita texto en negro/gris oscuro para fondos amarillos/claros
    descripcion?: string;
}

export const WALLET_PRESETS: WalletPreset[] = [
    {
        id: 'pichincha',
        nombre: 'Banco Pichincha',
        tipo: 'BANCO',
        gradientColors: ['#CA8A04', '#FACC15'], // Amarillo Oro / Mostaza Corporativo Pichincha
        iconName: 'BuildingLibraryIcon',
        textColor: '#1F2937',                   // Forzar texto gris muy oscuro para contraste óptimo
        darkText: true,
        descripcion: 'Cuenta de Ahorros / Corriente Banco Pichincha',
    },
    {
        id: 'guayaquil',
        nombre: 'Banco Guayaquil',
        tipo: 'BANCO',
        gradientColors: ['#831843', '#BE185D'], // Vino / Berry Oscuro
        iconName: 'BuildingLibraryIcon',
        descripcion: 'Cuenta Banco Guayaquil',
    },
    {
        id: 'produbanco',
        nombre: 'Produbanco',
        tipo: 'BANCO',
        gradientColors: ['#064E3B', '#047857'], // Verde Bosque / Pino Profundo
        iconName: 'BuildingLibraryIcon',
        descripcion: 'Cuenta Grupo Promerica / Produbanco',
    },
    {
        id: 'pacifico',
        nombre: 'Banco del Pacífico',
        tipo: 'BANCO',
        gradientColors: ['#172554', '#1E3A8A'], // Azul Marino / Océano Profundo
        iconName: 'BuildingLibraryIcon',
        descripcion: 'Cuenta Banco del Pacífico',
    },
    {
        id: 'discover',
        nombre: 'Discover',
        tipo: 'TARJETA_CREDITO',
        gradientColors: ['#F26622', '#1F2937'], // Naranja a Gris Oscuro
        iconName: 'CreditCardIcon',
        descripcion: 'Tarjeta de Crédito Discover',
    },
    {
        id: 'visa_generica',
        nombre: 'Visa Genérica',
        tipo: 'TARJETA_CREDITO',
        gradientColors: ['#1A1F71', '#28328C'], // Azul Corporativo Visa
        iconName: 'CreditCardIcon',
        descripcion: 'Tarjeta de Crédito Visa / Mastercard',
    },
    {
        id: 'deuna',
        nombre: 'Deuna!',
        tipo: 'BANCO',
        gradientColors: ['#2E1065', '#7E22CE'], // Morado Corporativo Deuna!
        iconName: 'QrCodeIcon',
        descripcion: 'Billetera Digital Deuna! / PayPhone',
    },
    {
        id: 'efectivo',
        nombre: 'Efectivo',
        tipo: 'EFECTIVO',
        gradientColors: ['#10B981', '#047857'], // Verde Esmeralda
        iconName: 'BanknotesIcon',
        descripcion: 'Dinero Físico / Billetera',
    },
    {
        id: 'custom',
        nombre: 'Otro Banco / Personalizado',
        tipo: 'BANCO',
        gradientColors: ['#1E293B', '#3B82F6'], // Gris Neomórfico / Azul Acento
        iconName: 'WalletIcon',
        descripcion: 'Crear una cuenta o tarjeta personalizada',
    },
];

/**
 * Obtener las propiedades de un preset por su ID.
 * Retorna el preset 'custom' por defecto si no se encuentra.
 */
export function getPresetById(presetId?: string | null): WalletPreset {
    if (!presetId) return WALLET_PRESETS[WALLET_PRESETS.length - 1]; // custom
    return (
        WALLET_PRESETS.find((p) => p.id.toLowerCase() === presetId.toLowerCase()) ||
        WALLET_PRESETS[WALLET_PRESETS.length - 1]
    );
}

/**
 * Obtener colores de gradiente por defecto para un tipo de cuenta o presetId.
 */
export function getGradientColorsForAccount(
    presetId?: string | null,
    customInicio?: string | null,
    customFin?: string | null
): [string, string] {
    if (customInicio && customFin) {
        return [customInicio, customFin];
    }
    const preset = getPresetById(presetId);
    return preset.gradientColors;
}
