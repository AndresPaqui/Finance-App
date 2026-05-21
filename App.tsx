
import "./global.css";

//Importar componentes

import HomeScreen from "./src/features/dashboard/components/home/HomeScreen";
import MovementsScreen from "./src/features/dashboard/components/movements/MovementsScreen";
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

  // 4. useSatate encargadao de identificar la pestaña activa

  const [activeTab, setActiveTab] = useState<ActiveTab>('Inicio');

  // 5. Funcion temporal asignada al boton central de agregar
  const handleRegistrarPress = () => {
    console.log('¡Botón Registrar presionado! Aquí abriremos la IA de voz.');
  };

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
    <View className="flex-1  px-4 pt-12">

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`pb-28 bg-background`} // Espacio extra al final para que no pegue con el borde
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

          <View style={tw`flex-1 justify-center items-center px-4 mt-20`}>
            <Text style={tw`text-zinc-500 text-lg font-medium`}>Pantalla de Metas en construcción...</Text>
          </View>

        )}

        {/* Pantalla de Perfil*/}
        {activeTab === 'Perfil' && (

          <View style={tw`flex-1 justify-center items-center px-4 mt-20`}>
            <Text style={tw`text-zinc-500 text-lg font-medium`}>Pantalla de Perfil en construcción...</Text>
          </View>

        )}
      </ScrollView>

      {/* 6. Colocar la Barra Inferior */}

      <MainTabBar
        currentActiveTab={activeTab}
        onTabChange={setActiveTab}
        onRegistrarPress={handleRegistrarPress}
      />

    </View>
  );
}