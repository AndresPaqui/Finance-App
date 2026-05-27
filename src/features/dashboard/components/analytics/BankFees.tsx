// src/features/dashboard/components/analytics/BankFees.tsx
import React from 'react';
import { View, Text } from 'react-native';
import tw from '../../../../shared/lib/tw';

export default function BankFees() {
    return (
        <View style={tw`bg-[#1E293B]/40 border border-zinc-800 rounded-3xl p-6 items-center mb-6`}>
            <Text style={tw`text-zinc-400 text-sm font-medium mb-3`}>
                Has regalado en comisiones bancarias:
            </Text>

            <Text style={tw`text-[#FF9B9B] text-3xl font-black mb-5 tracking-tight`}>
                -$4.75
            </Text>

            <View style={tw`flex-row items-center bg-[#0F172A]/50 border border-zinc-800/80 px-4 py-2.5 rounded-full`}>
                <Text style={tw`text-base mr-2`}>🍔</Text>
                <Text style={tw`text-[#C2C6D6] text-xs font-semibold`}>
                    Equivale a un almuerzo completo
                </Text>
            </View>
        </View>
    );
}