import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MicrophoneIcon, BoltIcon } from 'react-native-heroicons/solid';
import tw from '../../../../shared/lib/tw';

export default function VoiceActionButton() {
    const isRecording = false; // Luego lo conectas a tu estado/hook

    return (
        <View style={tw`w-full items-center px-6 py-6`}>

            {/* --- SECCIÓN DEL MICRÓFONO --- */}
            <View style={tw`items-center mb-10`}>
                {/* Contenedor externo: Simula el anillo sutil exterior de Figma */}
                <View style={tw`p-2.5 rounded-full border border-white/10 bg-white/5`}>
                    {/* Botón del micrófono: 72x72 px exactos usando w-18 h-18 */}
                    <TouchableOpacity
                        style={tw`w-18 h-18 rounded-full items-center justify-center ${isRecording ? 'bg-red-500' : 'bg-[#4D8EFF]'
                            }`}
                        activeOpacity={0.8}
                    >
                        <MicrophoneIcon size={32} color={isRecording ? '#FFFFFF' : '#00285D'} />
                    </TouchableOpacity>
                </View>

                {/* Texto de estado (Blanco, centrado y limpio) */}
                <Text style={tw`text-white text-xl font-medium mt-4 tracking-wide text-center`}>
                    {isRecording ? 'Escuchando...' : 'Toca para registrar'}
                </Text>
            </View>

            {/* --- BOTÓN "GASTÉ ALGO RÁPIDO" --- */}
            <TouchableOpacity
                style={tw`w-full max-w-sm flex-row items-center justify-center py-4.5 px-6 rounded-[24px] border border-[#E2A766] bg-[#0D1522]/40`}
                activeOpacity={0.7}
            >
                {/* Icono de Rayo (BoltIcon) */}
                <BoltIcon size={24} color="#E2A766" style={tw`mr-2`} />

                <Text style={tw`text-[#E2A766] text-xl font-semibold tracking-wide`}>
                    Gasté algo rápido
                </Text>
            </TouchableOpacity>

        </View>
    );
}