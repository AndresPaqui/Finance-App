// src/features/dashboard/components/movements/MovementsList.tsx
import React from 'react';
import { View, Text } from 'react-native';
import tw from '../../../../shared/lib/tw';
import { useFinanceStore, TransactionItem } from '../../../../core/state/useFinanceStore';

const CATEGORY_ICONS: Record<string, string> = {
    Comida: '🍕',
    Snacks: '☕',
    Transporte: '🚌',
    Sueldo: '💵',
    Educación: '🎓',
    Salud: '💊',
    Entretenimiento: '🎬',
};

export default function MovementsList() {
    const transacciones = useFinanceStore((state) => state.transaccionesList);

    // Agrupación dinámica por fecha
    const hoy: TransactionItem[] = [];
    const ayer: TransactionItem[] = [];
    const anteriores: TransactionItem[] = [];

    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const yesterdayDate = new Date(now);
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterdayStr = yesterdayDate.toISOString().split('T')[0];

    transacciones.forEach((item) => {
        const itemDateStr = (item.fechaCreacion || '').split('T')[0];
        if (itemDateStr === todayStr) {
            hoy.push(item);
        } else if (itemDateStr === yesterdayStr) {
            ayer.push(item);
        } else {
            anteriores.push(item);
        }
    });

    const groupedData = [
        { title: 'Hoy', data: hoy },
        { title: 'Ayer', data: ayer },
        { title: 'Esta semana y anteriores', data: anteriores },
    ].filter((g) => g.data.length > 0);

    return (
        <View style={tw`pb-6`}>
            {groupedData.length === 0 ? (
                <Text style={tw`text-textSecondary text-center py-8`}>No hay transacciones registradas</Text>
            ) : (
                groupedData.map((group) => (
                    <View key={group.title}>
                        <Text style={tw`text-textSecondary text-sm font-semibold mb-3 ml-1`}>{group.title}</Text>

                        {group.data.map((item) => {
                            const icon = CATEGORY_ICONS[item.categoriaNombre] || (item.tipo === 'INGRESO' ? '💰' : '💳');
                            const isIngreso = item.tipo === 'INGRESO';
                            const isHighlight = item.monto >= 150 && item.tipo === 'GASTO';

                            return (
                                <View
                                    key={item.id}
                                    style={[
                                        tw`flex-row items-center bg-card/40 border border-zinc-800/80 rounded-2xl p-4 mb-2`,
                                        isHighlight ? tw`border-l-4 border-amber-500` : null,
                                    ]}
                                >
                                    <View style={tw`w-10 h-10 rounded-full bg-zinc-900/80 items-center justify-center mr-4`}>
                                        <Text style={tw`text-base`}>{icon}</Text>
                                    </View>

                                    <View style={tw`flex-1`}>
                                        <Text style={tw`text-textPrimary text-sm font-bold`} numberOfLines={1}>
                                            {item.descripcion || item.categoriaNombre}
                                        </Text>
                                        <Text style={tw`text-textSecondary text-xs mt-0.5`}>
                                            {item.categoriaNombre} • {isIngreso ? 'Ingreso' : 'Gasto'}
                                        </Text>
                                    </View>

                                    <Text style={[
                                        tw`text-sm font-black`,
                                        isIngreso ? tw`text-successMint` : tw`text-textPrimary`
                                    ]}>
                                        {isIngreso ? '+' : '-'}${item.monto.toFixed(2)}
                                    </Text>
                                </View>
                            );
                        })}
                    </View>
                ))
            )}
        </View>
    );
}