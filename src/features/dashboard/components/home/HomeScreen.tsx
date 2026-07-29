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
                {/* 1. Sección del micrófono y Gasté algo rápido */}
                <VoiceActionButton />
                {/* 2. Tarjeta de costo diario */}
                <DailyCostCard />
                {/* 3. Línea de tiempo de movimientos */}
                <RecentMovements />
                {/* 4. Analíticas y metas de ahorro */}
                <AnalyticsAndGoals />
            </View>
        </View>
    );
}