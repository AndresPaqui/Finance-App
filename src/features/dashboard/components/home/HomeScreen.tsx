import React from 'react';
import { View } from 'react-native';
import WalletHeader from './WalletHeader';
import VoiceActionButton from './VoiceActionButton';
import DailyCostCard from './DailyCostCard';
import RecentMovements from './RecentMovements';
import AnalyticsAndGoals from './AnalyticsAndGoals';

export default function HomeScreen() {
    return (
        <View>
            <WalletHeader />
            <View>
                {/* 1. Billetera superior */}
                <VoiceActionButton />
                {/* 2. Botón de registro de voz */}
                <DailyCostCard />
                {/* 4. Línea de tiempo de movimientos */}
                <RecentMovements />
                {/* 5. Analíticas y metas de ahorro al fondo */}
                <AnalyticsAndGoals />
            </View>
        </View>
    );
}