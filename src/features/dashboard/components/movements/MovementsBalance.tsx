// src/features/dashboard/components/movements/MovementsBalance.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ArrowTrendingUpIcon } from 'react-native-heroicons/solid';
import { BellIcon, ChevronDownIcon, ChevronUpIcon, ArrowDownIcon, ArrowUpIcon, LightBulbIcon } from 'react-native-heroicons/outline';
import tw from '../../../../shared/lib/tw';
import { NeoTheme } from '../../../../core/theme/colors';
import { useFinanceStore } from '../../../../core/state/useFinanceStore';

export default function MovementsBalance() {
    const [isInsightsOpen, setIsInsightsOpen] = useState(false);
    const ingresosMes = useFinanceStore((state) => state.ingresosMes);
    const gastosMes = useFinanceStore((state) => state.gastosMes);
    const gastosHormiga = useFinanceStore((state) => state.gastosHormigaMes);
    const metas = useFinanceStore((state) => state.metasAhorroList);

    const balanceMes = ingresosMes - gastosMes;
    const meta = metas[0] || { nombreMeta: 'PS5 Slim', montoObjetivo: 500, montoActual: 320 };
    const porcentajeHormiga = Math.round((gastosHormiga / (meta.montoObjetivo - meta.montoActual || 180)) * 100);

    return (
        <View style={tw`mb-6`}>
            {/* Header */}
            <View style={tw`flex-row justify-between items-center mb-6`}>
                <Text style={tw`text-white text-3xl font-bold tracking-wide`}>Movimientos</Text>
                <TouchableOpacity style={tw`p-2 rounded-full border border-zinc-800`}>
                    <BellIcon size={22} color={NeoTheme.colors.textSecondary} />
                </TouchableOpacity>
            </View>

            {/* Tarjeta de Balance del Mes */}
            <View style={tw`bg-card/40 border border-zinc-800/80 rounded-3xl p-5 mb-4`}>
                <Text style={tw`text-textSecondary text-sm font-medium mb-1`}>Balance del mes</Text>
                <Text style={tw`text-textPrimary text-4xl font-bold mb-4`}>
                    {balanceMes < 0 ? '-' : ''}${Math.abs(balanceMes).toFixed(2)}
                </Text>

                <View style={tw`flex-row gap-3`}>
                    <View style={tw`flex-1 bg-[#122131]/50 p-3 rounded-2xl border border-[#424754]/30`}>
                        <View style={tw`flex-row items-center mb-1`}>
                            <ArrowDownIcon size={12} color="#34d399" />
                            <Text style={tw`text-textSecondary text-xs ml-1 font-semibold`}>Ingresos</Text>
                        </View>
                        <Text style={tw`text-emerald-400 font-semibold text-sm`}>+${ingresosMes.toFixed(2)}</Text>
                    </View>
                    <View style={tw`flex-1 bg-[#122131]/50 p-3 rounded-2xl border border-[#424754]/30`}>
                        <View style={tw`flex-row items-center mb-1`}>
                            <ArrowUpIcon size={12} color="#f87171" />
                            <Text style={tw`text-textSecondary text-xs ml-1 font-semibold`}>Gastos</Text>
                        </View>
                        <Text style={tw`text-red-400 font-semibold text-sm`}>-${gastosMes.toFixed(2)}</Text>
                    </View>
                </View>
            </View>

            {/* Acordeón de Insights */}
            <View style={tw`bg-background/50 border border-zinc-800/80 rounded-3xl overflow-hidden`}>
                <TouchableOpacity
                    style={tw`flex-row justify-between items-center p-4`}
                    onPress={() => setIsInsightsOpen(!isInsightsOpen)}
                    activeOpacity={0.7}
                >
                    <View style={tw`flex-row items-center`}>
                        <View style={tw`w-10 h-10 rounded-full bg-[#CA8100]/20 items-center justify-center mr-3`}>
                            <ArrowTrendingUpIcon size={20} color={NeoTheme.colors.warningOrange} />
                        </View>
                        <Text style={tw`text-slate-200 text-sm font-medium`}>
                            {isInsightsOpen ? 'Ocultar Insights de este mes' : 'Ver Insights de este mes'}
                        </Text>
                    </View>
                    {isInsightsOpen ? (
                        <ChevronUpIcon size={20} color={NeoTheme.colors.textSecondary} />
                    ) : (
                        <ChevronDownIcon size={20} color={NeoTheme.colors.textSecondary} />
                    )}
                </TouchableOpacity>

                {/* Contenido Expandible */}
                {isInsightsOpen && (
                    <View style={tw`px-5 pb-5 pt-2`}>
                        <View style={tw`bg-card/30 border border-white/5 rounded-[20px] p-5 mb-3`}>
                            <View style={tw`flex-row items-start mb-3`}>
                                <View style={tw`w-10 h-10 rounded-full bg-[#CA8100]/20 items-center justify-center mr-3`}>
                                    <Text style={tw`text-base`}>☕</Text>
                                </View>
                                <View style={tw`flex-1`}>
                                    <Text style={tw`text-textSecondary text-xs font-medium`}>Gastos Hormiga del mes</Text>
                                    <Text style={tw`text-textPrimary font-bold text-base mt-0.5 tracking-wide`}>
                                        Este mes llevas <Text style={tw`text-warningOrange`}>${gastosHormiga.toFixed(0)}</Text> en snacks
                                    </Text>
                                </View>
                            </View>
                            <View style={tw`pl-1`}>
                                <View style={tw`flex-row items-center mb-2.5`}>
                                    <Text style={tw`text-xs mr-1.5`}>🎮</Text>
                                    <Text style={tw`text-textSecondary text-[11px]`}>
                                        Esto equivale al {porcentajeHormiga}% de lo que falta para tu {meta.nombreMeta}
                                    </Text>
                                </View>
                                <View style={tw`w-full h-2 bg-background rounded-full overflow-hidden`}>
                                    <View style={[tw`h-full bg-warningOrange rounded-full`, { width: `${Math.min(100, porcentajeHormiga)}%` }]} />
                                </View>
                            </View>
                        </View>

                        <View style={tw`flex-row bg-background/60 border border-white/5 p-3 rounded-3xl items-center`}>
                            <LightBulbIcon size={18} color="#60A5FA" style={tw`mr-2 mt-0.5`} />
                            <Text style={tw`flex-1 text-textSecondary text-xs font-medium leading-relaxed`}>
                                <Text style={tw`text-textPrimary`}>Consejo Neo:</Text> Si reduces dos cafés a la semana, alcanzarás tu meta 12 días antes.
                            </Text>
                        </View>
                    </View>
                )}
            </View>
        </View>
    );
}