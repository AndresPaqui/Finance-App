import { useEffect, useCallback } from 'react';
import { useFinanceStore, AccountBalance, MetaAhorroItem } from '../../core/state/useFinanceStore';
import { db } from '../../core/database/db';
import { cuentas, transacciones, metasAhorro } from '../../core/database/schema';
import { createTransaction, getRecentTransactions, getMonthlyAnalytics } from '../../core/database/queries/transactions';
import { createAccount, CreateAccountInput } from '../../core/database/queries/accounts';
import { createGoal, updateGoalProgress, CreateGoalInput } from '../../core/database/queries/goals';
import { eq, sql } from 'drizzle-orm';
import * as Crypto from 'expo-crypto';

export function useFinanceSync() {
    const syncFromDatabase = useFinanceStore((state) => state.syncFromDatabase);
    const registrarOptimista = useFinanceStore((state) => state.registrarMovimientoOptimista);
    const addBreakPointOptimista = useFinanceStore((state) => state.addBreakPointOptimista);
    const addAccountState = useFinanceStore((state) => state.addAccountState);
    const addGoalState = useFinanceStore((state) => state.addGoalState);
    const updateGoalState = useFinanceStore((state) => state.updateGoalState);
    const setLoading = useFinanceStore((state) => state.setLoading);

    // 1. CARGA E HIDRATACIÓN DE DATOS (SQLite -> Zustand)
    const loadInitialData = useCallback(async () => {
        setLoading(true);
        try {
            const dbCuentas = await db.select().from(cuentas);
            const dbPendientes = await db
                .select({ count: sql<number>`count(*)` })
                .from(transacciones)
                .where(eq(transacciones.esPendiente, true));

            const totalPendientes = dbPendientes[0]?.count || 0;
            const analiticas = await getMonthlyAnalytics();
            const dbTransaccionesBrutas = await getRecentTransactions(50);
            const dbMetas = await db.select().from(metasAhorro);

            syncFromDatabase({
                cuentas: dbCuentas as AccountBalance[],
                transacciones: dbTransaccionesBrutas as any[],
                metas: dbMetas as MetaAhorroItem[],
                pendientes: totalPendientes,
                analiticas: {
                    hormiga: analiticas.totalHormiga,
                    ingresos: analiticas.ingresos,
                    gastos: analiticas.gastos,
                    comisiones: analiticas.comisiones,
                }
            });

        } catch (error) {
            console.error('Error crítico al sincronizar base de datos local:', error);
        } finally {
            setLoading(false);
        }
    }, [syncFromDatabase, setLoading]);

    useEffect(() => {
        loadInitialData();
    }, [loadInitialData]);


    // 2. REGISTRO DE MOVIMIENTOS
    const ejecutarGastoVoz = async (payload: {
        monto: number;
        comision: number;
        tipo: 'GASTO' | 'INGRESO';
        categoriaNombre: string;
        cuentaOrigenId: string;
        descripcion: string;
        esHormiga: boolean;
    }) => {
        const { monto, comision, tipo, categoriaNombre, cuentaOrigenId, descripcion, esHormiga } = payload;
        const transaccionId = Crypto.randomUUID();
        const fechaActual = new Date().toISOString();

        const nuevaTransaccionFake = {
            id: transaccionId,
            cuentaOrigenId: cuentaOrigenId,
            categoriaNombre: categoriaNombre,
            monto: monto,
            comision: comision,
            tipo: tipo,
            descripcion: descripcion,
            fechaCreacion: fechaActual,
            esNecesidad: false,
        };

        registrarOptimista({ cuentaOrigenId, monto, comision, tipo, esHormiga, nuevaTransaccionFake });

        try {
            await createTransaction({
                id: transaccionId,
                cuentaOrigenId,
                categoriaNombre,
                monto,
                comision,
                tipo,
                descripcion,
                fechaCreacion: fechaActual,
            });
        } catch (dbError) {
            console.error('Error al persistir la transacción, revirtiendo UI...', dbError);
            loadInitialData();
        }
    };

    // 3. REGISTRO DE BREAK POINTS
    const ejecutarBreakPoint = async (cuentaOrigenId: string) => {
        const transaccionId = Crypto.randomUUID();
        addBreakPointOptimista();

        try {
            await createTransaction({
                id: transaccionId,
                cuentaOrigenId,
                categoriaNombre: 'Pendiente',
                monto: 0.0,
                tipo: 'GASTO',
                esPendiente: true,
                descripcion: 'Marcador rápido desde la burbuja',
            });
        } catch (error) {
            console.error('Error al guardar el Break Point en disco:', error);
        }
    };

    // 4. CREACIÓN DE CUENTAS (WALLETS)
    const crearCuenta = async (input: CreateAccountInput) => {
        const nueva = await createAccount(input);
        addAccountState(nueva as AccountBalance);
        return nueva;
    };

    // 5. CREACIÓN Y ABONO A METAS
    const crearMeta = async (input: CreateGoalInput) => {
        const nueva = await createGoal(input);
        addGoalState(nueva as MetaAhorroItem);
        return nueva;
    };

    const abonarMeta = async (goalId: string, monto: number) => {
        const actualizada = await updateGoalProgress(goalId, monto);
        if (actualizada) {
            updateGoalState(actualizada as MetaAhorroItem);
        }
        return actualizada;
    };

    return {
        loadInitialData,
        ejecutarGastoVoz,
        ejecutarBreakPoint,
        crearCuenta,
        crearMeta,
        abonarMeta,
    };
}