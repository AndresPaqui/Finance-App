// src/features/dashboard/components/RecentMovements.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import tw from '../../../../shared/lib/tw';


export default function RecentMovements() {
    const movimientos = [
        { id: '1', titulo: 'Cafetería', detalle: 'Transferencia • Hace 2h', monto: '-$3.25', tipo: 'EGRESO', icono: '☕' },
        { id: '2', titulo: 'Almuerzo', detalle: 'Efectivo • Hoy', monto: '-$5.00', tipo: 'EGRESO', icono: '🍔' },
        { id: '3', titulo: 'Mesada', detalle: 'Ingreso • Ayer', monto: '+$50.00', tipo: 'INGRESO', icono: '💰' },
    ];

    return (
        <View style={tw`mb-6 px-5`}>
            {/* Cabecera Principal */}
            <View style={tw`flex-row justify-between items-end mb-5 px-1`}>
                <Text style={tw`text-white text-xl font-bold tracking-wide`}>
                    Movimientos recientes
                </Text>
                <TouchableOpacity activeOpacity={0.6}>
                    <Text style={tw`text-[#ADC6FF] text-sm font-semibold`}>
                        Ver todos
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Contenedor del Timeline */}
            <View style={tw`relative`}>
                {/* Línea vertical del eje: 
                  Con 'left-[22px]' se alinea perfectamente en el centro de los círculos (w-11)
                */}
                <View style={[tw`absolute left-[22px] top-4 bottom-4 w-[1.5px] bg-[#1C2B3C]`, { zIndex: -1 }]} />

                {movimientos.map((mov) => (
                    <View key={mov.id} style={tw`flex-row items-center mb-4`}>

                        {/* Columna Izquierda: Círculo del Ícono (Ancho fijo para alinear el eje) */}
                        <View style={tw`w-11 items-center justify-center mr-3`}>
                            <View style={tw`w-11 h-11 rounded-full bg-[#1C2B3C]/50 border border-white/10 items-center justify-center shadow-sm`}>
                                <Text style={tw`text-lg`}>{mov.icono}</Text>
                            </View>
                        </View>

                        {/* Columna Derecha: Tarjeta Informativa del movimiento */}
                        <View style={tw`flex-1 flex-row justify-between items-center bg-[#1C2B3C]/30 border border-white/5 rounded-2xl p-4`}>
                            <View style={tw`flex-1 pr-2`}>
                                <Text style={tw`text-white text-base font-semibold tracking-wide`}>
                                    {mov.titulo}
                                </Text>
                                <Text style={tw`text-[#8C909F] text-xs mt-1 font-normal`}>
                                    {mov.detalle}
                                </Text>
                            </View>

                            {/* Monto con color condicional exacto de Figma */}
                            <Text style={[
                                tw`text-base font-bold tracking-wide`,
                                mov.tipo === 'INGRESO' ? tw`text-[#4EDEA3]` : tw`text-white`
                            ]}>
                                {mov.monto}
                            </Text>
                        </View>

                    </View>
                ))}
            </View>
        </View>
    );
}