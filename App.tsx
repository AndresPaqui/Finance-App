
import "./global.css";

//Importar componentes

import HomeScreen from "./src/features/dashboard/components/home/HomeScreen";
import MovementsScreen from "./src/features/dashboard/components/movements/MovementsScreen";
import AnalyticsScreen from "./src/features/dashboard/components/analytics/AnalyticsScreen";
import ProfileScreen from "./src/features/dashboard/components/profile/ProfileScreen";
import AddTransactionModal from "./src/features/transactions/components/AddTransactionModal";
import MainTabBar, { ActiveTab } from "./src/shared/MainTabBar";
import tw from "./src/shared/lib/tw";

import { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text, ScrollView } from 'react-native';
import { openDatabaseSync } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from './drizzle/migrations';

// Conexiones del Core (Estado y Sincronización)
import { useFinanceStore } from './src/core/state/useFinanceStore';
import { useFinanceSync } from './src/shared/hooks/useFinanceSync';

import { seedDatabase } from "./src/core/database/seed";


// Inicializamos la base de datos local SQLite
const expoDb = openDatabaseSync('andres_finanzas.db');
const db = drizzle(expoDb);

export default function App() {
  const { success: dbMigrated, error } = useMigrations(db, migrations);
  const isLoadingStore = useFinanceStore((state) => state.isLoading);
  const { loadInitialData } = useFinanceSync();

  const [activeTab, setActiveTab] = useState<ActiveTab>('Inicio');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Abrir modal de nuevo registro desde el botón (+) central de la barra inferior
  const handleRegistrarPress = () => {
    setIsAddModalOpen(true);
  };

  useEffect(() => {
    let isMounted = true;
    const initSeed = async () => {
      if (dbMigrated && isMounted) {
        try {
          await seedDatabase(expoDb);
          await loadInitialData();
        } catch (e) {
          console.error('Error al inicializar datos:', e);
        }
      }
    };
    initSeed();
    return () => { isMounted = false; };
  }, [dbMigrated, loadInitialData]);

  useEffect(() => {
    if (error) {
      console.error('Error crítico al cargar la base de datos:', error);
    }
  }, [error]);

  // Pantalla de Carga
  if (!dbMigrated || isLoadingStore) {
    return (
      <View style={tw`flex-1 bg-background justify-center items-center`}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={tw`text-textSecondary mt-4 font-medium tracking-wide`}>
          Cargando tus finanzas...
        </Text>
      </View>
    );
  }

  return (
    <View style={tw`flex-1 bg-background`}>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={tw`flex-1 bg-background`}
        contentContainerStyle={tw`pb-28 bg-background`}
      >

        {/* Pantalla de inicio */}
        {activeTab === 'Inicio' && (
          <HomeScreen />
        )}

        {/* Pantalla de movimientos */}
        {activeTab === 'Movimientos' && (
          <MovementsScreen />
        )}

        {/* Pantalla de Metas*/}
        {activeTab === 'Metas' && (
          <AnalyticsScreen />
        )}

        {/* Pantalla de Perfil*/}
        {activeTab === 'Perfil' && (
          <ProfileScreen />
        )}
      </ScrollView>

      {/* 6. Barra Inferior Principal */}
      <MainTabBar
        currentActiveTab={activeTab}
        onTabChange={setActiveTab}
        onRegistrarPress={handleRegistrarPress}
      />

      {/* Modal de Registro Manual de Transacciones */}
      <AddTransactionModal
        visible={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

    </View>
  );
}