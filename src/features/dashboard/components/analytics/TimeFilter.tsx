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
                        style={tw`px-5 py-2.5 rounded-full border border-border mr-3 ${activeFilter === filter ? 'bg-primaryBlue border-primaryBlue' : 'bg-transparent'
                            }`}
                    >
                        <Text style={tw`text-sm font-semibold ${activeFilter === filter ? 'text-background' : 'text-textSecondary'
                            }`}>
                            {filter}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}