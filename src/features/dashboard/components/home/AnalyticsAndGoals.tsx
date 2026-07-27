// src/features/dashboard/components/AnalyticsAndGoals.tsx
import React from 'react';
import { View, Text } from 'react-native';
import tw from '../../../../shared/lib/tw';
import { useFinanceStore } from '../../../../core/state/useFinanceStore';

export default function AnalyticsAndGoals() {
    const gastosHormiga = useFinanceStore((state) => state.gastosHormigaMes);
    const metas = useFinanceStore((state) => state.metasAhorroList);

    const meta = metas[0] || { nombreMeta: 'PS5 Slim', montoObjetivo: 500, montoActual: 320 };
    const porcentajeMeta = Math.min(100, Math.max(0, Math.round((meta.montoActual / meta.montoObjetivo) * 100)));
    const porcentajeHormiga = Math.round((gastosHormiga / (meta.montoObjetivo - meta.montoActual || 180)) * 100);

    return (
        // El px-5 le da los 20px exactos de Figma a los lados para que no se pegue a la pantalla
        <View style={tw`w-full px-5 pb-8 gap-4`}>

            {/* --- TARJETA GASTOS HORMIGA --- */}
            <View style={tw`bg-card/30 border border-white/5 rounded-[20px] p-6`}>
                {/* Cabecera */}
                <View style={tw`flex-row items-center mb-3`}>
                    <Text style={tw`text-lg mr-2`}>☕</Text>
                    <Text style={tw`text-textSecondary text-sm font-medium tracking-wide`}>
                        Gastos hormiga
                    </Text>
                </View>

                {/* Título Principal */}
                <Text style={tw`text-white text-lg font-normal tracking-wide mb-4`}>
                    Este mes llevas <Text style={tw`font-semibold text-warningOrange`}>${gastosHormiga.toFixed(0)}</Text> en snacks
                </Text>

                {/* Progress Bar Amarilla (H 8px -> h-2, Fondo -> #010F1F) */}
                <View style={tw`w-full h-2 bg-background rounded-full overflow-hidden mb-3`}>
                    <View style={[tw`h-full bg-warningOrange rounded-full`, { width: `${Math.min(100, porcentajeHormiga)}%` }]} />
                </View>

                {/* Info Inferior */}
                <Text style={tw`text-textSecondary text-sm font-normal tracking-wide`}>
                    Eso es {porcentajeHormiga}% de lo que te falta para la {meta.nombreMeta}
                </Text>
            </View>


            {/* --- TARJETA META AHORRO --- */}
            <View style={tw`bg-card/30 border border-white/5 rounded-[20px] p-6`}>
                {/* Layout superior de la meta */}
                <View style={tw`flex-row justify-between items-center mb-4`}>
                    {/* Detalles Izquierda */}
                    <View style={tw`flex-row items-center`}>
                        <Text style={tw`text-2xl mr-3`}>🎮</Text>
                        <View>
                            <Text style={tw`text-white text-base font-semibold tracking-wide`}>
                                {meta.nombreMeta}
                            </Text>
                            <Text style={tw`text-textSecondary text-xs mt-0.5 font-normal`}>
                                Te faltan 36 días
                            </Text>
                        </View>
                    </View>

                    {/* Valores Derecha */}
                    <Text style={tw`text-white text-base font-bold tracking-wide`}>
                        ${meta.montoActual.toFixed(0)}<Text style={tw`text-textSecondary font-normal`}> / ${meta.montoObjetivo.toFixed(0)}</Text>
                    </Text>
                </View>

                {/* Progress Bar Esmeralda (H 8px -> h-2, Color -> #4EDEA3) */}
                <View style={tw`w-full h-2 bg-background rounded-full overflow-hidden`}>
                    <View style={[tw`h-full bg-successMint rounded-full`, { width: `${porcentajeMeta}%` }]} />
                </View>
            </View>

        </View>
    );
}