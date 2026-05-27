// src/features/dashboard/components/analytics/TimeFilter.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import tw from '../../../../shared/lib/tw';

export default function TimeFilter() {
    const [activeFilter, setActiveFilter] = useState('Este Mes');
    const filters = ['Este Mes', 'Mes Pasado', 'Trimestre'];

    return (
        <View style={tw`mb-6`}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={tw`flex-row`}>
                {filters.map((filter) => (
                    <TouchableOpacity
                        key={filter}
                        onPress={() => setActiveFilter(filter)}
                        style={tw`px-5 py-2.5 rounded-full border border-zinc-800 mr-3 ${activeFilter === filter ? 'bg-blue-200 border-blue-300' : 'bg-transparent'
                            }`}
                    >
                        <Text style={tw`text-sm font-semibold ${activeFilter === filter ? 'text-slate-900' : 'text-zinc-400'
                            }`}>
                            {filter}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}