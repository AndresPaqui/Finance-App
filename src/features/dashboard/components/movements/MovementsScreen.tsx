// src/features/dashboard/components/movements/MovementsScreen.tsx
import React from 'react';
import { View } from 'react-native';
import MovementsBalance from './MovementsBalance';
import MovementsFilter from './MovementsFilter';
import MovementsList from './MovementsList';

export default function MovementsScreen() {
    return (
        <View>
            <MovementsBalance />
            <MovementsFilter />
            <MovementsList />
        </View>
    );
}