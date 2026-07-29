// src/features/transactions/components/AddTransactionModal/AccountSelector.tsx

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList } from 'react-native';
import { ChevronDownIcon, BuildingLibraryIcon, CreditCardIcon, BanknotesIcon, CheckIcon } from 'react-native-heroicons/outline';
import tw from '../../../../shared/lib/tw';
import { useFinanceStore, AccountBalance } from '../../../../core/state/useFinanceStore';
import { NeoTheme } from '../../../../core/theme/colors';

interface AccountSelectorProps {
    type?: 'GASTO' | 'INGRESO';
    selectedAccountId: string;
    onSelectAccount: (accountId: string) => void;
}

function getAccountIcon(tipo: string) {
    switch (tipo) {
        case 'BANCO':
            return <BuildingLibraryIcon size={20} color={NeoTheme.colors.successMint} />;
        case 'TARJETA_CREDITO':
            return <CreditCardIcon size={20} color={NeoTheme.colors.warningOrange} />;
        default:
            return <BanknotesIcon size={20} color={NeoTheme.colors.primaryBlue} />;
    }
}

function getAccountSubtitle(cuenta: AccountBalance) {
    const tipoTexto = cuenta.tipo === 'BANCO' ? 'Débito' : cuenta.tipo === 'TARJETA_CREDITO' ? 'Crédito' : 'Efectivo';
    return `${tipoTexto} • $${cuenta.saldoActual.toFixed(2)}`;
}

function AccountSelectorComponent({ type = 'GASTO', selectedAccountId, onSelectAccount }: AccountSelectorProps) {
    const cuentas = useFinanceStore((state) => state.cuentasList);
    const [isPickerOpen, setIsPickerOpen] = useState(false);

    const cuentaSeleccionada = cuentas.find((c) => c.id === selectedAccountId) || cuentas[0] || {
        id: 'default',
        nombre: 'Seleccionar Cuenta',
        tipo: 'EFECTIVO',
        saldoActual: 0,
    };

    const labelHeader = type === 'INGRESO' ? 'Cuenta de Ingreso' : 'Cuenta de Pago';

    return (
        <View style={tw`w-full mb-4`}>
            {/* Label */}
            <Text style={tw`text-textSecondary text-xs font-semibold uppercase tracking-widest mb-2 px-1`}>
                {labelHeader}
            </Text>

            {/* Tarjeta de Cuenta Seleccionada */}
            <TouchableOpacity
                onPress={() => setIsPickerOpen(true)}
                activeOpacity={0.7}
                style={tw`flex-row items-center justify-between bg-card/40 border border-white/5 rounded-2xl p-4`}
            >
                <View style={tw`flex-row items-center flex-1`}>
                    {/* Badge de Ícono */}
                    <View style={tw`w-10 h-10 rounded-xl bg-card border border-white/10 items-center justify-center mr-3`}>
                        {getAccountIcon(cuentaSeleccionada.tipo)}
                    </View>

                    {/* Textos */}
                    <View style={tw`flex-1 pr-2`}>
                        <Text style={tw`text-white text-base font-semibold tracking-wide`} numberOfLines={1}>
                            {cuentaSeleccionada.nombre}
                        </Text>
                        <Text style={tw`text-textSecondary text-xs mt-0.5`}>
                            {getAccountSubtitle(cuentaSeleccionada)}
                        </Text>
                    </View>
                </View>

                {/* Flecha Desplegable */}
                <ChevronDownIcon size={18} color="#94A3B8" />
            </TouchableOpacity>

            {/* Modal Selector de Cuentas */}
            <Modal visible={isPickerOpen} transparent animationType="fade" onRequestClose={() => setIsPickerOpen(false)}>
                <TouchableOpacity
                    style={tw`flex-1 bg-black/70 justify-end`}
                    activeOpacity={1}
                    onPress={() => setIsPickerOpen(false)}
                >
                    <View style={tw`bg-background border-t border-white/10 rounded-t-3xl p-5 max-h-96`}>
                        <Text style={tw`text-white text-lg font-bold mb-4`}>Seleccionar Cuenta de Pago</Text>

                        <FlatList
                            data={cuentas}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => {
                                const isSelected = item.id === cuentaSeleccionada.id;
                                return (
                                    <TouchableOpacity
                                        onPress={() => {
                                            onSelectAccount(item.id);
                                            setIsPickerOpen(false);
                                        }}
                                        activeOpacity={0.7}
                                        style={[
                                            tw`flex-row items-center justify-between p-3.5 rounded-2xl mb-2 border`,
                                            isSelected ? tw`bg-primaryBlue/10 border-primaryBlue` : tw`bg-card/40 border-white/5`,
                                        ]}
                                    >
                                        <View style={tw`flex-row items-center flex-1`}>
                                            <View style={tw`w-9 h-9 rounded-xl bg-card border border-white/10 items-center justify-center mr-3`}>
                                                {getAccountIcon(item.tipo)}
                                            </View>
                                            <View style={tw`flex-1`}>
                                                <Text style={tw`text-white text-sm font-semibold`}>{item.nombre}</Text>
                                                <Text style={tw`text-textSecondary text-xs`}>{getAccountSubtitle(item)}</Text>
                                            </View>
                                        </View>
                                        {isSelected && <CheckIcon size={20} color={NeoTheme.colors.primaryBlue} />}
                                    </TouchableOpacity>
                                );
                            }}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}

export default React.memo(AccountSelectorComponent);
