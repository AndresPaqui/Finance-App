// src/features/dashboard/components/WalletHeader.tsx

import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { BellIcon, WalletIcon, CreditCardIcon } from 'react-native-heroicons/outline';
import tw from 'twrnc';

export default function WalletHeader() {
    const saldoTotal = 426.82;

    const cuentas = [
        { id: '1', nombre: 'Efectivo', saldo: 20, tipo: 'CASH', color: 'bg-emerald-500/10 border-emerald-500/30' },
        { id: '2', nombre: 'Débito', saldo: 306, tipo: 'DEBIT', color: 'bg-blue-500/10 border-blue-500/30' },
        { id: '3', nombre: 'Crédito', saldo: 100, tipo: 'CREDIT', color: 'bg-purple-500/10 border-purple-500/30' },
    ];

    return (
        <View style={tw`bg-zinc-950 pt-12 pb-6 px-4 border-b border-zinc-900`}>
            <View style={tw`flex-row justify-between items-center mb-6`}>
                <View>
                    <Text style={tw`text-zinc-500 text-sm font-medium`}>Bienvenido de vuelta</Text>
                    <Text style={tw`text-white text-xl font-bold tracking-tight`}>Hola Andrés 👋</Text>
                </View>
                <TouchableOpacity style={tw`p-2 bg-zinc-900 rounded-full border border-zinc-800`}>
                    <BellIcon size={22} color="#CCFF00" />
                </TouchableOpacity>
            </View>

            <View style={tw`mb-6`}>
                <Text style={tw`text-zinc-400 text-xs font-semibold uppercase tracking-widest mb-1`}>
                    Efectivo libre disponible
                </Text>
                <Text style={tw`text-[#CCFF00] text-4xl font-black tracking-tight`}>
                    ${saldoTotal.toFixed(2)}
                </Text>
            </View>

            <Text style={tw`text-white text-sm font-semibold mb-3 px-1`}>Mis Cuentas</Text>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 4 }}
                style={tw`flex-row`}
            >
                {cuentas.map((cuenta) => (
                    <TouchableOpacity
                        key={cuenta.id}
                        style={tw`w-40 mr-3 p-4 rounded-2xl border ${cuenta.color} bg-zinc-900/50`}
                    >
                        <View style={tw`flex-row justify-between items-center mb-4`}>
                            <View style={tw`p-2 bg-zinc-900 rounded-xl`}>
                                <WalletIcon size={20} color={cuenta.tipo === 'CASH' ? '#10b981' : cuenta.tipo === 'DEBIT' ? '#3b82f6' : '#a855f7'} />
                            </View>
                            <Text style={tw`text-zinc-500 text-xs font-bold`}>USD</Text>
                        </View>
                        <Text style={tw`text-zinc-400 text-xs font-medium`}>{cuenta.nombre}</Text>
                        <Text style={tw`text-white text-lg font-bold tracking-tight mt-0.5`}>
                            ${cuenta.saldo.toFixed(2)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}