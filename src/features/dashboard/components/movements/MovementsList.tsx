// src/features/dashboard/components/movements/MovementsList.tsx
import React from 'react';
import { View, Text } from 'react-native';
import tw from '../../../../shared/lib/tw';

export default function MovementsList() {
    const groupedData = [
        {
            title: 'Hoy',
            data: [
                { id: '1', title: 'Cafetería Central', subtitle: 'Débito • Hace 2h', amount: '-$45.00', type: 'out', icon: '☕' },
                { id: '2', title: 'Matrícula Universidad', subtitle: 'Transferencia • Hace 5h', amount: '-$850.00', type: 'out', icon: '🎓', border: 'border-l-4 border-amber-500' },
            ]
        },
        {
            title: 'Ayer',
            data: [
                { id: '3', title: 'Nómina Quincenal', subtitle: 'Transferencia • 09:00 AM', amount: '+$1,500.00', type: 'in', icon: '💵' },
                { id: '4', title: 'Pago de Carlos', subtitle: 'Neo Transfer • 02:30 PM', amount: '+$120.00', type: 'in', icon: '👥' },
                { id: '5', title: 'Pizza Express', subtitle: 'Crédito • 08:45 PM', amount: '-$25.00', type: 'out', icon: '🍕' },
            ]
        },
        {
            title: 'Esta semana',
            data: [
                { id: '6', title: 'Supermercado', subtitle: 'Débito • Lunes', amount: '-$150.00', type: 'out', icon: '🛒', border: 'border-l-4 border-amber-500' },
                { id: '7', title: 'Farmacia', subtitle: 'Débito • Martes', amount: '-$32.40', type: 'out', icon: '💊' },
                { id: '8', title: 'Retiro ATM', subtitle: 'Efectivo • Miércoles', amount: '-$100.00', type: 'out', icon: '🏧' },
            ]
        }
    ];

    return (
        <View style={tw`pb-6`}>
            {groupedData.map((group) => (
                <View key={group.title}>
                    <Text style={tw`text-[#C2C6D6] text-sm font-semibold mb-3 ml-1`}>{group.title}</Text>

                    {group.data.map((item) => (
                        <View
                            key={item.id}
                            style={[
                                tw`flex-row items-center bg-[#1E293B]/40 border border-zinc-800/80 rounded-2xl p-4 mb-2`,
                                item.border ? tw`${item.border}` : null
                            ]}
                        >
                            <View style={tw`w-10 h-10 rounded-full bg-zinc-900/80 items-center justify-center mr-4`}>
                                <Text style={tw`text-base`}>{item.icon}</Text>
                            </View>

                            <View style={tw`flex-1`}>
                                <Text style={tw`text-[#D4E4FA] text-sm font-bold`}>{item.title}</Text>
                                <Text style={tw`text-zinc-500 text-xs mt-0.5`}>{item.subtitle}</Text>
                            </View>

                            <Text style={tw`text-sm font-black ${item.type === 'in' ? 'text-emerald-400' : 'text-slate-300'}`}>
                                {item.amount}
                            </Text>
                        </View>
                    ))}
                </View>
            ))}
        </View>
    );
}