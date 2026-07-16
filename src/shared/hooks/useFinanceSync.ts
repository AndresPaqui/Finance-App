import { useEffect, useCallback } from 'react';
import { useFinanceStore, AccountBalance } from '../../core/state/useFinanceStore';
import { openDatabaseSync } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { cuentas, transacciones, categorias } from '../../core/database/schema';
import { eq, and, gte, sql } from 'drizzle-orm';
import * as Crypto from 'expo-crypto';

const expoDb = openDatabaseSync('andres_finanzas.db');
const db = drizzle(expoDb);

export function useFinanceSync() {
    const syncFromDatabase = useFinanceStore((state) => state.syncFromDatabase);
    const registrarOptimista = useFinanceStore((state) => state.registrarMovimientoOptimista);
    const addBreakPointOptimista = useFinanceStore((state) => state.addBreakPointOptimista);
    const setLoading = useFinanceStore((state) => state.setLoading);

    // 1. CARGA E HIDRATACIÓN DE DATOS (SQLite -> Zustand)
    const loadInitialData = useCallback(async () => {
        setLoading(true);
        try {
            // A. Obtener todas las cuentas reales
            const dbCuentas = await db.select().from(cuentas);

            // B. Contar cuántos Break Points (pendientes) existen
            const dbPendientes = await db
                .select({ count: sql<number>`count(*)` })
                .from(transacciones)
                .where(eq(transacciones.esPendiente, true));

            const totalPendientes = dbPendientes[0]?.count || 0;

            // C. Calcular Gasto Hormiga acumulado del mes actual
            // Regla de negocio: Gastos < $5.00 de categorías que NO son necesidades obligatorias
            const ahora = new Date();
            const primerDiaMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1).toISOString();

            const dbHormiga = await db
                .select({ total: sql<number>`sum(${transacciones.monto})` })
                .from(transacciones)
                .innerJoin(categorias, eq(transacciones.categoriaId, categorias.id))
                .where(
                    and(
                        eq(transacciones.tipo, 'GASTO'),
                        eq(transacciones.esPendiente, false),
                        eq(categorias.esNecesidad, false),
                        sql`${transacciones.monto} < 5.00`,
                        gte(transacciones.fechaCreacion, primerDiaMes)
                    )
                );

            const totalHormiga = Number(dbHormiga[0]?.total) || 0;

            // D. Ingresos, Gastos y Comisiones totales del mes
            const sumatoriasMes = await db
                .select({
                    ingresos: sql<number>`sum(CASE WHEN ${transacciones.tipo} = 'INGRESO' THEN ${transacciones.monto} ELSE 0 END)`,
                    gastos: sql<number>`sum(CASE WHEN ${transacciones.tipo} = 'GASTO' THEN ${transacciones.monto} ELSE 0 END)`,
                    comisiones: sql<number>`sum(${transacciones.comision})`,
                })
                .from(transacciones)
                .where(gte(transacciones.fechaCreacion, primerDiaMes));

            // E. Obtener el Historial de Transacciones (con JOIN a Categorías)
            // Se ordena del más reciente al más antiguo, limitamos a 50 para no ahogar la RAM
            const dbTransaccionesBrutas = await db
                .select({
                    id: transacciones.id,
                    cuentaOrigenId: transacciones.cuentaOrigenId,
                    categoriaNombre: categorias.nombre,
                    esNecesidad: categorias.esNecesidad,
                    monto: transacciones.monto,
                    comision: transacciones.comision,
                    tipo: transacciones.tipo,
                    descripcion: transacciones.descripcion,
                    fechaCreacion: transacciones.fechaCreacion,
                })
                .from(transacciones)
                .innerJoin(categorias, eq(transacciones.categoriaId, categorias.id))
                .where(eq(transacciones.esPendiente, false))
                .orderBy(sql`${transacciones.fechaCreacion} DESC`)
                .limit(50);


            // F. Sincronizar la memoria global de Zustand con la estructura
            syncFromDatabase({
                cuentas: dbCuentas as AccountBalance[],
                transacciones: dbTransaccionesBrutas as any[], // El tipado coincide con TransactionItem
                pendientes: totalPendientes,
                analiticas: {
                    hormiga: totalHormiga,
                    ingresos: Number(sumatoriasMes[0]?.ingresos) || 0,
                    gastos: Number(sumatoriasMes[0]?.gastos) || 0,
                    comisiones: Number(sumatoriasMes[0]?.comisiones) || 0,
                }
            });

        } catch (error) {
            console.error('Error crítico al sincronizar base de datos local:', error);
        } finally {
            setLoading(false);
        }
    }, [syncFromDatabase, setLoading]);

    // Ejecutar carga automática al montar el hook en la app
    useEffect(() => {
        loadInitialData();
    }, [loadInitialData]);


    // 2. REGISTRO DE MOVIMIENTOS (Voz / NLP)
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
        const costoTotal = monto + comision;
        const fechaActual = new Date().toISOString(); // Capturamos la hora exacta

        const nuevaTransaccionFake = { //Clon visual para inyectarlo en la UI al instante
            id: transaccionId,
            cuentaOrigenId: cuentaOrigenId,
            categoriaNombre: categoriaNombre,
            monto: monto,
            comision: comision,
            tipo: tipo,
            descripcion: descripcion,
            fechaCreacion: fechaActual,
            esNecesidad: false, // Asumimos capricho en la UI hasta que la BD confirme lo contrario
        };

        // A. PASO OPTIMISTA: Actualiza la UI al milisegundo (Zustand)
        registrarOptimista({ cuentaOrigenId, monto, comision, tipo, esHormiga, nuevaTransaccionFake });

        // B. PASO PERSISTENTE: Escritura asíncrona y segura en SQLite
        try {
            await db.transaction(async (tx) => {
                // 1. Buscar o crear la categoría basada en el texto parseado
                const catResult = await tx
                    .select()
                    .from(categorias)
                    .where(eq(categorias.nombre, categoriaNombre));

                let targetCategoriaId = catResult[0]?.id;

                if (!targetCategoriaId) {
                    targetCategoriaId = Crypto.randomUUID();
                    await tx.insert(categorias).values({
                        id: targetCategoriaId,
                        nombre: categoriaNombre,
                        esNecesidad: false, // Por defecto se asume capricho hasta que se configure
                    });
                }

                // 2. Insertar la transacción física
                await tx.insert(transacciones).values({
                    id: transaccionId,
                    cuentaOrigenId,
                    categoriaId: targetCategoriaId,
                    monto,
                    comision,
                    tipo,
                    descripcion,
                    esPendiente: false,
                    fechaCreacion: new Date().toISOString(),
                });

                // 3. Modificar el balance real de la cuenta en el disco
                const cuentaTarget = await tx.select().from(cuentas).where(eq(cuentas.id, cuentaOrigenId));
                if (cuentaTarget[0]) {
                    let nuevoSaldo = cuentaTarget[0].saldoActual;
                    if (tipo === 'GASTO') {
                        nuevoSaldo = cuentaTarget[0].tipo === 'TARJETA_CREDITO'
                            ? cuentaTarget[0].saldoActual + costoTotal
                            : cuentaTarget[0].saldoActual - costoTotal;
                    } else {
                        nuevoSaldo = cuentaTarget[0].tipo === 'TARJETA_CREDITO'
                            ? cuentaTarget[0].saldoActual - monto
                            : cuentaTarget[0].saldoActual + monto;
                    }

                    await tx
                        .update(cuentas)
                        .set({ saldoActual: nuevoSaldo })
                        .where(eq(cuentas.id, cuentaOrigenId));
                }
            });
        } catch (dbError) {
            console.error('Error al persistir la transacción, revirtiendo UI...', dbError);
            // Aquí podrías recargar los datos de la DB para deshacer el paso optimista si colapsa el disco
            loadInitialData();
        }
    };

    // 3. REGISTRO DE BREAK POINTS (Marcadores rápidos)
    const ejecutarBreakPoint = async (cuentaOrigenId: string) => {
        const transaccionId = Crypto.randomUUID();

        // A. PASO OPTIMISTA: Incrementa el círculo rojo en pantalla inmediatamente
        addBreakPointOptimista();

        // B. PASO PERSISTENTE: Guarda el marcador vacío en SQLite
        try {
            // Buscamos una categoría comodín para "Pendientes"
            const catPendiente = await db.select().from(categorias).where(eq(categorias.nombre, 'Pendiente'));
            let catId = catPendiente[0]?.id;

            if (!catId) {
                catId = Crypto.randomUUID();
                await db.insert(categorias).values({ id: catId, nombre: 'Pendiente', esNecesidad: false });
            }

            await db.insert(transacciones).values({
                id: transaccionId,
                cuentaOrigenId,
                categoriaId: catId,
                monto: 0.0, // Se resolverá después en la reconciliación
                tipo: 'GASTO',
                esPendiente: true,
                descripcion: 'Marcador rápido desde la burbuja',
                fechaCreacion: new Date().toISOString(),
            });
        } catch (error) {
            console.error('Error al guardar el Break Point en disco:', error);
        }
    };

    return {
        loadInitialData,
        ejecutarGastoVoz,
        ejecutarBreakPoint,
    };
}