// src/features/dashboard/components/home/WalletHeader.tsx

import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import {
    BellIcon,
    BuildingLibraryIcon,
    CreditCardIcon,
    BanknotesIcon,
    QrCodeIcon,
    PlusIcon,
    WalletIcon,
} from 'react-native-heroicons/outline';
import { LinearGradient } from 'expo-linear-gradient';
import tw from '../../../../shared/lib/tw';
import {
    useFinanceStore,
    AccountBalance,
    getAccountGradient,
    getCupoDisponible,
} from '../../../../core/state/useFinanceStore';
import { getPresetById } from '../../../../core/constants/walletPresets';
import { safeHaptics } from '../../../../shared/lib/haptics';
import { NeoTheme } from '../../../../core/theme/colors';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = SCREEN_WIDTH * 0.82;
const CARD_MARGIN = 12;
const SNAP_INTERVAL = CARD_WIDTH + CARD_MARGIN;

interface WalletHeaderProps {
    onAddWalletPress?: () => void;
}

function getIconForAccount(tipo: string, presetId?: string | null, iconName?: string | null, customIconColor?: string) {
    const color = customIconColor || "rgba(255, 255, 255, 0.35)";
    if (iconName === 'QrCodeIcon' || presetId === 'deuna') {
        return <QrCodeIcon size={32} color={color} />;
    }
    if (tipo === 'TARJETA_CREDITO') {
        return <CreditCardIcon size={32} color={color} />;
    }
    if (tipo === 'EFECTIVO') {
        return <BanknotesIcon size={32} color={color} />;
    }
    return <BuildingLibraryIcon size={32} color={color} />;
}

export default function WalletHeader({ onAddWalletPress }: WalletHeaderProps) {
    const saldoTotal = useFinanceStore((state) => state.saldoTotalNeto);
    const cuentas = useFinanceStore((state) => state.cuentasList);

    const handleAddWallet = () => {
        safeHaptics.impactMedium();
        if (onAddWalletPress) {
            onAddWalletPress();
        }
    };

    return (
        <View style={tw`pt-12 pb-5 border-b border-white/5 bg-[#030914]`}>
            {/* Header Saludo y Notificaciones */}
            <View style={tw`flex-row justify-between items-center mb-5 px-5`}>
                <View>
                    <Text style={tw`text-textSecondary text-xs font-semibold tracking-wide uppercase`}>
                        Bienvenido de vuelta
                    </Text>
                    <Text style={tw`text-white text-2xl font-black tracking-tight mt-0.5`}>
                        Hola Jacob 👋
                    </Text>
                </View>

                <TouchableOpacity
                    onPress={() => safeHaptics.impactLight()}
                    activeOpacity={0.7}
                    style={tw`p-2.5 rounded-full bg-card/60 border border-white/10 shadow-sm`}
                >
                    <BellIcon size={20} color={NeoTheme.colors.textSecondary} />
                </TouchableOpacity>
            </View>

            {/* Display de Saldo Total Neto */}
            <View style={tw`mb-5 px-5`}>
                <Text style={tw`text-textSecondary text-[11px] font-bold uppercase tracking-widest mb-0.5`}>
                    Efectivo libre disponible
                </Text>
                <Text style={tw`text-white text-4xl font-black tracking-tight`}>
                    ${saldoTotal.toFixed(2)}
                </Text>
            </View>

            {/* Subtítulo de Sección */}
            <View style={tw`flex-row justify-between items-center mb-3 px-5`}>
                <Text style={tw`text-white text-sm font-bold tracking-wide`}>
                    Mis Cuentas ({cuentas.length})
                </Text>
            </View>

            {/* Carrusel Horizontal de Wallets con Snapping Fluido */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                decelerationRate="fast"
                snapToInterval={SNAP_INTERVAL}
                snapToAlignment="start"
                contentContainerStyle={{ paddingHorizontal: 20 }}
            >
                {cuentas.map((cuenta) => {
                    const gradientColors = getAccountGradient(cuenta);
                    const preset = getPresetById(cuenta.presetId);
                    const isCreditCard = cuenta.tipo === 'TARJETA_CREDITO';
                    const isCash = cuenta.tipo === 'EFECTIVO';

                    // Lógica Dinámica de Contraste de Texto / Ícono por Preset
                    const textColor = preset.textColor || (preset.darkText ? '#1F2937' : undefined);
                    const hasCustomTextColor = !!textColor;

                    const mainTextColor = textColor || '#FFFFFF';
                    const secondaryTextColor = hasCustomTextColor ? `${textColor}B3` : 'rgba(255, 255, 255, 0.7)';
                    const headerTextColor = hasCustomTextColor ? `${textColor}CC` : 'rgba(255, 255, 255, 0.8)';
                    const iconColor = hasCustomTextColor ? `${textColor}80` : 'rgba(255, 255, 255, 0.35)';

                    // Etiqueta superior
                    const tipoLabel = isCreditCard ? 'CRÉDITO' : isCash ? 'EFECTIVO' : 'DÉBITO';
                    const saldoLabel = isCreditCard ? 'Deuda Actual' : isCash ? 'Disponible' : 'Balance Disponible';

                    // Cálculo de barra de porcentaje para crédito
                    const limite = cuenta.limiteCredito || 0;
                    const deuda = cuenta.saldoActual || 0;
                    const percentage = limite > 0 ? Math.min(100, Math.max(0, (deuda / limite) * 100)) : 0;

                    return (
                        <TouchableOpacity
                            key={cuenta.id}
                            activeOpacity={0.9}
                            onPress={() => safeHaptics.selection()}
                            style={[{ width: CARD_WIDTH, marginRight: CARD_MARGIN }]}
                        >
                            <LinearGradient
                                colors={gradientColors}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={tw`p-5 rounded-3xl border border-white/10 justify-between h-44 shadow-xl relative overflow-hidden`}
                            >
                                {/* Encabezado de la Tarjeta */}
                                <View style={tw`flex-row justify-between items-start`}>
                                    <View style={tw`flex-1 pr-2`}>
                                        <Text style={[tw`text-[11px] font-bold tracking-widest uppercase`, { color: headerTextColor }]}>
                                            {tipoLabel}
                                        </Text>
                                        <Text
                                            style={[tw`text-xl font-extrabold tracking-tight mt-0.5`, { color: mainTextColor }]}
                                            numberOfLines={1}
                                        >
                                            {cuenta.nombre}
                                        </Text>
                                    </View>

                                    {/* Ícono de la institución */}
                                    <View style={tw`ml-2`}>
                                        {getIconForAccount(cuenta.tipo, cuenta.presetId, preset.iconName, iconColor)}
                                    </View>
                                </View>

                                {/* Cuerpo de la Tarjeta */}
                                <View style={tw`mt-auto`}>
                                    {isCreditCard ? (
                                        <>
                                            <View style={tw`flex-row justify-between items-end mb-2`}>
                                                <View>
                                                    <Text style={[tw`text-xs font-medium`, { color: secondaryTextColor }]}>
                                                        {saldoLabel}
                                                    </Text>
                                                    <Text style={[tw`text-3xl font-black tracking-tight mt-0.5`, { color: mainTextColor }]}>
                                                        ${deuda.toFixed(2)}
                                                    </Text>
                                                </View>

                                                {limite > 0 && (
                                                    <Text style={[tw`text-xs font-bold mb-1`, { color: headerTextColor }]}>
                                                        Cupo ${limite.toFixed(0)}
                                                    </Text>
                                                )}
                                            </View>

                                            {/* Barra de Progreso de Crédito */}
                                            {limite > 0 && (
                                                <View style={tw`w-full h-2 ${hasCustomTextColor ? 'bg-black/20' : 'bg-black/40'} rounded-full overflow-hidden`}>
                                                    <View
                                                        style={[
                                                            tw`h-full rounded-full ${hasCustomTextColor ? 'bg-slate-900' : 'bg-amber-400'}`,
                                                            { width: `${percentage}%` },
                                                        ]}
                                                    />
                                                </View>
                                            )}
                                        </>
                                    ) : (
                                        <View>
                                            <Text style={[tw`text-xs font-medium`, { color: secondaryTextColor }]}>
                                                {saldoLabel}
                                            </Text>
                                            <Text style={[tw`text-3xl font-black tracking-tight mt-0.5`, { color: mainTextColor }]}>
                                                ${cuenta.saldoActual.toFixed(2)}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            </LinearGradient>
                        </TouchableOpacity>
                    );
                })}

                {/* --- ÚLTIMA TARJETA ESPECIAL: "AÑADIR BILLETERA" --- */}
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={handleAddWallet}
                    style={[
                        tw`h-44 bg-[#0F172A]/50 border-2 border-dashed border-white/20 rounded-3xl p-5 items-center justify-center shadow-md`,
                        { width: CARD_WIDTH, marginRight: CARD_MARGIN },
                    ]}
                >
                    <View style={tw`w-12 h-12 rounded-full bg-white/10 border border-white/10 items-center justify-center mb-2.5 shadow-sm`}>
                        <PlusIcon size={24} color="#FFFFFF" />
                    </View>

                    <Text style={tw`text-white text-base font-bold tracking-wide`}>
                        Añadir Billetera
                    </Text>
                    <Text style={tw`text-textSecondary text-xs font-medium mt-0.5`}>
                        Banco, Tarjeta o Efectivo
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}