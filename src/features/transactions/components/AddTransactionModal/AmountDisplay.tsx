import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import tw from '../../../../shared/lib/tw';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

interface AmountDisplayProps {
    amountString: string;
    isEditing?: boolean;
    onPress?: () => void;
}

function AmountDisplayComponent({ amountString, isEditing = false, onPress }: AmountDisplayProps) {
    const displayValue = amountString || '0';
    const [cursorVisible, setCursorVisible] = useState(true);
    const animVal = useRef(new Animated.Value(isEditing ? 1 : 0)).current;

    useEffect(() => {
        Animated.timing(animVal, {
            toValue: isEditing ? 1 : 0,
            duration: 250,
            useNativeDriver: false,
        }).start();

        if (!isEditing) {
            setCursorVisible(false);
            return;
        }
        setCursorVisible(true);
        const interval = setInterval(() => {
            setCursorVisible((prev) => !prev);
        }, 500);
        return () => clearInterval(interval);
    }, [isEditing]);

    const borderColor = animVal.interpolate({
        inputRange: [0, 1],
        outputRange: ['rgba(255, 255, 255, 0.05)', '#3B82F6'],
    });

    const backgroundColor = animVal.interpolate({
        inputRange: [0, 1],
        outputRange: ['rgba(30, 41, 59, 0.60)', 'rgba(30, 41, 59, 0.90)'],
    });

    return (
        <AnimatedTouchableOpacity
            onPress={onPress}
            activeOpacity={0.8}
            style={[
                tw`w-full rounded-3xl p-6 items-center justify-center mb-4 relative overflow-hidden border-2`,
                { borderColor, backgroundColor }
            ]}
        >
            {/* Grid Pattern sutil de fondo */}
            <View style={tw`absolute inset-0 opacity-10 bg-zinc-900 border border-dashed border-white/20`} />

            <Text style={[
                tw`text-xs font-semibold uppercase tracking-widest mb-1.5`,
                isEditing ? tw`text-primaryBlue` : tw`text-textSecondary`
            ]}>
                Monto Total
            </Text>

            <View style={tw`flex-row items-center justify-center`}>
                <Text style={tw`text-white text-4xl font-black tracking-tight`}>
                    ${displayValue}
                </Text>
                {isEditing && (
                    <Text style={[tw`text-primaryBlue text-4xl font-light ml-0.5`, { opacity: cursorVisible ? 1 : 0 }]}>
                        |
                    </Text>
                )}
            </View>
        </AnimatedTouchableOpacity>
    );
}

export default React.memo(AmountDisplayComponent);
