// src/features/dashboard/components/movements/MovementsFilter.tsx
import React from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { MagnifyingGlassIcon } from 'react-native-heroicons/outline';
import tw from '../../../../shared/lib/tw';

export default function MovementsFilter() {
    const filters = ['Todos', 'Efectivo', 'Débito', 'Crédito'];

    return (
        <View style={tw`mb-6 px-5`}>
            {/* Buscador */}
            <View style={tw`flex-row items-center bg-[#1E293B]/50 border border-zinc-800 rounded-2xl px-4 py-3 mb-4`}>
                <MagnifyingGlassIcon size={20} color="#94A3B8" />
                <TextInput
                    placeholder="Buscar movimientos..."
                    placeholderTextColor="#64748B"
                    style={tw`flex-1 ml-2 text-white text-sm`}
                />
            </View>

            {/* Píldoras */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={tw`flex-row`}>
                {filters.map((filter, index) => (
                    <TouchableOpacity
                        key={filter}
                        style={tw`px-5 py-2 rounded-full border border-zinc-800 mr-2 ${index === 0 ? 'bg-blue-600/20 border-blue-500/30' : 'bg-zinc-900/50'}`}
                    >
                        <Text style={tw`text-sm ${index === 0 ? 'text-blue-400 font-semibold' : 'text-zinc-400 font-medium'}`}>
                            {filter}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}