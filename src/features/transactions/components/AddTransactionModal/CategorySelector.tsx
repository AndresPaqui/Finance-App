// src/features/transactions/components/AddTransactionModal/CategorySelector.tsx

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import tw from '../../../../shared/lib/tw';
import AllCategoriesModal from './AllCategoriesModal';

export interface CategoryOption {
    id: string;
    nombre: string;
    icon?: string;
}

interface CategorySelectorProps {
    type?: 'GASTO' | 'INGRESO';
    selectedCategoryNombre: string;
    onSelectCategory: (categoriaNombre: string) => void;
    onSeeAll?: () => void;
}

const CATEGORY_ICONS: Record<string, string> = {
    Comida: '🍽️',
    Transporte: '🚗',
    Ocio: '🎟️',
    Entretenimiento: '🎬',
    Salud: '💊',
    Snacks: '☕',
    Educación: '🎓',
    Sueldo: '💵',
    Cobros: '💻',
    Ventas: '🛍️',
    Inversión: '📈',
    Reembolso: '🔄',
};

const EXPENSE_CATEGORIES: CategoryOption[] = [
    { id: '1', nombre: 'Comida', icon: '🍽️' },
    { id: '2', nombre: 'Transporte', icon: '🚗' },
    { id: '3', nombre: 'Ocio', icon: '🎟️' },
    { id: '4', nombre: 'Salud', icon: '💊' },
    { id: '5', nombre: 'Snacks', icon: '☕' },
    { id: '6', nombre: 'Educación', icon: '🎓' },
];

const INCOME_CATEGORIES: CategoryOption[] = [
    { id: '10', nombre: 'Sueldo', icon: '💵' },
    { id: '11', nombre: 'Cobros', icon: '💻' },
    { id: '12', nombre: 'Ventas', icon: '🛍️' },
    { id: '13', nombre: 'Inversión', icon: '📈' },
    { id: '14', nombre: 'Reembolso', icon: '🔄' },
];

function CategorySelectorComponent({
    type = 'GASTO',
    selectedCategoryNombre,
    onSelectCategory,
    onSeeAll,
}: CategorySelectorProps) {
    const [isAllCategoriesOpen, setIsAllCategoriesOpen] = useState(false);
    const categories = type === 'INGRESO' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

    const handleSeeAll = () => {
        if (onSeeAll) {
            onSeeAll();
        } else {
            setIsAllCategoriesOpen(true);
        }
    };

    return (
        <View style={tw`w-full mb-4`}>
            {/* Header */}
            <View style={tw`flex-row justify-between items-center mb-3 px-1`}>
                <Text style={tw`text-textSecondary text-xs font-semibold uppercase tracking-widest`}>
                    Categoría
                </Text>
                <TouchableOpacity onPress={handleSeeAll} activeOpacity={0.6}>
                    <Text style={tw`text-primaryBlue text-xs font-semibold`}>Ver todas</Text>
                </TouchableOpacity>
            </View>

            {/* Carousel de Categorías */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 10, paddingHorizontal: 2 }}
            >
                {categories.map((cat) => {
                    const isSelected = selectedCategoryNombre.toLowerCase() === cat.nombre.toLowerCase();
                    const icon = cat.icon || CATEGORY_ICONS[cat.nombre] || '🏷️';

                    return (
                        <TouchableOpacity
                            key={cat.id}
                            onPress={() => onSelectCategory(cat.nombre)}
                            activeOpacity={0.7}
                            style={[
                                tw`w-20 py-3.5 rounded-2xl bg-card/40 border items-center justify-center gap-1.5`,
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
                                <Text style={tw`text-lg`}>{icon}</Text>
                            </View>
                            <Text
                                style={[
                                    tw`text-xs font-semibold tracking-wide`,
                                    isSelected ? tw`text-white` : tw`text-textSecondary`,
                                ]}
                                numberOfLines={1}
                            >
                                {cat.nombre}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            {/* Modal Flotante con Rejilla Completa de Categorías */}
            <AllCategoriesModal
                visible={isAllCategoriesOpen}
                onClose={() => setIsAllCategoriesOpen(false)}
                type={type}
                selectedCategoryNombre={selectedCategoryNombre}
                onSelectCategory={onSelectCategory}
            />
        </View>
    );
}

export default React.memo(CategorySelectorComponent);
