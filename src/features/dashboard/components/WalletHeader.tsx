// src/features/dashboard/components/WalletHeader.tsx

import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { BellIcon, WalletIcon, CreditCardIcon, BanknotesIcon } from 'react-native-heroicons/outline';
import tw from "../../../shared/lib/tw";
import { LinearGradient } from 'expo-linear-gradient';

//Calcular la dimension de la pantalla
const CARD_WIDTH = Dimensions.get('window').width * 0.85;

export default function WalletHeader() {
    const saldoTotal = 426.82;

    const cuentas = [
        { id: '1', nombre: 'Efectivo', saldo: 20, tipo: 'CASH', color: 'border-emerald-500/30', colorIcon: 'text-[#4EDEA3]', bg: 'bg-[#00A572]/20', gradient: ['#065F46', '#022C22'] as const },
        { id: '2', nombre: 'Débito', saldo: 306, tipo: 'DEBIT', color: 'border-blue-500/30', colorIcon: 'text-[#4D8EFF]', bg: 'bg-[#4D8EFF]/20', gradient: ['#1E3A8A', '#172554'] as const },
        { id: '3', nombre: 'Crédito', saldo: 100, tipo: 'CREDIT', color: 'border-orange-500/30', colorIcon: 'text-[#CA8100]', bg: 'bg-[#CA8100]/20', gradient: ['#CA8100', '#431407'] as const },
    ];

    return (
        <View style={tw` bg-background  pt-12 pb-6 px-4 border-b border-zinc-900`}>
            <View style={tw`flex-row justify-between items-center mb-6`}>
                <View>
                    <Text style={tw`text-zinc-500 text-sm font-medium`}>Bienvenido de vuelta</Text>
                    <Text style={tw`text-slate-300 text-xl font-bold tracking-tight`}>Hola Jacob 👋</Text>
                </View>
                <TouchableOpacity style={tw`p-2 rounded-full border border-zinc-800`}>
                    <BellIcon size={22} color="#CCFF00" />
                </TouchableOpacity>
            </View>

            <View style={tw`mb-6`}>
                <Text style={tw`text-zinc-400 text-xs font-semibold uppercase tracking-widest mb-1`}>
                    Efectivo libre disponible
                </Text>
                <Text style={tw`text-sky-100 text-4xl font-black tracking-tight`}>
                    ${saldoTotal.toFixed(2)}
                </Text>
            </View>

            <Text style={tw`text-white text-sm font-semibold mb-3 px-1`}>Mis Cuentas</Text>



            <View style={tw`flex-row mb-3 justify-between  `}>
                {cuentas.map((cuenta) => (
                    <View
                        key={cuenta.id}
                        style={tw` flex-row items-center py-1 ${cuenta.bg} rounded-full mx-1`}
                    >
                        <View style={tw`pr-2 pl-4  `}>
                            <Text>
                                {
                                    cuenta.tipo === 'CASH' ? '💵' : cuenta.tipo === 'DEBIT' ? '💳' : '💳'
                                }
                            </Text>
                        </View>
                        <View style={tw`pr-4 pl-2`}>
                            <Text style={tw` ${cuenta.colorIcon} font-semibold text-xs`}>{cuenta.nombre}</Text>
                        </View>

                    </View>
                ))}


            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 4 }}
                style={[tw`flex-row`]}
            >
                {cuentas.map((cuenta) => (
                    <TouchableOpacity
                        key={cuenta.id}
                        style={{ width: CARD_WIDTH }}
                    >
                        <LinearGradient
                            colors={cuenta.gradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={tw`p-4 border ${cuenta.color} rounded-2xl  mr-3`}
                        >
                            <View style={tw`flex-row justify-between items-center mb-4`}>
                                <View style={tw`p-2 bg-zinc-900 rounded-xl`}>
                                    <WalletIcon size={20} color={cuenta.tipo === 'CASH' ? '#10b981' : cuenta.tipo === 'DEBIT' ? '#3b82f6' : '#CA8100'} />
                                </View>
                                <Text style={tw`text-zinc-500 text-xs font-bold`}>USD</Text>
                            </View>
                            <Text style={tw`text-zinc-400 text-xs font-medium`}>{cuenta.nombre}</Text>
                            <Text style={tw`text-white text-lg font-bold tracking-tight mt-0.5`}>
                                ${cuenta.saldo.toFixed(2)}
                            </Text>

                        </LinearGradient>


                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}