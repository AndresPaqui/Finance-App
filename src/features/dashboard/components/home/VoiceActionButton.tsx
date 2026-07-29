import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MicrophoneIcon, BoltIcon } from 'react-native-heroicons/solid';
import tw from '../../../../shared/lib/tw';
import { NeoTheme } from '../../../../core/theme/colors';
import { useFinanceSync } from '../../../../shared/hooks/useFinanceSync';
import { useFinanceStore } from '../../../../core/state/useFinanceStore';

export default function VoiceActionButton() {
    const isRecording = false;
    const { ejecutarBreakPoint } = useFinanceSync();
    const cuentas = useFinanceStore((state) => state.cuentasList);

    const handleGasteRapido = () => {
        const cuentaId = cuentas[0]?.id || '1';
        ejecutarBreakPoint(cuentaId);
    };

    return (
        <View style={tw`w-full items-center px-6 py-6`}>

            {/* --- SECCIÓN DEL MICRÓFONO --- */}
            <View style={tw`items-center mb-8`}>
                {/* Anillo exterior de la burbuja */}
                <View style={tw`p-2.5 rounded-full border border-white/10 bg-white/5`}>
                    <TouchableOpacity
                        style={tw`w-18 h-18 rounded-full items-center justify-center ${isRecording ? 'bg-errorRed' : 'bg-primaryBlue'}`}
                        activeOpacity={0.8}
                    >
                        <MicrophoneIcon size={32} color={isRecording ? '#FFFFFF' : '#00285D'} />
                    </TouchableOpacity>
                </View>

                {/* Texto de estado */}
                <Text style={tw`text-white text-xl font-medium mt-4 tracking-wide text-center`}>
                    {isRecording ? 'Escuchando...' : 'Toca para registrar'}
                </Text>
            </View>

            {/* --- BOTÓN "GASTÉ ALGO RÁPIDO" --- */}
            <TouchableOpacity
                onPress={handleGasteRapido}
                style={tw`w-full max-w-sm flex-row items-center justify-center py-4.5 px-6 rounded-[24px] border border-warningOrange bg-background/40`}
                activeOpacity={0.7}
            >
                <BoltIcon size={24} color={NeoTheme.colors.warningOrange} style={tw`mr-2`} />
                <Text style={tw`text-warningOrange text-xl font-semibold tracking-wide`}>
                    Gasté algo rápido
                </Text>
            </TouchableOpacity>

        </View>
    );
}