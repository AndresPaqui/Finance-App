// src/features/profile/components/ProfileScreen.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, Switch } from 'react-native';
import {
    BellIcon,
    FingerPrintIcon,
    LockClosedIcon,
    ArrowsPointingOutIcon,
    CpuChipIcon,
    BanknotesIcon,
    Squares2X2Icon,
    ArrowRightOnRectangleIcon
} from 'react-native-heroicons/outline';
import { ChevronRightIcon } from 'react-native-heroicons/solid';
import tw from '../../../../shared/lib/tw';

export default function ProfileScreen() {
    // Estados para los switches (Toggles)
    const [bubbleUnlock, setBubbleUnlock] = useState(true);
    const [biometricAccess, setBiometricAccess] = useState(true);
    const [backgroundBubble, setBackgroundBubble] = useState(false);

    // Colores de la app para los Switches
    const switchTrackActive = '#4D8EFF';
    const switchTrackInactive = '#1E293B';
    const switchThumb = '#FFFFFF';

    // Subcomponente reutilizable para las filas de configuración
    const SettingRow = ({ icon: Icon, title, rightElement, hasBorder = true }: any) => (
        <View style={tw`flex-row items-center justify-between py-4 px-5 ${hasBorder ? 'border-b border-white/5' : ''}`}>
            <View style={tw`flex-row items-center flex-1 pr-4`}>
                <Icon size={22} color="#C2C6D6" style={tw`mr-3`} />
                <Text style={tw`text-white text-[15px] font-medium tracking-wide`}>{title}</Text>
            </View>
            <View>
                {rightElement}
            </View>
        </View>
    );

    return (
        <View
            style={tw` px-5 pt-12`} // pb-32 asegura que no choque con la TabBar
        >
            {/* --- HEADER --- */}
            <View style={tw`flex-row justify-between items-center mb-8`}>
                <View style={tw`flex-row items-center`}>
                    <Text style={tw`text-white text-3xl font-bold tracking-wide`}>Perfil</Text>
                </View>
                <TouchableOpacity style={tw`p-2 rounded-full border border-zinc-800`}>{/* Estilos al tarde un toque a la campana */}
                    <BellIcon size={22} color="#C2C6D6" />
                </TouchableOpacity>
            </View>

            {/* --- INFO DEL USUARIO --- */}
            <View style={tw`items-center mb-10`}>
                {/* Avatar con doble borde (anillo exterior) */}
                <View style={tw`p-1 rounded-full bg-[#051424] border border-white/10 mb-4`}>
                    <Image
                        source={{ uri: 'https://i.pravatar.cc/150?img=11' }} // Placeholder de imagen
                        style={tw`w-24 h-24 rounded-full`}
                    />
                </View>
                <Text style={tw`text-white text-3xl font-bold tracking-wide mb-1`}>Andrés</Text>
                <Text style={tw`text-[#C2C6D6] text-sm font-normal`}>Universidad de las Américas</Text>
            </View>

            {/* --- SECCIÓN: SEGURIDAD --- */}
            <Text style={tw`text-[#8C909F] text-xs font-bold tracking-widest uppercase ml-2 mb-3`}>
                Seguridad (Doble Biometría)
            </Text>
            <View style={tw`bg-[#1C2B3C]/30 border border-white/5 rounded-[24px] mb-6 overflow-hidden`}>
                <SettingRow
                    icon={FingerPrintIcon}
                    title="Desbloqueo de Burbuja Flotante"
                    rightElement={
                        <Switch
                            value={bubbleUnlock}
                            onValueChange={setBubbleUnlock}
                            trackColor={{ false: switchTrackInactive, true: switchTrackActive }}
                            thumbColor={switchThumb}
                        />
                    }
                />
                <SettingRow
                    icon={LockClosedIcon}
                    title="Acceso Total con Biometría"
                    hasBorder={false}
                    rightElement={
                        <Switch
                            value={biometricAccess}
                            onValueChange={setBiometricAccess}
                            trackColor={{ false: switchTrackInactive, true: switchTrackActive }}
                            thumbColor={switchThumb}
                        />
                    }
                />
            </View>

            {/* --- SECCIÓN: LA BURBUJA INTELIGENTE --- */}
            <Text style={tw`text-[#8C909F] text-xs font-bold tracking-widest uppercase ml-2 mb-3`}>
                La Burbuja Inteligente
            </Text>
            <View style={tw`bg-[#1C2B3C]/30 border border-white/5 rounded-[24px] mb-6 overflow-hidden`}>
                <SettingRow
                    icon={ArrowsPointingOutIcon}
                    title="Activar Burbuja en Segundo Plano"
                    rightElement={
                        <Switch
                            value={backgroundBubble}
                            onValueChange={setBackgroundBubble}
                            trackColor={{ false: switchTrackInactive, true: switchTrackActive }}
                            thumbColor={switchThumb}
                        />
                    }
                />
                <SettingRow
                    icon={CpuChipIcon}
                    title="Motor de Reconocimiento"
                    hasBorder={false}
                    rightElement={
                        <View style={tw`flex-row items-center justify-between`}>
                            <Text style={tw`text-[#8C909F] text-sm mr-1 text-right max-w-[110px]`}>IA Local (Gama Alta)</Text>
                            <ChevronRightIcon size={16} color="#8C909F" />
                        </View>
                    }
                />
            </View>

            {/* --- SECCIÓN: PREFERENCIAS --- */}
            <Text style={tw`text-[#8C909F] text-xs font-bold tracking-widest uppercase ml-2 mb-3`}>
                Preferencias
            </Text>
            <View style={tw`bg-[#1C2B3C]/30 border border-white/5 rounded-[24px] mb-8 overflow-hidden`}>
                <SettingRow
                    icon={BanknotesIcon}
                    title="Moneda Predeterminada"
                    rightElement={
                        <View style={tw`flex-row items-center`}>
                            <Text style={tw`text-[#8C909F] text-sm mr-1`}>USD ($)</Text>
                            <ChevronRightIcon size={16} color="#8C909F" />
                        </View>
                    }
                />
                <SettingRow
                    icon={Squares2X2Icon}
                    title="Categorías Personalizadas"
                    hasBorder={false}
                    rightElement={<ChevronRightIcon size={16} color="#8C909F" />}
                />
            </View>

            {/* --- BOTÓN CERRAR SESIÓN --- */}
            <TouchableOpacity
                style={tw`flex-row items-center justify-center border border-white/5 rounded-2xl py-4 mb-4`}
                activeOpacity={0.6}
            >
                <ArrowRightOnRectangleIcon size={20} color="#FF8A8A" style={tw`mr-2`} />
                <Text style={tw`text-[#FF8A8A] text-[15px] font-medium tracking-wide`}>Cerrar Sesión</Text>
            </TouchableOpacity>

        </View>
    );
}