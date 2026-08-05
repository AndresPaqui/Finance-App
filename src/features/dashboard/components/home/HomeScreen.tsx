import React, { useState } from 'react';
import { View } from 'react-native';
import WalletHeader from './WalletHeader';
import VoiceActionButton from './VoiceActionButton';
import DailyCostCard from './DailyCostCard';
import RecentMovements from './RecentMovements';
import AnalyticsAndGoals from './AnalyticsAndGoals';
import AddWalletModal from './AddWalletModal';

export default function HomeScreen() {
    const [isAddWalletModalOpen, setIsAddWalletModalOpen] = useState(false);

    return (
        <View>
            <WalletHeader onAddWalletPress={() => setIsAddWalletModalOpen(true)} />
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

            <AddWalletModal
                visible={isAddWalletModalOpen}
                onClose={() => setIsAddWalletModalOpen(false)}
            />
        </View>
    );
}