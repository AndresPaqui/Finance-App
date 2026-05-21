// src/features/dashboard/components/DailyCostCard.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { ArrowTrendingDownIcon } from 'react-native-heroicons/solid';
import tw from '../../../../shared/lib/tw';

export default function DailyCostCard() {
    return (
        // Fondo semi-transparente oscuro con borde sutil de la paleta de Figma
        <View style={tw`px-5`}>

            <View style={tw`bg-[#1C2B3C]/30 border border-white/5 rounded-[24px] p-5 mb-6`}>

                {/* Cabecera con Icono de Vector */}
                <View style={tw`flex-row items-center mb-2`}>
                    <ArrowTrendingDownIcon size={16} color="#C2C6D6" style={tw`mr-1.5`} />
                    <Text style={tw`text-[#C2C6D6] text-sm font-medium tracking-wide`}>
                        Tu costo diario
                    </Text>
                </View>

                {/* Monto Principal */}
                <Text style={tw`text-[#FFB95F] text-4xl font-bold mb-2`}>
                    $8.20
                </Text>

                {/* Texto Informativo Inferior */}
                <Text style={tw`text-[#8C909F] text-sm font-normal tracking-wide`}>
                    Si sigues así gastarás <Text style={tw`text-white font-medium`}>$246</Text> este mes
                </Text>
            </View>
        </View>
    );
}