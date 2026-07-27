// src/features/dashboard/components/analytics/LifestyleThermometer.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { ThermometerIcon } from 'lucide-react-native';
import tw from '../../../../shared/lib/tw';
import { NeoTheme } from '../../../../core/theme/colors';
import { useFinanceStore } from '../../../../core/state/useFinanceStore';

export default function LifestyleThermometer() {
    const transacciones = useFinanceStore((state) => state.transaccionesList);
    const gastos = transacciones.filter(t => t.tipo === 'GASTO');
    const totalGastos = gastos.reduce((acc, t) => acc + t.monto, 0);
    const necesidades = gastos.filter(t => t.esNecesidad).reduce((acc, t) => acc + t.monto, 0);
    
    const pctNecesidades = totalGastos > 0 ? Math.round((necesidades / totalGastos) * 100) : 65;
    const pctCaprichos = totalGastos > 0 ? 100 - pctNecesidades : 35;

    return (
        <View style={tw`bg-card/60 border border-zinc-800 rounded-3xl p-5 mb-4`}>
            <View style={tw`flex-row justify-between items-center mb-4`}>
                <Text style={tw`text-textPrimary text-sm font-medium`}>Termómetro de Estilo de Vida</Text>
                <ThermometerIcon size={20} color={NeoTheme.colors.textSecondary} />
            </View>

            {/* Barra de progreso dividida */}
            <View style={tw`w-full h-3 flex-row rounded-full overflow-hidden mb-4`}>
                <View style={[tw`h-full bg-successMint`, { width: `${pctNecesidades}%` }]} />
                <View style={[tw`h-full bg-orange-400`, { width: `${pctCaprichos}%` }]} />
            </View>

            {/* Leyendas */}
            <View style={tw`flex-row justify-between`}>
                <View style={tw`flex-row items-center`}>
                    <View style={tw`w-2 h-2 rounded-full bg-emerald-400 mr-2`} />
                    <Text style={tw`text-slate-200 text-xs font-semibold tracking-wide`}>Necesidades ({pctNecesidades}%)</Text>
                </View>
                <View style={tw`flex-row items-center`}>
                    <Text style={tw`text-slate-200 text-xs font-semibold tracking-wide mr-2`}>Caprichos ({pctCaprichos}%)</Text>
                    <View style={tw`w-2 h-2 rounded-full bg-orange-400`} />
                </View>
            </View>
        </View>
    );
}
