import React, { useState, useCallback, useRef } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    ScrollView,
    TextInput,
    ActivityIndicator,
    Keyboard,
} from 'react-native';
import { XMarkIcon, CheckCircleIcon } from 'react-native-heroicons/outline';
import tw from '../../../../shared/lib/tw';
import { WALLET_PRESETS, getPresetById, AccountType, WalletPreset } from '../../../../core/constants/walletPresets';
import { safeHaptics } from '../../../../shared/lib/haptics';
import * as Crypto from 'expo-crypto';
import { LinearGradient } from 'expo-linear-gradient';
import { useFinanceSync } from '../../../../shared/hooks/useFinanceSync';

interface AddWalletModalProps {
    visible: boolean;
    onClose: () => void;
}

export default function AddWalletModal({ visible, onClose }: AddWalletModalProps) {
    const { crearCuenta } = useFinanceSync();
    const scrollViewRef = useRef<ScrollView>(null);

    const [selectedPresetId, setSelectedPresetId] = useState<string>(WALLET_PRESETS[0].id);
    const [nombre, setNombre] = useState<string>(WALLET_PRESETS[0].nombre);
    
    // Almacenamos montos como strings para inputs crudos, luego parseamos
    const [saldoActualStr, setSaldoActualStr] = useState<string>('');
    const [limiteCreditoStr, setLimiteCreditoStr] = useState<string>('');
    
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Obtener el preset actual para la lógica dinámica
    const activePreset = getPresetById(selectedPresetId);
    const isCreditCard = activePreset.tipo === 'TARJETA_CREDITO';

    // Al seleccionar un preset, prellenar el nombre si el usuario no lo ha cambiado fuertemente
    const handleSelectPreset = useCallback((preset: WalletPreset) => {
        safeHaptics.selection();
        setSelectedPresetId(preset.id);
        setNombre(preset.nombre);
        
        // Limpiar límite de crédito si no es tarjeta
        if (preset.tipo !== 'TARJETA_CREDITO') {
            setLimiteCreditoStr('');
        }
    }, []);

    const handleCloseModal = useCallback(() => {
        safeHaptics.impactLight();
        Keyboard.dismiss();
        onClose();
        // Opcional: resetear estado
        setTimeout(() => {
            setSelectedPresetId(WALLET_PRESETS[0].id);
            setNombre(WALLET_PRESETS[0].nombre);
            setSaldoActualStr('');
            setLimiteCreditoStr('');
        }, 300);
    }, [onClose]);

    const handleConfirm = useCallback(async () => {
        safeHaptics.notificationSuccess();
        Keyboard.dismiss();
        
        if (!nombre.trim()) return;

        const saldo = parseFloat(saldoActualStr) || 0;
        const limite = parseFloat(limiteCreditoStr) || null;

        setIsSubmitting(true);

        try {
            const newId = Crypto.randomUUID();
            
            await crearCuenta({
                id: newId,
                nombre: nombre.trim(),
                tipo: activePreset.tipo,
                saldoActual: saldo,
                limiteCredito: activePreset.tipo === 'TARJETA_CREDITO' ? limite || 0 : undefined,
                presetId: activePreset.id,
                colorGradienteInicio: activePreset.gradientColors[0],
                colorGradienteFin: activePreset.gradientColors[1]
            });

            setIsSubmitting(false);
            handleCloseModal();
        } catch (error) {
            console.error('Error creando wallet:', error);
            setIsSubmitting(false);
        }
    }, [nombre, saldoActualStr, limiteCreditoStr, activePreset, crearCuenta, handleCloseModal]);

    const textColor = activePreset.textColor || (activePreset.darkText ? '#1F2937' : undefined);
    const mainTextColor = textColor || '#FFFFFF';
    const headerTextColor = textColor ? `${textColor}CC` : 'rgba(255, 255, 255, 0.8)';

    const isButtonDisabled = isSubmitting || !nombre.trim() || saldoActualStr === '';

    return (
        <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={handleCloseModal}>
            <View style={tw`flex-1 bg-[#030914] pt-8 relative`}>
                
                <ScrollView
                    ref={scrollViewRef}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={tw`px-5 pt-3 pb-24 gap-6`}
                >
                    {/* Header Principal */}
                    <View style={tw`flex-row justify-between items-center mb-1`}>
                        <View>
                            <Text style={tw`text-textSecondary text-[11px] font-bold uppercase tracking-widest`}>
                                Billetera
                            </Text>
                            <Text style={tw`text-white text-2xl font-black tracking-tight`}>
                                Nueva Cuenta
                            </Text>
                        </View>
                        <TouchableOpacity
                            onPress={handleCloseModal}
                            activeOpacity={0.7}
                            style={tw`w-10 h-10 rounded-full bg-card/60 border border-white/10 items-center justify-center`}
                        >
                            <XMarkIcon size={20} color="#94A3B8" />
                        </TouchableOpacity>
                    </View>

                    {/* Previsualización en Tiempo Real */}
                    <View style={tw`w-full items-center`}>
                        <LinearGradient
                            colors={activePreset.gradientColors}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={tw`w-full max-w-[320px] p-5 rounded-3xl border border-white/10 justify-between h-44 shadow-xl relative overflow-hidden`}
                        >
                            <View style={tw`flex-row justify-between items-start`}>
                                <View style={tw`flex-1 pr-2`}>
                                    <Text style={[tw`text-[11px] font-bold tracking-widest uppercase`, { color: headerTextColor }]}>
                                        {activePreset.tipo}
                                    </Text>
                                    <Text style={[tw`text-xl font-extrabold tracking-tight mt-0.5`, { color: mainTextColor }]} numberOfLines={1}>
                                        {nombre || 'Nombre de la cuenta'}
                                    </Text>
                                </View>
                            </View>

                            <View style={tw`mt-auto`}>
                                <Text style={[tw`text-xs font-medium`, { color: headerTextColor }]}>
                                    {isCreditCard ? 'Deuda Actual' : 'Saldo Actual'}
                                </Text>
                                <Text style={[tw`text-3xl font-black tracking-tight mt-0.5`, { color: mainTextColor }]}>
                                    ${parseFloat(saldoActualStr || '0').toFixed(2)}
                                </Text>
                            </View>
                        </LinearGradient>
                    </View>

                    {/* Presets Horizontal Scroll */}
                    <View>
                        <Text style={tw`text-textSecondary text-xs font-bold uppercase tracking-widest mb-3`}>
                            Selecciona una Institución
                        </Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={tw`gap-3`}>
                            {WALLET_PRESETS.map((preset) => {
                                // Excluir 'custom' por solicitud del usuario
                                if (preset.id === 'custom') return null;
                                
                                const isSelected = preset.id === selectedPresetId;
                                return (
                                    <TouchableOpacity
                                        key={preset.id}
                                        onPress={() => handleSelectPreset(preset)}
                                        activeOpacity={0.8}
                                    >
                                        <LinearGradient
                                            colors={preset.gradientColors}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 1 }}
                                            style={[
                                                tw`w-24 h-24 rounded-2xl p-2 justify-end border-2`,
                                                isSelected ? tw`border-white` : tw`border-transparent opacity-60`,
                                            ]}
                                        >
                                            <Text 
                                                style={[
                                                    tw`text-[10px] font-black text-center`, 
                                                    { color: preset.textColor || (preset.darkText ? '#1F2937' : '#FFFFFF') }
                                                ]}
                                                numberOfLines={2}
                                            >
                                                {preset.nombre}
                                            </Text>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>
                    </View>

                    {/* Inputs */}
                    <View style={tw`gap-4`}>
                        <View>
                            <Text style={tw`text-textSecondary text-xs font-bold uppercase tracking-widest mb-2`}>
                                Nombre de la Cuenta
                            </Text>
                            <TextInput
                                value={nombre}
                                onChangeText={setNombre}
                                placeholder="Ej. Ahorros Pichincha"
                                placeholderTextColor="#64748B"
                                style={tw`w-full bg-card/40 border border-white/10 rounded-2xl px-4 py-4 text-white text-base font-medium`}
                            />
                        </View>

                        <View>
                            <Text style={tw`text-textSecondary text-xs font-bold uppercase tracking-widest mb-2`}>
                                {isCreditCard ? 'Cupo Utilizado / Deuda Actual ($)' : 'Saldo Actual ($)'}
                            </Text>
                            <TextInput
                                value={saldoActualStr}
                                onChangeText={setSaldoActualStr}
                                keyboardType="numeric"
                                placeholder="0.00"
                                placeholderTextColor="#64748B"
                                style={tw`w-full bg-card/40 border border-white/10 rounded-2xl px-4 py-4 text-white text-base font-medium`}
                            />
                        </View>

                        {isCreditCard && (
                            <View>
                                <Text style={tw`text-textSecondary text-xs font-bold uppercase tracking-widest mb-2`}>
                                    Límite de Crédito / Cupo Total ($)
                                </Text>
                                <TextInput
                                    value={limiteCreditoStr}
                                    onChangeText={setLimiteCreditoStr}
                                    keyboardType="numeric"
                                    placeholder="Ej. 1500.00"
                                    placeholderTextColor="#64748B"
                                    style={tw`w-full bg-card/40 border border-white/10 rounded-2xl px-4 py-4 text-white text-base font-medium`}
                                />
                            </View>
                        )}
                    </View>
                </ScrollView>

                {/* Footer Botón Confirmar */}
                <View style={tw`absolute bottom-0 left-0 right-0 bg-[#030914] px-5 py-4 border-t border-white/10`}>
                    <TouchableOpacity
                        onPress={handleConfirm}
                        disabled={isButtonDisabled}
                        activeOpacity={0.8}
                        style={[
                            tw`w-full py-4 rounded-2xl flex-row items-center justify-center gap-2 shadow-lg`,
                            isButtonDisabled ? tw`bg-blue-300/30 opacity-50` : tw`bg-[#93C5FD]`,
                        ]}
                    >
                        {isSubmitting ? (
                            <ActivityIndicator color="#0F172A" />
                        ) : (
                            <>
                                <CheckCircleIcon size={22} color="#0F172A" />
                                <Text style={tw`text-[#0F172A] text-base font-black tracking-wide`}>
                                    Crear Billetera
                                </Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>

            </View>
        </Modal>
    );
}
