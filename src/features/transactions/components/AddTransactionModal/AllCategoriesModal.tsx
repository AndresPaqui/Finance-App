// src/features/transactions/components/AddTransactionModal/AllCategoriesModal.tsx

import React from 'react';
import { View, Text, Modal, TouchableOpacity, FlatList } from 'react-native';
import { XMarkIcon, CheckIcon } from 'react-native-heroicons/outline';
import tw from '../../../../shared/lib/tw';
import { NeoTheme } from '../../../../core/theme/colors';

interface CategoryItem {
    id: string;
    nombre: string;
    icon: string;
    type: 'GASTO' | 'INGRESO';
}

interface AllCategoriesModalProps {
    visible: boolean;
    onClose: () => void;
    type: 'GASTO' | 'INGRESO';
    selectedCategoryNombre: string;
    onSelectCategory: (categoriaNombre: string) => void;
}

const ALL_CATEGORIES: CategoryItem[] = [
    // Gastos
    { id: '1', nombre: 'Comida', icon: '🍽️', type: 'GASTO' },
    { id: '2', nombre: 'Transporte', icon: '🚗', type: 'GASTO' },
    { id: '3', nombre: 'Ocio', icon: '🎟️', type: 'GASTO' },
    { id: '4', nombre: 'Salud', icon: '💊', type: 'GASTO' },
    { id: '5', nombre: 'Snacks', icon: '☕', type: 'GASTO' },
    { id: '6', nombre: 'Educación', icon: '🎓', type: 'GASTO' },
    { id: '7', nombre: 'Entretenimiento', icon: '🎬', type: 'GASTO' },
    { id: '8', nombre: 'Supermercado', icon: '🛒', type: 'GASTO' },
    { id: '9', nombre: 'Servicios', icon: '💡', type: 'GASTO' },
    { id: '10', nombre: 'Hogar', icon: '🏠', type: 'GASTO' },
    { id: '11', nombre: 'Ropa', icon: '👕', type: 'GASTO' },
    { id: '12', nombre: 'Mascotas', icon: '🐾', type: 'GASTO' },

    // Ingresos
    { id: '20', nombre: 'Sueldo', icon: '💵', type: 'INGRESO' },
    { id: '21', nombre: 'Cobros', icon: '💻', type: 'INGRESO' },
    { id: '22', nombre: 'Ventas', icon: '🛍️', type: 'INGRESO' },
    { id: '23', nombre: 'Inversión', icon: '📈', type: 'INGRESO' },
    { id: '24', nombre: 'Reembolso', icon: '🔄', type: 'INGRESO' },
    { id: '25', nombre: 'Regalo', icon: '🎁', type: 'INGRESO' },
    { id: '26', nombre: 'Otros Ingresos', icon: '💰', type: 'INGRESO' },
];

export default function AllCategoriesModal({
    visible,
    onClose,
    type,
    selectedCategoryNombre,
    onSelectCategory,
}: AllCategoriesModalProps) {
    const filteredCategories = ALL_CATEGORIES.filter((c) => c.type === type);

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <TouchableOpacity
                style={tw`flex-1 bg-black/75 justify-center items-center px-5`}
                activeOpacity={1}
                onPress={onClose}
            >
                {/* Contenedor del Modal Flotante */}
                <TouchableOpacity
                    activeOpacity={1}
                    style={tw`w-full bg-[#0F172A] border border-white/10 rounded-3xl p-5 max-h-[80%] shadow-2xl`}
                >
                    {/* Header del Modal */}
                    <View style={tw`flex-row justify-between items-center mb-4 pb-3 border-b border-white/5`}>
                        <Text style={tw`text-white text-lg font-bold tracking-wide`}>
                            Todas las Categorías ({type === 'GASTO' ? 'Gastos' : 'Ingresos'})
                        </Text>
                        <TouchableOpacity
                            onPress={onClose}
                            activeOpacity={0.7}
                            style={tw`w-8 h-8 rounded-full bg-card border border-white/10 items-center justify-center`}
                        >
                            <XMarkIcon size={18} color="#94A3B8" />
                        </TouchableOpacity>
                    </View>

                    {/* Rejilla de Categorías (3 Columnas) */}
                    <FlatList
                        data={filteredCategories}
                        keyExtractor={(item) => item.id}
                        numColumns={3}
                        columnWrapperStyle={{ gap: 10, marginBottom: 10 }}
                        renderItem={({ item }) => {
                            const isSelected = selectedCategoryNombre.toLowerCase() === item.nombre.toLowerCase();

                            return (
                                <TouchableOpacity
                                    onPress={() => {
                                        onSelectCategory(item.nombre);
                                        onClose();
                                    }}
                                    activeOpacity={0.7}
                                    style={[
                                        tw`flex-1 py-3.5 px-2 rounded-2xl bg-card/60 border items-center justify-center gap-1.5 relative`,
                                        isSelected
                                            ? tw`border-primaryBlue bg-primaryBlue/10`
                                            : tw`border-white/5`,
                                    ]}
                                >
                                    <View
                                        style={[
                                            tw`w-10 h-10 rounded-full items-center justify-center`,
                                            isSelected ? tw`bg-primaryBlue/20` : tw`bg-zinc-800/80`,
                                        ]}
                                    >
                                        <Text style={tw`text-lg`}>{item.icon}</Text>
                                    </View>

                                    <Text
                                        style={[
                                            tw`text-xs font-semibold tracking-wide text-center`,
                                            isSelected ? tw`text-white` : tw`text-textSecondary`,
                                        ]}
                                        numberOfLines={1}
                                    >
                                        {item.nombre}
                                    </Text>

                                    {isSelected && (
                                        <View style={tw`absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-primaryBlue items-center justify-center`}>
                                            <CheckIcon size={10} color="#FFFFFF" />
                                        </View>
                                    )}
                                </TouchableOpacity>
                            );
                        }}
                    />
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    );
}
