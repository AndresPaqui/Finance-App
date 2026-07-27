// src/features/dashboard/components/WalletHeader.tsx

import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { BellIcon, WalletIcon } from 'react-native-heroicons/outline';
import tw from "../../../../shared/lib/tw";
import { LinearGradient } from 'expo-linear-gradient';
import { useFinanceStore } from '../../../../core/state/useFinanceStore';
import { NeoTheme } from '../../../../core/theme/colors';

//Calcular la dimension de la pantalla
const CARD_WIDTH = Dimensions.get('window').width * 0.85;

// Diccionario visual: Mapea el tipo de cuenta de la BD a tus estilos Tailwind
const ACCOUNT_THEMES: Record<string, { color: string; colorIcon: string; bg: string; gradient: readonly [string, string, ...string[]]; icon: string; iconColor: string }> = {
    EFECTIVO: { color: 'border-emerald-500/30', colorIcon: 'text-successMint', bg: 'bg-[#00A572]/20', gradient: ['#065F46', '#022C22'] as const, icon: '💵', iconColor: NeoTheme.colors.successMint },
    BANCO: { color: 'border-blue-500/30', colorIcon: 'text-[#4D8EFF]', bg: 'bg-[#4D8EFF]/20', gradient: ['#1E3A8A', '#172554'] as const, icon: '💳', iconColor: NeoTheme.colors.primaryBlue },
    TARJETA_CREDITO: { color: 'border-orange-500/30', colorIcon: 'text-warningOrange', bg: 'bg-[#CA8100]/20', gradient: ['#CA8100', '#431407'] as const, icon: '💳', iconColor: NeoTheme.colors.warningOrange },
};

export default function WalletHeader() {
    const saldoTotal = useFinanceStore((state) => state.saldoTotalNeto);
    const cuentas = useFinanceStore((state) => state.cuentasList);

    return (
        <View style={tw`pt-12 pb-6 px-4 border-b border-zinc-900`}>
            <View style={tw`flex-row justify-between items-center mb-6`}>
                <View>
                    <Text style={tw`text-textSecondary text-sm font-medium`}>Bienvenido de vuelta</Text>
                    <Text style={tw`text-textPrimary text-xl font-bold tracking-tight`}>Hola Jacob 👋</Text>
                </View>
                <TouchableOpacity style={tw`p-2 rounded-full border border-zinc-800`}>
                    <BellIcon size={22} color={NeoTheme.colors.textSecondary} />
                </TouchableOpacity>
            </View>

            <View style={tw`mb-6`}>
                <Text style={tw`text-textSecondary text-xs font-semibold uppercase tracking-widest mb-1`}>
                    Efectivo libre disponible
                </Text>
                <Text style={tw`text-white text-4xl font-black tracking-tight`}>
                    ${saldoTotal.toFixed(2)}
                </Text>
            </View>

            <Text style={tw`text-white text-sm font-semibold mb-3 px-1`}>Mis Cuentas</Text>

            <View style={tw`flex-row mb-3 justify-between`}>
                {cuentas.map((cuenta) => {
                    const theme = ACCOUNT_THEMES[cuenta.tipo] || ACCOUNT_THEMES.EFECTIVO;
                    return (
                        <View
                            key={cuenta.id}
                            style={tw`flex-row items-center py-1 ${theme.bg} rounded-full mx-1`}
                        >
                            <View style={tw`pr-2 pl-4`}>
                                <Text>{theme.icon}</Text>
                            </View>
                            <View style={tw`pr-4 pl-2`}>
                                <Text style={tw`${theme.colorIcon} font-semibold text-xs`}>{cuenta.nombre}</Text>
                            </View>
                        </View>
                    );
                })}
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 4 }}
                style={[tw`flex-row`]}
            >
                {cuentas.map((cuenta) => {
                    const theme = ACCOUNT_THEMES[cuenta.tipo] || ACCOUNT_THEMES.EFECTIVO;
                    return (
                        <TouchableOpacity
                            key={cuenta.id}
                            style={{ width: CARD_WIDTH }}
                        >
                            <LinearGradient
                                colors={theme.gradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={tw`p-4 border ${theme.color} rounded-2xl mr-3`}
                            >
                                <View style={tw`flex-row justify-between items-center mb-4`}>
                                    <View style={tw`p-2 bg-card rounded-xl`}>
                                        <WalletIcon size={20} color={theme.iconColor} />
                                    </View>
                                    <Text style={tw`text-textSecondary text-xs font-bold`}>USD</Text>
                                </View>
                                <Text style={tw`text-textSecondary text-xs font-medium`}>{cuenta.nombre}</Text>
                                <Text style={tw`text-white text-lg font-bold tracking-tight mt-0.5`}>
                                    ${cuenta.saldoActual.toFixed(2)}
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
}