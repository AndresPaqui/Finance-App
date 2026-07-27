// src/features/dashboard/components/analytics/TopLeaks.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { ChartBarIcon } from 'react-native-heroicons/outline';
import tw from '../../../../shared/lib/tw';
import { NeoTheme } from '../../../../core/theme/colors';
import { useFinanceStore } from '../../../../core/state/useFinanceStore';

export default function TopLeaks() {
    const transacciones = useFinanceStore((state) => state.transaccionesList);
    
    // Agrupar gastos por categoría
    const gastosPorCat: Record<string, number> = {};
    let totalGastado = 0;

    transacciones
        .filter((t) => t.tipo === 'GASTO')
        .forEach((t) => {
            gastosPorCat[t.categoriaNombre] = (gastosPorCat[t.categoriaNombre] || 0) + t.monto;
            totalGastado += t.monto;
        });

    const colores = ['bg-orange-500', 'bg-blue-500', 'bg-zinc-500'];
    const maxMonto = Math.max(...Object.values(gastosPorCat), 1);

    const leaks = Object.entries(gastosPorCat)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([categoria, monto], index) => {
            const porcentaje = Math.min(100, Math.round((monto / maxMonto) * 100));
            return {
                id: String(index),
                category: categoria,
                amount: `$${monto.toFixed(2)}`,
                progress: `${porcentaje}%`,
                color: colores[index % colores.length],
            };
        });

    return (
        <View style={tw`bg-card/60 border border-zinc-800 rounded-3xl p-5 mb-4`}>
            <View style={tw`flex-row justify-between items-center mb-5`}>
                <Text style={tw`text-textPrimary text-sm font-bold`}>Top 3 Fugas de Dinero</Text>
                <ChartBarIcon size={20} color={NeoTheme.colors.textSecondary} />
            </View>

            {leaks.length === 0 ? (
                <Text style={tw`text-textSecondary text-center py-2 text-xs`}>Sin gastos registrados</Text>
            ) : (
                leaks.map((leak) => (
                    <View key={leak.id} style={tw`mb-4 last:mb-0`}>
                        <View style={tw`flex-row justify-between items-center mb-1.5`}>
                            <Text style={tw`text-slate-200 text-sm font-bold`}>{leak.category}</Text>
                            <Text style={tw`text-slate-200 text-sm font-bold`}>{leak.amount}</Text>
                        </View>
                        {/* Track container */}
                        <View style={tw`w-full h-1.5 bg-background rounded-full overflow-hidden`}>
                            {/* Fill */}
                            <View style={[tw`h-full rounded-full ${leak.color}`, { width: leak.progress }]} />
                        </View>
                    </View>
                ))
            )}
        </View>
    );
}