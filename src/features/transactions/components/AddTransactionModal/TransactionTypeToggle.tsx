import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Animated, LayoutChangeEvent } from 'react-native';
import { safeHaptics } from '../../../../shared/lib/haptics';
import tw from '../../../../shared/lib/tw';

export type TransactionType = 'GASTO' | 'INGRESO';

interface TransactionTypeToggleProps {
    type: TransactionType;
    onChangeType: (type: TransactionType) => void;
}

function TransactionTypeToggleComponent({ type, onChangeType }: TransactionTypeToggleProps) {
    const isGasto = type === 'GASTO';
    const animVal = useRef(new Animated.Value(isGasto ? 0 : 1)).current;
    const [containerWidth, setContainerWidth] = useState(0);

    useEffect(() => {
        Animated.timing(animVal, {
            toValue: isGasto ? 0 : 1,
            duration: 200,
            useNativeDriver: false,
        }).start();
    }, [isGasto]);

    const handleLayout = (e: LayoutChangeEvent) => {
        setContainerWidth(e.nativeEvent.layout.width);
    };

    const sliderWidth = containerWidth > 0 ? (containerWidth - 8) / 2 : 0;

    const translateX = animVal.interpolate({
        inputRange: [0, 1],
        outputRange: [0, sliderWidth > 0 ? sliderWidth : 150],
    });

    const backgroundColor = animVal.interpolate({
        inputRange: [0, 1],
        outputRange: ['#D97706', '#10B981'],
    });

    return (
        <View
            onLayout={handleLayout}
            style={tw`w-full flex-row bg-card/40 border border-white/5 p-1 rounded-2xl relative overflow-hidden`}
        >
            {/* Indicador Deslizable Animado */}
            {containerWidth > 0 && (
                <Animated.View
                    style={[
                        tw`absolute top-1 bottom-1 rounded-xl shadow-md`,
                        {
                            left: 4,
                            width: sliderWidth,
                            transform: [{ translateX }],
                            backgroundColor,
                        },
                    ]}
                />
            )}

            {/* Opción Gasto */}
            <TouchableOpacity
                onPress={() => {
                    safeHaptics.impactLight();
                    onChangeType('GASTO');
                }}
                activeOpacity={0.7}
                style={tw`flex-1 py-3 rounded-xl items-center justify-center z-10`}
            >
                <Text
                    style={[
                        tw`text-sm font-bold tracking-wide`,
                        isGasto ? tw`text-white` : tw`text-textSecondary`,
                    ]}
                >
                    Gasto
                </Text>
            </TouchableOpacity>

            {/* Opción Ingreso */}
            <TouchableOpacity
                onPress={() => {
                    safeHaptics.impactLight();
                    onChangeType('INGRESO');
                }}
                activeOpacity={0.7}
                style={tw`flex-1 py-3 rounded-xl items-center justify-center z-10`}
            >
                <Text
                    style={[
                        tw`text-sm font-bold tracking-wide`,
                        !isGasto ? tw`text-zinc-950` : tw`text-textSecondary`,
                    ]}
                >
                    Ingreso
                </Text>
            </TouchableOpacity>
        </View>
    );
}

export default React.memo(TransactionTypeToggleComponent);
