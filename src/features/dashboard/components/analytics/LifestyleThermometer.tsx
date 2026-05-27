// src/features/dashboard/components/analytics/LifestyleThermometer.tsx
import React from 'react';
import { View, Text } from 'react-native';
// Usaremos un ícono genérico para simular el termómetro
import { ThermometerIcon } from 'lucide-react-native';
import tw from '../../../../shared/lib/tw';

export default function LifestyleThermometer() {
    return (
        <View style={tw`bg-[#1E293B]/60 border border-zinc-800 rounded-3xl p-5 mb-4`}>
            <View style={tw`flex-row justify-between items-center mb-4`}>
                <Text style={tw`text-[#D4E4FA] text-sm font-medium`}>Termómetro de Estilo de Vida</Text>
                <ThermometerIcon size={20} color="#94A3B8" />
            </View>

            {/* Barra de progreso dividida */}
            <View style={tw`w-full h-3 flex-row rounded-full overflow-hidden mb-4`}>
                <View style={[tw`h-full bg-[#4ADE80]`, { width: '65%' }]} />
                <View style={[tw`h-full bg-orange-400`, { width: '35%' }]} />
            </View>

            {/* Leyendas */}
            <View style={tw`flex-row justify-between`}>
                <View style={tw`flex-row items-center`}>
                    <View style={tw`w-2 h-2 rounded-full bg-emerald-400 mr-2`} />
                    <Text style={tw`text-slate-200 text-xs font-semibold tracking-wide`}>Necesidades (65%)</Text>
                </View>
                <View style={tw`flex-row items-center`}>
                    <Text style={tw`text-slate-200 text-xs font-semibold tracking-wide mr-2 `}>Caprichos (35%)</Text>
                    <View style={tw`w-2 h-2 rounded-full bg-orange-400`} />
                </View>
            </View>
        </View>
    );
}
