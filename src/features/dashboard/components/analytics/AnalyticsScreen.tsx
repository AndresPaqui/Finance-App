// src/features/dashboard/components/analytics/AnalyticsScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { UserCircleIcon, BellIcon } from 'react-native-heroicons/outline';
import TimeFilter from './TimeFilter';
import LifestyleThermometer from './LifestyleThermometer';
import TopLeaks from './TopLeaks';
import BankFees from './BankFees';
import tw from '../../../../shared/lib/tw';

export default function AnalyticsScreen() {
    return (
        <View style={tw`mt-12 px-5`}>
            {/* Header Analíticas */}
            <View style={tw`flex-row justify-between items-center mb-6`}>
                <View style={tw`flex-row items-center`}>
                    <Text style={tw`text-white text-3xl font-bold tracking-wide`}>Analíticas</Text>
                </View>
                <TouchableOpacity style={tw`p-2 rounded-full border border-zinc-800`}>{/* Estilos al tarde un toque a la campana */}
                    <BellIcon size={22} color="#C2C6D6" />
                </TouchableOpacity>
            </View>

            <TimeFilter />
            <LifestyleThermometer />
            <TopLeaks />
            <BankFees />
        </View>
    );
}