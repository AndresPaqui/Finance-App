import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, ActivityIndicator, LayoutAnimation, Platform, UIManager, TextInput, Keyboard, Animated, BackHandler } from 'react-native';
import { XMarkIcon, CheckCircleIcon, ChevronUpIcon, ChevronDownIcon, PencilIcon } from 'react-native-heroicons/outline';
import tw from '../../../shared/lib/tw';
import { useFinanceStore } from '../../../core/state/useFinanceStore';
import { useFinanceSync } from '../../../shared/hooks/useFinanceSync';

import AmountDisplay from './AddTransactionModal/AmountDisplay';
import TransactionTypeToggle, { TransactionType } from './AddTransactionModal/TransactionTypeToggle';
import CategorySelector from './AddTransactionModal/CategorySelector';
import AntExpenseToggle from './AddTransactionModal/AntExpenseToggle';
import AccountSelector from './AddTransactionModal/AccountSelector';
import NumericKeyboard from './AddTransactionModal/NumericKeyboard';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

interface AddTransactionModalProps {
    visible: boolean;
    onClose: () => void;
}

export default function AddTransactionModal({ visible, onClose }: AddTransactionModalProps) {
    const cuentas = useFinanceStore((state) => state.cuentasList);
    const { ejecutarGastoVoz } = useFinanceSync();
    const scrollViewRef = useRef<ScrollView>(null);
    const descriptionInputRef = useRef<TextInput>(null);

    const [amountString, setAmountString] = useState('0');
    const [type, setType] = useState<TransactionType>('GASTO');
    const [categoriaNombre, setCategoriaNombre] = useState('Comida');
    const [descripcion, setDescripcion] = useState('');
    const [isAntExpense, setIsAntExpense] = useState(false);
    const [selectedAccountId, setSelectedAccountId] = useState(cuentas[0]?.id || '1');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
    const [isDescriptionFocused, setIsDescriptionFocused] = useState(false);

    // Animación de borde verde de 250ms para el campo de Descripción
    const descBorderAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(descBorderAnim, {
            toValue: isDescriptionFocused ? 1 : 0,
            duration: 250,
            useNativeDriver: false,
        }).start();
    }, [isDescriptionFocused]);

    const descBorderColor = descBorderAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['rgba(255, 255, 255, 0.10)', '#10B981'],
    });

    // Animación nativa (UI Thread) para la apertura / cierre de la Calculadora Numérica
    const keyboardAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.spring(keyboardAnim, {
            toValue: isKeyboardVisible ? 1 : 0,
            tension: 100,
            friction: 14,
            useNativeDriver: true,
        }).start();
    }, [isKeyboardVisible]);

    const keyboardTranslateY = keyboardAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [500, 0],
    });

    // Abrir teclado numérico y cerrar teclado de texto si está activo de forma síncrona
    const handleOpenKeyboard = useCallback(() => {
        Keyboard.dismiss();
        descriptionInputRef.current?.blur();
        setIsKeyboardVisible(true);
    }, []);

    const handleCloseKeyboard = useCallback(() => {
        setIsKeyboardVisible(false);
    }, []);

    // Manejo unificado de la tecla / gesto "Atrás" (Android Hardware Back & Modal Gesture)
    const handleBackPress = useCallback((): boolean => {
        if (isKeyboardVisible) {
            handleCloseKeyboard();
            return true; // Previene el cierre del modal
        }
        if (isDescriptionFocused || descriptionInputRef.current?.isFocused()) {
            Keyboard.dismiss();
            descriptionInputRef.current?.blur();
            setIsDescriptionFocused(false);
            return true; // Previene el cierre del modal
        }
        onClose();
        return false;
    }, [isKeyboardVisible, isDescriptionFocused, handleCloseKeyboard, onClose]);

    // Interceptación del botón/gesto "Atrás" físico (Android / Hardware Back)
    useEffect(() => {
        if (!visible) return;

        const subscription = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
        return () => subscription.remove();
    }, [visible, handleBackPress]);

    // Al enfocar la descripción, retraer la calculadora numérica si está abierta
    const handleFocusDescription = useCallback(() => {
        if (isKeyboardVisible) {
            setIsKeyboardVisible(false);
        }
    }, [isKeyboardVisible]);

    // Manejo de pulsación numérica
    const handleKeyPress = useCallback((key: string) => {
        if (key === '.') {
            setAmountString((prev) => (prev.includes('.') ? prev : prev + '.'));
            return;
        }

        setAmountString((prev) => {
            if (prev === '0') return key;
            if (prev.includes('.')) {
                const [, decimals] = prev.split('.');
                if (decimals && decimals.length >= 2) return prev;
            }
            if (prev.replace('.', '').length >= 8) return prev;
            return prev + key;
        });
    }, []);

    // Manejo de borrado
    const handleDelete = useCallback(() => {
        setAmountString((prev) => {
            if (prev.length <= 1) return '0';
            return prev.slice(0, -1);
        });
    }, []);

    // Confirmación y guardado en SQLite vía useFinanceSync
    const handleConfirm = useCallback(async () => {
        const monto = parseFloat(amountString);
        if (isNaN(monto) || monto <= 0) {
            return;
        }

        const cuentaId = selectedAccountId || cuentas[0]?.id;
        if (!cuentaId) return;

        setIsSubmitting(true);
        try {
            await ejecutarGastoVoz({
                monto,
                comision: 0,
                tipo: type,
                categoriaNombre,
                cuentaOrigenId: cuentaId,
                descripcion: descripcion.trim(),
                esHormiga: type === 'GASTO' && (isAntExpense || monto < 20.0),
            });

            setAmountString('0');
            setDescripcion('');
            setIsAntExpense(false);
            setIsKeyboardVisible(false);
            setIsSubmitting(false);
            onClose();
        } catch (error) {
            console.error('Error al registrar la transacción:', error);
            setIsSubmitting(false);
        }
    }, [amountString, selectedAccountId, cuentas, ejecutarGastoVoz, type, categoriaNombre, descripcion, isAntExpense, onClose]);

    const handleTypeChange = useCallback((newType: TransactionType) => {
        setType(newType);
        if (newType === 'INGRESO') {
            setCategoriaNombre('Sueldo');
        } else {
            setCategoriaNombre('Comida');
        }
    }, []);

    const handleCloseModal = useCallback(() => {
        Keyboard.dismiss();
        setIsKeyboardVisible(false);
        onClose();
    }, [onClose]);

    // Extracción del Botón de Confirmación para reutilizarlo
    const renderConfirmButton = () => (
        <TouchableOpacity
            onPress={handleConfirm}
            disabled={isSubmitting || !amountString || parseFloat(amountString) <= 0}
            activeOpacity={0.8}
            style={[
                tw`w-full py-4 rounded-2xl flex-row items-center justify-center gap-2 shadow-lg`,
                !amountString || parseFloat(amountString) <= 0
                    ? tw`bg-blue-300/30 opacity-50`
                    : tw`bg-[#93C5FD]`,
            ]}
        >
            {isSubmitting ? (
                <ActivityIndicator color="#0F172A" />
            ) : (
                <>
                    <CheckCircleIcon size={22} color="#0F172A" />
                    <Text style={tw`text-[#0F172A] text-base font-black tracking-wide`}>
                        Confirmar Registro
                    </Text>
                </>
            )}
        </TouchableOpacity>
    );

    return (
        <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={handleBackPress}>
            <View style={tw`flex-1 bg-[#030914] pt-8 relative`}>
                
                {/* Contenedor Único y Fluido con Scroll Continuo. keyboardShouldPersistTaps="handled" para evadir el doble tap */}
                <ScrollView
                    ref={scrollViewRef}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={[tw`px-5 pt-3 gap-4`, isKeyboardVisible ? tw`pb-96` : tw`pb-24`]}
                >
                    {/* Header Principal */}
                    <View style={tw`flex-row justify-between items-center mb-1`}>
                        <View>
                            <Text style={tw`text-textSecondary text-[11px] font-bold uppercase tracking-widest`}>
                                Transacción
                            </Text>
                            <Text style={tw`text-white text-2xl font-black tracking-tight`}>
                                Nuevo Registro
                            </Text>
                        </View>

                        {/* Botón X de Cierre */}
                        <TouchableOpacity
                            onPress={handleCloseModal}
                            activeOpacity={0.7}
                            style={tw`w-10 h-10 rounded-full bg-card/60 border border-white/10 items-center justify-center`}
                        >
                            <XMarkIcon size={20} color="#94A3B8" />
                        </TouchableOpacity>
                    </View>

                    {/* 1. Display de Monto (Presionable para enfocar teclado numérico con feedback de edición) */}
                    <AmountDisplay
                        amountString={amountString}
                        isEditing={isKeyboardVisible}
                        onPress={handleOpenKeyboard}
                    />

                    {/* 1.5 Campo de Descripción Opcional Neomórfico (Área Clicable Completa con Borde Animado Verde) */}
                    <AnimatedTouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => descriptionInputRef.current?.focus()}
                        style={[
                            tw`w-full bg-card/40 border-2 rounded-2xl px-4 py-3 flex-row items-center -mt-2 mb-1`,
                            { borderColor: descBorderColor }
                        ]}
                    >
                        <PencilIcon size={18} color={isDescriptionFocused ? '#10B981' : '#94A3B8'} style={tw`mr-3`} />
                        <TextInput
                            ref={descriptionInputRef}
                            value={descripcion}
                            onChangeText={setDescripcion}
                            onFocus={() => {
                                setIsDescriptionFocused(true);
                                handleFocusDescription();
                            }}
                            onBlur={() => setIsDescriptionFocused(false)}
                            placeholder="Añadir una descripción opcional..."
                            placeholderTextColor="#64748B"
                            style={tw`flex-1 text-white text-sm font-medium py-1`}
                            returnKeyType="done"
                            onSubmitEditing={() => Keyboard.dismiss()}
                        />
                        {descripcion.length > 0 && (
                            <TouchableOpacity onPress={() => setDescripcion('')} activeOpacity={0.7}>
                                <XMarkIcon size={16} color="#64748B" />
                            </TouchableOpacity>
                        )}
                    </AnimatedTouchableOpacity>

                    {/* 2. Toggle Gasto / Ingreso */}
                    <TransactionTypeToggle type={type} onChangeType={handleTypeChange} />

                    {/* 3. Selector de Categoría Dinámico por Tipo */}
                    <CategorySelector
                        type={type}
                        selectedCategoryNombre={categoriaNombre}
                        onSelectCategory={setCategoriaNombre}
                    />

                    {/* 4. Opción Gasto Hormiga (Solo si es Gasto) */}
                    {type === 'GASTO' && (
                        <AntExpenseToggle
                            value={isAntExpense}
                            onValueChange={setIsAntExpense}
                        />
                    )}

                    {/* 5. Selector de Cuenta de Pago */}
                    <AccountSelector
                        type={type}
                        selectedAccountId={selectedAccountId || cuentas[0]?.id || ''}
                        onSelectAccount={setSelectedAccountId}
                    />
                </ScrollView>

                {/* --- BARRA INFERIOR FIJA CON BOTÓN CONFIRMAR (SI EL TECLADO NUMÉRICO ESTÁ OCULTO) --- */}
                {!isKeyboardVisible && (
                    <View style={tw`absolute bottom-0 left-0 right-0 bg-[#030914] px-5 py-4 border-t border-white/10 z-20`}>
                        {renderConfirmButton()}
                    </View>
                )}

                {/* --- BOTÓN CIRCULAR TRANSLÚCIDO FLOTANTE INFERIOR (FLECHA HACIA ARRIBA ^) --- */}
                {!isKeyboardVisible && (
                    <TouchableOpacity
                        onPress={handleOpenKeyboard}
                        activeOpacity={0.7}
                        style={tw`absolute bottom-20 right-5 w-12 h-12 rounded-full bg-card/90 border border-white/20 items-center justify-center shadow-lg z-30`}
                    >
                        <ChevronUpIcon size={24} color="#94A3B8" />
                    </TouchableOpacity>
                )}

                {/* --- TECLADO NUMÉRICO STICKY FLOTANTE (Pre-montado en Hilo Nativo con translateY) --- */}
                <Animated.View
                    pointerEvents={isKeyboardVisible ? 'auto' : 'none'}
                    style={[
                        tw`absolute bottom-0 left-0 right-0 bg-[#0F172A] border-t border-white/10 rounded-t-3xl p-5 pb-8 shadow-2xl z-40`,
                        { transform: [{ translateY: keyboardTranslateY }] },
                    ]}
                >
                    {/* Barra Superior del Teclado */}
                    <View style={tw`flex-row justify-between items-center mb-3 px-1`}>
                        {/* Botón Circular Translúcido (Flecha hacia abajo v) para cerrar teclado */}
                        <TouchableOpacity
                            onPress={handleCloseKeyboard}
                            activeOpacity={0.7}
                            style={tw`w-9 h-9 rounded-full bg-card/80 border border-white/15 items-center justify-center`}
                        >
                            <ChevronDownIcon size={18} color="#94A3B8" />
                        </TouchableOpacity>

                        <Text style={tw`text-textSecondary text-xs font-semibold uppercase tracking-widest`}>
                            Ingresar Monto
                        </Text>

                        {/* Botón "Listo" */}
                        <TouchableOpacity
                            onPress={handleCloseKeyboard}
                            activeOpacity={0.7}
                            style={tw`px-3 py-1.5 rounded-xl bg-primaryBlue/10 border border-primaryBlue/20`}
                        >
                            <Text style={tw`text-primaryBlue text-xs font-bold`}>Listo</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Componente Atómico del Teclado */}
                    <NumericKeyboard
                        onKeyPress={handleKeyPress}
                        onDelete={handleDelete}
                    />

                    {/* Botón de Confirmación Integrado dentro del Teclado */}
                    <View style={tw`mt-4`}>
                        {renderConfirmButton()}
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
}
