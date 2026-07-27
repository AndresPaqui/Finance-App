// src/features/dashboard/components/DailyCostCard.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { ArrowTrendingDownIcon } from 'react-native-heroicons/solid';
import tw from '../../../../shared/lib/tw';
import { NeoTheme } from '../../../../core/theme/colors';
import { useFinanceStore } from '../../../../core/state/useFinanceStore';

export default function DailyCostCard() {
    const gastosMes = useFinanceStore((state) => state.gastosMes);

    // Cálculo dinámico en base al día actual del mes
    const now = new Date();
    const diaActual = Math.max(1, now.getDate());
    const diasEnMes = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const costoDiario = gastosMes / diaActual;
    const proyeccion = costoDiario * diasEnMes;

    return (
        // Fondo semi-transparente oscuro con borde sutil de la paleta de Figma
        <View style={tw`px-5`}>

            <View style={tw`bg-card/30 border border-white/5 rounded-[24px] p-5 mb-6`}>

                {/* Cabecera con Icono de Vector */}
                <View style={tw`flex-row items-center mb-2`}>
                    <ArrowTrendingDownIcon size={16} color={NeoTheme.colors.textSecondary} style={tw`mr-1.5`} />
                    <Text style={tw`text-textSecondary text-sm font-medium tracking-wide`}>
                        Tu costo diario
                    </Text>
                </View>

                {/* Monto Principal */}
                <Text style={tw`text-warningOrange text-4xl font-bold mb-2`}>
                    ${costoDiario.toFixed(2)}
                </Text>

                {/* Texto Informativo Inferior */}
                <Text style={tw`text-textSecondary text-sm font-normal tracking-wide`}>
                    Si sigues así gastarás <Text style={tw`text-white font-medium`}>${proyeccion.toFixed(0)}</Text> este mes
                </Text>
            </View>
        </View>
    );
}