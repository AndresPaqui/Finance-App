// src/features/dashboard/components/analytics/TopLeaks.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { ChartBarIcon } from 'react-native-heroicons/outline';
import tw from '../../../../shared/lib/tw';

export default function TopLeaks() {
    const leaks = [
        { id: '1', category: 'Comida/Snacks', amount: '$124.50', progress: '75%', color: 'bg-orange-500' },
        { id: '2', category: 'Entretenimiento', amount: '$75.00', progress: '45%', color: 'bg-blue-500' },
        { id: '3', category: 'Transporte', amount: '$45.00', progress: '25%', color: 'bg-zinc-600' },
    ];

    return (
        <View style={tw`bg-[#1E293B]/60 border border-zinc-800 rounded-3xl p-5 mb-4`}>
            <View style={tw`flex-row justify-between items-center mb-5`}>
                <Text style={tw`text-[#D4E4FA] text-sm font-bold`}>Top 3 Fugas de Dinero</Text>
                <ChartBarIcon size={20} color="#94A3B8" />
            </View>

            {leaks.map((leak) => (
                <View key={leak.id} style={tw`mb-4 last:mb-0`}>
                    <View style={tw`flex-row justify-between items-center mb-1.5`}>
                        <Text style={tw`text-slate-200 text-sm font-bold`}>{leak.category}</Text>
                        <Text style={tw`text-slate-200 text-sm font-bold`}>{leak.amount}</Text>
                    </View>
                    {/* Track container */}
                    <View style={tw`w-full h-1.5 bg-[#010F1F] rounded-full overflow-hidden`}>
                        {/* Fill */}
                        <View style={[tw`h-full rounded-full ${leak.color}`, { width: leak.progress }]} />
                    </View>
                </View>
            ))}
        </View>
    );
}