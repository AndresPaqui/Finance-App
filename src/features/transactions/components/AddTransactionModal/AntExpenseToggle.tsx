// src/features/transactions/components/AddTransactionModal/AntExpenseToggle.tsx

import React from 'react';
import { View, Text, TouchableOpacity, Switch } from 'react-native';
import tw from '../../../../shared/lib/tw';
import { NeoTheme } from '../../../../core/theme/colors';

interface AntExpenseToggleProps {
    value: boolean;
    onValueChange: (newValue: boolean) => void;
}

function AntExpenseToggleComponent({ value, onValueChange }: AntExpenseToggleProps) {
    return (
        <TouchableOpacity
            onPress={() => onValueChange(!value)}
            activeOpacity={0.8}
            style={[
                tw`w-full flex-row items-center justify-between bg-card/40 border rounded-2xl p-3.5 mb-4`,
                value ? tw`border-warningOrange bg-warningOrange/10` : tw`border-white/5`,
            ]}
        >
            <View style={tw`flex-row items-center flex-1 pr-2`}>
                <View style={[
                    tw`w-9 h-9 rounded-xl items-center justify-center mr-3`,
                    value ? tw`bg-warningOrange/20` : tw`bg-zinc-800/80`
                ]}>
                    <Text style={tw`text-base`}>🐜</Text>
                </View>
                <View style={tw`flex-1`}>
                    <Text style={tw`text-white text-sm font-semibold tracking-wide`}>
                        Gasto Hormiga
                    </Text>
                    <Text style={tw`text-textSecondary text-xs mt-0.5`}>
                        Pequeño consumo o snack no esencial
                    </Text>
                </View>
            </View>

            <Switch
                value={value}
                onValueChange={onValueChange}
                trackColor={{ false: '#334155', true: '#F59E0B' }}
                thumbColor={value ? '#FFFFFF' : '#94A3B8'}
            />
        </TouchableOpacity>
    );
}

export default React.memo(AntExpenseToggleComponent);
