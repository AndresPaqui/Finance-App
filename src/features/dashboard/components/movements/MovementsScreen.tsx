// src/features/dashboard/components/movements/MovementsScreen.tsx
import React from 'react';
import { View } from 'react-native';
import MovementsBalance from './MovementsBalance';
import MovementsFilter from './MovementsFilter';
import MovementsList from './MovementsList';
import tw from '../../../../shared/lib/tw';

export default function MovementsScreen() {
    return (
        <View style={tw`pt-12 px-5`}>
            <MovementsBalance />
            <MovementsFilter />
            <MovementsList />
        </View>
    );
}