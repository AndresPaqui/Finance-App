// src/features/dashboard/components/RecentMovements.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import tw from '../../../../shared/lib/tw';
import { useFinanceStore } from '../../../../core/state/useFinanceStore';

const CATEGORY_ICONS: Record<string, string> = {
    Comida: '🍕',
    Snacks: '☕',
    Transporte: '🚌',
    Sueldo: '💵',
    Educación: '🎓',
    Salud: '💊',
    Entretenimiento: '🎬',
};

function getRelativeTime(isoString: string) {
    if (!isoString) return 'Hoy';
    const date = new Date(isoString);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    if (diffHours < 24 && date.getDate() === now.getDate()) return 'Hoy';
    if (diffHours < 48 && (now.getDate() - date.getDate() === 1 || now.getDate() - date.getDate() === -29 || now.getDate() - date.getDate() === -30)) return 'Ayer';
    return 'Hace unos días';
}

export default function RecentMovements() {
    const transacciones = useFinanceStore((state) => state.transaccionesList);
    const movimientos = transacciones.slice(0, 4);

    return (
        <View style={tw`mb-6 px-5`}>
            {/* Cabecera Principal */}
            <View style={tw`flex-row justify-between items-end mb-5 px-1`}>
                <Text style={tw`text-white text-xl font-bold tracking-wide`}>
                    Movimientos recientes
                </Text>
                <TouchableOpacity activeOpacity={0.6}>
                    <Text style={tw`text-primaryBlue text-sm font-semibold`}>
                        Ver todos
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Contenedor del Timeline */}
            <View style={tw`relative`}>
                {/* Línea vertical del eje */}
                <View style={[tw`absolute left-[22px] top-4 bottom-4 w-[1.5px] bg-card`, { zIndex: -1 }]} />

                {movimientos.length === 0 ? (
                    <Text style={tw`text-textSecondary text-center py-4`}>Sin movimientos recientes</Text>
                ) : (
                    movimientos.map((mov) => {
                        const icon = CATEGORY_ICONS[mov.categoriaNombre] || (mov.tipo === 'INGRESO' ? '💰' : '💳');
                        const isIngreso = mov.tipo === 'INGRESO';
                        return (
                            <View key={mov.id} style={tw`flex-row items-center mb-4`}>

                                {/* Columna Izquierda: Círculo del Ícono */}
                                <View style={tw`w-11 items-center justify-center mr-3`}>
                                    <View style={tw`w-11 h-11 rounded-full bg-card/50 border border-white/10 items-center justify-center shadow-sm`}>
                                        <Text style={tw`text-lg`}>{icon}</Text>
                                    </View>
                                </View>

                                {/* Columna Derecha: Tarjeta Informativa */}
                                <View style={tw`flex-1 flex-row justify-between items-center bg-card/30 border border-white/5 rounded-2xl p-4`}>
                                    <View style={tw`flex-1 pr-2`}>
                                        <Text style={tw`text-white text-base font-semibold tracking-wide`} numberOfLines={1}>
                                            {mov.descripcion || mov.categoriaNombre}
                                        </Text>
                                        <Text style={tw`text-textSecondary text-xs mt-1 font-normal`}>
                                            {mov.categoriaNombre} • {getRelativeTime(mov.fechaCreacion)}
                                        </Text>
                                    </View>

                                    <Text style={[
                                        tw`text-base font-bold tracking-wide`,
                                        isIngreso ? tw`text-successMint` : tw`text-textPrimary`
                                    ]}>
                                        {isIngreso ? '+' : '-'}${mov.monto.toFixed(2)}
                                    </Text>
                                </View>
                            </View>
                        );
                    })
                )}
            </View>
        </View>
    );
}