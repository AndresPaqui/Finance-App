// src/features/dashboard/components/movements/MovementsBalance.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ArrowTrendingUpIcon } from 'react-native-heroicons/solid';
import { BellIcon, ChevronDownIcon, ChevronUpIcon, ArrowDownIcon, ArrowUpIcon, LightBulbIcon } from 'react-native-heroicons/outline';
import tw from '../../../../shared/lib/tw';

export default function MovementsBalance() {
    const [isInsightsOpen, setIsInsightsOpen] = useState(false);

    return (
        <View style={tw`mb-6 `}>
            {/* Header */}
            <View style={tw`flex-row justify-between items-center mb-6`}>
                <Text style={tw`text-white text-3xl font-bold tracking-wide`}>Movimientos</Text>{/* Titulo de la pestaña */}
                <TouchableOpacity style={tw`p-2 rounded-full border border-zinc-800`}>{/* Estilos al tarde un toque a la campana */}
                    <BellIcon size={22} color="#C2C6D6" />
                </TouchableOpacity>
            </View>

            {/* Tarjeta de Balance del Mes */}

            <View style={tw`bg-[#1E293B]/40 border border-zinc-800/80 rounded-3xl p-5 mb-4`}>{/* Contenedor del balance del mes */}
                <Text style={tw`text-[#C2C6D6] text-sm font-medium mb-1`}>Balance del mes</Text>
                <Text style={tw`text-[#D4E4FA] text-4xl font-bold mb-4`}>$2,450.00</Text>

                <View style={tw`flex-row gap-3`}>
                    <View style={tw`flex-1 bg-[#122131]/50 p-3 rounded-2xl border border-[#424754]/30`}>{/* Ingresos */}
                        <View style={tw`flex-row items-center mb-1`}>
                            <ArrowDownIcon size={12} color="#34d399" />
                            <Text style={tw`text-zinc-400 text-xs ml-1 font-semibold `}>Ingresos</Text>
                        </View>
                        <Text style={tw`text-emerald-400 font-semibold text-sm`}>+$3,200.00</Text>
                    </View>
                    <View style={tw`flex-1 bg-[#122131]/50 p-3 rounded-2xl border border-[#424754]/30`}>{/* Gastos */}
                        <View style={tw`flex-row items-center mb-1`}>
                            <ArrowUpIcon size={12} color="#f87171" />
                            <Text style={tw`text-zinc-400 text-xs ml-1 font-semibold`}>Gastos</Text>
                        </View>
                        <Text style={tw`text-red-400 font-semibold text-sm`}>-$750.00</Text>
                    </View>
                </View>
            </View>


            {/* Acordeón de Insights */}
            <View style={tw`bg-[#010F1F]/50 border border-zinc-800/80 rounded-3xl overflow-hidden`}>{/* Contenedor de los detalles de gasto hormiga */}
                <TouchableOpacity
                    style={tw`flex-row justify-between items-center p-4`}
                    onPress={() => setIsInsightsOpen(!isInsightsOpen)}
                    activeOpacity={0.7}
                >{/* Estilos al darte un toque al insight */}
                    <View style={tw`flex-row items-center`}>
                        <View style={tw`w-10 h-10 rounded-full bg-[#CA8100]/20 items-center justify-center mr-3`}>
                            <ArrowTrendingUpIcon size={20} color="#FFB95F" />
                        </View>
                        <Text style={tw`text-slate-200 text-sm font-medium`}> {isInsightsOpen ? 'Ocultar Insights de este mes' : 'Ver Insights de este mes'}</Text>
                    </View>
                    {isInsightsOpen ? <ChevronUpIcon size={20} color="#94A3B8" /> : <ChevronDownIcon size={20} color="#94A3B8" />}{/* Icono dependiendo si insights esta desplegado */}
                </TouchableOpacity>

                {/* Contenido Expandible */}
                {isInsightsOpen && (
                    <View style={tw`px-5 pb-5 pt-2`}>{/* Contenedor del contenido expansible */}
                        <View style={tw`bg-[#1C2B3C]/30 border border-white/5 rounded-[20px] p-5 mb-3`}>
                            <View style={tw`flex-row items-start mb-3`}>
                                <View style={tw`w-10 h-10 rounded-full bg-[#CA8100]/20 items-center justify-center mr-3`}>
                                    <Text style={tw`text-base`}>☕</Text>{/*  Icono del gasto hormiga*/}
                                </View>
                                <View style={tw`flex-1`}>{/* Resumen de los gastos hormiga */}
                                    <Text style={tw`text-zinc-400 text-xs font-medium`}>Gastos Hormiga del mes</Text>
                                    <Text style={tw`text-[#D4E4FA] font-bold text-base mt-0.5 tracking-wide`}>
                                        Este mes llevas <Text style={tw`text-[#FFB95F]`}>$42</Text> en snacks
                                    </Text>
                                </View>
                            </View>
                            <View style={tw`pl-1`}>{/* Comparacion de gastos hormiga con meta */}
                                <View style={tw`flex-row items-center mb-2.5`}>
                                    <Text style={tw`text-xs mr-1.5`}>🎮</Text>
                                    <Text style={tw`text-[#C2C6D6] text-[11px]`}>Esto equivale al 35% de tu meta para la PS5 Slim</Text>
                                </View>
                                <View style={tw`w-full h-2 bg-[#010F1F] rounded-full overflow-hidden`}>
                                    <View style={[tw`h-full bg-[#F59E0B] rounded-full`, { width: '35%' }]} />
                                </View>
                            </View>
                        </View>



                        <View style={tw`flex-row [#010F1F]/60 border border-white/5 p-3 rounded-3xl items-center`}>{/* Contenedor del consejo */}
                            <LightBulbIcon size={18} color="#60A5FA" style={tw`mr-2 mt-0.5`} />{/* Icono de foco */}
                            <Text style={tw`flex-1 text-[#C2C6D6] text-xs font-medium leading-relaxed`}>
                                <Text style={tw`text-[#D4E4FA]`}>Consejo Neo:</Text> Si reduces dos cafés a la semana, alcanzarás tu meta 12 días antes.
                            </Text>
                        </View>
                    </View>
                )}
            </View>
        </View>
    );
}