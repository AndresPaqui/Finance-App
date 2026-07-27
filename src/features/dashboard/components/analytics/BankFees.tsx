// src/features/dashboard/components/analytics/BankFees.tsx
import React from 'react';
import { View, Text } from 'react-native';
import tw from '../../../../shared/lib/tw';
import { useFinanceStore } from '../../../../core/state/useFinanceStore';

export default function BankFees() {
    const comisiones = useFinanceStore((state) => state.comisionesMes);

    const textoEquivalencia = comisiones >= 4.0 
        ? 'Equivale a un almuerzo completo' 
        : comisiones > 0 
            ? 'Equivale a un café o snack'
            : 'Sin comisiones pagadas este mes';

    return (
        <View style={tw`bg-card/40 border border-zinc-800 rounded-3xl p-6 items-center mb-6`}>
            <Text style={tw`text-zinc-400 text-sm font-medium mb-3`}>
                Has regalado en comisiones bancarias:
            </Text>

            <Text style={tw`text-errorRed text-3xl font-black mb-5 tracking-tight`}>
                -${comisiones.toFixed(2)}
            </Text>

            <View style={tw`flex-row items-center bg-background/50 border border-zinc-800/80 px-4 py-2.5 rounded-full`}>
                <Text style={tw`text-base mr-2`}>🍔</Text>
                <Text style={tw`text-textSecondary text-xs font-semibold`}>
                    {textoEquivalencia}
                </Text>
            </View>
        </View>
    );
}