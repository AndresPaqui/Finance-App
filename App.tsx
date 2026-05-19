
import "./global.css";

//Importar componentes
import WalletHeader from './src/features/dashboard/components/WalletHeader';
import VoiceActionButton from './src/features/dashboard/components/VoiceActionButton';
import DailyCostCard from "./src/features/dashboard/components/DailyCostCard";
import RecentMovements from "./src/features/dashboard/components/RecentMovements";
import AnalyticsAndGoals from "./src/features/dashboard/components/AnalyticsAndGoals";

import { useEffect } from 'react';
import { View, ActivityIndicator, Text, ScrollView } from 'react-native';
import { openDatabaseSync } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from './drizzle/migrations';

// Conexiones del Core (Estado y Sincronización)
import { useFinanceStore } from './src/core/state/useFinanceStore';
import { useFinanceSync } from './src/shared/hooks/useFinanceSync';
import tw from "./src/shared/lib/tw";


// Inicializamos la base de datos local SQLite
const expoDb = openDatabaseSync('andres_finanzas.db');
const db = drizzle(expoDb);

export default function App() {
  // 1. Correr migraciones de Drizzle (.sql)
  const { success: dbMigrated, error } = useMigrations(db, migrations);

  // 2. Traer el estado de carga global de Zustand
  const isLoadingStore = useFinanceStore((state) => state.isLoading);

  // 3. Activar el hook que jala los datos de SQLite a Zustand automáticamente
  // Este hook se ejecuta solo cuando dbMigrated es true gracias a su useEffect interno
  const { loadInitialData } = useFinanceSync();

  useEffect(() => {
    if (error) {
      console.error('Error crítico al cargar la base de datos:', error);
    }
  }, [error]);

  // Pantalla de Carga (Mientras se crean tablas o se leen saldos)
  if (!dbMigrated || isLoadingStore) {
    return (
      <View className="flex-1 bg-background justify-center items-center">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="text-textSecondary mt-4 font-medium tracking-wide">
          Cargando tus finanzas...
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background px-4 pt-12">

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`pb-8 bg-background`} // Espacio extra al final para que no pegue con el borde
      >
        {/* 1. Billetera superior */}
        <WalletHeader />

        <View style={tw``}>
          {/* 2. Botón de registro de voz */}
          <VoiceActionButton />

          {/* 3. Costo diario */}
          <DailyCostCard />

          {/* 4. Línea de tiempo de movimientos */}
          <RecentMovements />

          {/* 5. Analíticas y metas de ahorro al fondo */}
          <AnalyticsAndGoals />
        </View>


      </ScrollView>
    </View>
  );
}