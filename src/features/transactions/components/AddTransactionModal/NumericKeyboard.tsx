// src/features/transactions/components/AddTransactionModal/NumericKeyboard.tsx

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { BackspaceIcon } from 'react-native-heroicons/outline';
import tw from '../../../../shared/lib/tw';

interface NumericKeyboardProps {
    onKeyPress: (key: string) => void;
    onDelete: () => void;
}

function NumericKeyboardComponent({ onKeyPress, onDelete }: NumericKeyboardProps) {
    const keys = [
        ['1', '2', '3'],
        ['4', '5', '6'],
        ['7', '8', '9'],
        ['.', '0', 'DELETE'],
    ];

    return (
        <View style={tw`w-full gap-2.5 px-2`}>
            {keys.map((row, rowIndex) => (
                <View key={`row-${rowIndex}`} style={tw`flex-row gap-2.5 justify-between`}>
                    {row.map((key) => {
                        const isDelete = key === 'DELETE';

                        return (
                            <TouchableOpacity
                                key={key}
                                onPress={() => (isDelete ? onDelete() : onKeyPress(key))}
                                activeOpacity={0.6}
                                style={tw`flex-1 h-14 bg-card/60 border border-white/5 rounded-2xl items-center justify-center shadow-sm`}
                            >
                                {isDelete ? (
                                    <BackspaceIcon size={24} color="#94A3B8" />
                                ) : (
                                    <Text style={tw`text-white text-2xl font-bold`}>{key}</Text>
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </View>
            ))}
        </View>
    );
}

export default React.memo(NumericKeyboardComponent);
