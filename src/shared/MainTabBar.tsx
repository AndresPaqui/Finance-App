// src/features/dashboard/components/MainTabBar.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import {
    HomeIcon as HomeSolid,
    CreditCardIcon as CardSolid,
    FlagIcon as FlagSolid,
    UserIcon as UserSolid,
    PlusIcon
} from 'react-native-heroicons/solid';
import {
    HomeIcon as HomeOutline,
    CreditCardIcon as CardOutline,
    FlagIcon as FlagOutline,
    UserIcon as UserOutline
} from 'react-native-heroicons/outline';
import tw from './lib/tw';

export type ActiveTab = 'Inicio' | 'Movimientos' | 'Metas' | 'Perfil';

interface MainTabBarProps {
    currentActiveTab: ActiveTab;
    onTabChange: (tab: ActiveTab) => void;
    onRegistrarPress: () => void;
}

export default function MainTabBar({ currentActiveTab, onTabChange, onRegistrarPress }: MainTabBarProps) {
    // Colores basados estrictamente en tu Figma
    const activeColor = '#ADC6FF';    // Azul claro suave para la pestaña seleccionada
    const inactiveColor = '#8C909F';  // Gris tenue para las inactivas

    const TabItem = ({ name, iconOutline: IconOutline, iconSolid: IconSolid, label }: {
        name: ActiveTab;
        iconOutline: any;
        iconSolid: any;
        label: string
    }) => {
        const isActive = currentActiveTab === name;
        const Icon = isActive ? IconSolid : IconOutline;

        return (
            <TouchableOpacity
                style={tw`flex-1 items-center justify-center h-full pt-1`}
                onPress={() => onTabChange(name)}
                activeOpacity={0.7}
            >
                <Icon size={24} color={isActive ? activeColor : inactiveColor} />
                <Text style={[
                    // Reducimos ligeramente el tamaño y aplicamos tracking-tighter universal para evitar cortes
                    tw`text-[10.5px] mt-1.5 font-normal tracking-tight`,
                    // Ajuste extra específico para Movimientos si es necesario, pero el full-width ya ayuda
                    // name === 'Movimientos' ? tw`tracking-tighter` : null,
                    { color: isActive ? activeColor : inactiveColor, fontWeight: isActive ? '600' : '400' }
                ]}>
                    {label}
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        // CONTENEDOR PRINCIPAL: Anclado al fondo del safe area, full width.
        <View style={tw`absolute bottom-0 left-0 right-0 z-50`}>

            <View style={tw`absolute bottom-0 left-0 right-0 h-24 bg-background rounded-t-[30px]`}>{/* Fondo sólido para bloquear el scroll */}
                {/* BARRA PRINCIPAL: Full width, fondo sólido, redondeado superior */}
                <View style={tw`w-full h-24 bg-[#1C2B3C]/30 border-t border-white/5 rounded-t-[30px] flex-row items-center px-4 shadow-xl`}>

                    {/* Pestaña: Inicio */}
                    <TabItem name="Inicio" iconOutline={HomeOutline} iconSolid={HomeSolid} label="Inicio" />

                    {/* Pestaña: Movimientos (Ahora tiene más espacio horizontal) */}
                    <TabItem name="Movimientos" iconOutline={CardOutline} iconSolid={CardSolid} label="Movimientos" />

                    {/* Espacio Central: Botón Flotante "Registrar" */}
                    <View style={tw`flex-1 items-center justify-center relative h-full`}>
                        <TouchableOpacity
                            style={[tw`absolute items-center justify-center`, { top: -38 }]}
                            onPress={onRegistrarPress}
                            activeOpacity={0.8}
                        >
                            <View style={tw`p-2 rounded-full bg-background`}>

                                {/* Botón Circular Azul Intenso */}
                                <View style={tw`w-14 h-14 rounded-full bg-[#4D8EFF] items-center justify-center shadow-lg`}>
                                    <PlusIcon size={30} color="#00285D" />
                                </View>

                            </View>

                            {/* Texto del Botón Central */}
                            <Text style={tw`text-[#C2C6D6] text-[11px] font-medium mt-0.5 tracking-wide`}>
                                Registrar
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Pestaña: Metas */}
                    <TabItem name="Metas" iconOutline={FlagOutline} iconSolid={FlagSolid} label="Metas" />

                    {/* Pestaña: Perfil */}
                    <TabItem name="Perfil" iconOutline={UserOutline} iconSolid={UserSolid} label="Perfil" />

                </View>

            </View>

        </View>
    );
}