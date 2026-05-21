// src/features/dashboard/components/AnalyticsAndGoals.tsx
import React from 'react';
import { View, Text } from 'react-native';
import tw from '../../../../shared/lib/tw';

export default function AnalyticsAndGoals() {
    return (
        // El px-5 le da los 20px exactos de Figma a los lados para que no se pegue a la pantalla
        <View style={tw`w-full px-5 pb-8 gap-4`}>

            {/* --- TARJETA GASTOS HORMIGA --- */}
            <View style={tw`bg-[#1C2B3C]/30 border border-white/5 rounded-[20px] p-6`}>
                {/* Cabecera */}
                <View style={tw`flex-row items-center mb-3`}>
                    <Text style={tw`text-lg mr-2`}>☕</Text>
                    <Text style={tw`text-[#C2C6D6] text-sm font-medium tracking-wide`}>
                        Gastos hormiga
                    </Text>
                </View>

                {/* Título Principal */}
                <Text style={tw`text-white text-lg font-normal tracking-wide mb-4`}>
                    Este mes llevas <Text style={tw`font-semibold`}>$42</Text> en snacks
                </Text>

                {/* Progress Bar Amarilla (H 8px -> h-2, Fondo -> #010F1F) */}
                <View style={tw`w-full h-2 bg-[#010F1F] rounded-full overflow-hidden mb-3`}>
                    <View style={[tw`h-full bg-[#F59E0B] rounded-full`, { width: '35%' }]} />
                </View>

                {/* Info Inferior */}
                <Text style={tw`text-[#8C909F] text-sm font-normal tracking-wide`}>
                    Eso es 35% de tu meta para la PS5
                </Text>
            </View>


            {/* --- TARJETA META PS5 SLIM --- */}
            <View style={tw`bg-[#1C2B3C]/30 border border-white/5 rounded-[20px] p-6`}>
                {/* Layout superior de la meta */}
                <View style={tw`flex-row justify-between items-center mb-4`}>
                    {/* Detalles Izquierda */}
                    <View style={tw`flex-row items-center`}>
                        <Text style={tw`text-2xl mr-3`}>🎮</Text>
                        <View>
                            <Text style={tw`text-white text-base font-semibold tracking-wide`}>
                                PS5 Slim
                            </Text>
                            <Text style={tw`text-[#8C909F] text-xs mt-0.5 font-normal`}>
                                Te faltan 36 días
                            </Text>
                        </View>
                    </View>

                    {/* Valores Derecha */}
                    <Text style={tw`text-white text-base font-bold tracking-wide`}>
                        $320<Text style={tw`text-[#8C909F] font-normal`}> / $500</Text>
                    </Text>
                </View>

                {/* Progress Bar Esmeralda (H 8px -> h-2, Color -> #4EDEA3) */}
                <View style={tw`w-full h-2 bg-[#010F1F] rounded-full overflow-hidden`}>
                    <View style={[tw`h-full bg-[#4EDEA3] rounded-full`, { width: '64%' }]} />
                </View>
            </View>

        </View>
    );
}