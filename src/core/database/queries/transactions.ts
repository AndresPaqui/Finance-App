import { eq, and, gte, sql } from 'drizzle-orm';
import * as Crypto from 'expo-crypto';
import { db } from '../db';
import { transacciones, categorias } from '../schema';
import { updateAccountBalance } from './accounts';

export interface CreateTransactionInput {
    id?: string;
    cuentaOrigenId: string;
    cuentaDestinoId?: string;
    categoriaNombre: string;
    esNecesidad?: boolean;
    monto: number;
    comision?: number;
    tipo: 'INGRESO' | 'GASTO' | 'TRANSFERENCIA';
    descripcion?: string;
    esPendiente?: boolean;
    requiereRevision?: boolean;
    fechaCreacion?: string;
}

/**
 * Inserta una nueva transacción en la base de datos de manera atómica,
 * buscando/creando la categoría necesaria y actualizando el saldo de la cuenta de origen (y destino si aplica).
 */
export async function createTransaction(input: CreateTransactionInput) {
    const transaccionId = input.id || Crypto.randomUUID();
    const comision = input.comision || 0;
    const montoTotal = input.monto + comision;
    const fechaCreacion = input.fechaCreacion || new Date().toISOString();

    return await db.transaction(async (tx) => {
        // 1. Buscar o crear automáticamente la categoría
        let categoriaId: string;
        const catExistente = await tx
            .select()
            .from(categorias)
            .where(eq(categorias.nombre, input.categoriaNombre));

        if (catExistente.length > 0) {
            categoriaId = catExistente[0].id;
        } else {
            categoriaId = Crypto.randomUUID();
            await tx.insert(categorias).values({
                id: categoriaId,
                nombre: input.categoriaNombre,
                esNecesidad: input.esNecesidad ?? false,
            });
        }

        // 2. Insertar registro de la transacción física
        await tx.insert(transacciones).values({
            id: transaccionId,
            cuentaOrigenId: input.cuentaOrigenId,
            cuentaDestinoId: input.cuentaDestinoId || null,
            categoriaId: categoriaId,
            monto: input.monto,
            comision: comision,
            tipo: input.tipo,
            descripcion: input.descripcion || null,
            esPendiente: input.esPendiente ?? false,
            requiereRevision: input.requiereRevision ?? false,
            fechaCreacion: fechaCreacion,
        });

        // 3. Si no es una transacción pendiente (Break Point), actualizar el saldo real
        if (!input.esPendiente) {
            await updateAccountBalance(input.cuentaOrigenId, montoTotal, input.tipo, tx);

            // Si es una transferencia entre cuentas propias, acreditar en la cuenta de destino
            if (input.tipo === 'TRANSFERENCIA' && input.cuentaDestinoId) {
                await updateAccountBalance(input.cuentaDestinoId, input.monto, 'INGRESO', tx);
            }
        }

        return {
            id: transaccionId,
            cuentaOrigenId: input.cuentaOrigenId,
            cuentaDestinoId: input.cuentaDestinoId,
            categoriaNombre: input.categoriaNombre,
            esNecesidad: input.esNecesidad ?? false,
            monto: input.monto,
            comision: comision,
            tipo: input.tipo,
            descripcion: input.descripcion,
            fechaCreacion: fechaCreacion,
        };
    });
}

/**
 * Obtener las transacciones recientes para alimentar la lista del historial.
 */
export async function getRecentTransactions(limit = 50) {
    return await db
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
        .limit(limit);
}

/**
 * Calcula las analíticas del mes actual (Gastos Hormiga, Ingresos Totales, Gastos Totales y Comisiones).
 */
export async function getMonthlyAnalytics(fechaISO?: string) {
    const ahora = fechaISO ? new Date(fechaISO) : new Date();
    const primerDiaMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1).toISOString();

    // Gastos Hormiga: < $20.00 de categorías que no son necesidades
    const dbHormiga = await db
        .select({ total: sql<number>`sum(${transacciones.monto})` })
        .from(transacciones)
        .innerJoin(categorias, eq(transacciones.categoriaId, categorias.id))
        .where(
            and(
                eq(transacciones.tipo, 'GASTO'),
                eq(transacciones.esPendiente, false),
                eq(categorias.esNecesidad, false),
                sql`${transacciones.monto} < 20.00`,
                gte(transacciones.fechaCreacion, primerDiaMes)
            )
        );

    // Totales del mes
    const sumatoriasMes = await db
        .select({
            ingresos: sql<number>`sum(CASE WHEN ${transacciones.tipo} = 'INGRESO' THEN ${transacciones.monto} ELSE 0 END)`,
            gastos: sql<number>`sum(CASE WHEN ${transacciones.tipo} = 'GASTO' THEN ${transacciones.monto} ELSE 0 END)`,
            comisiones: sql<number>`sum(${transacciones.comision})`,
        })
        .from(transacciones)
        .where(gte(transacciones.fechaCreacion, primerDiaMes));

    return {
        totalHormiga: Number(dbHormiga[0]?.total) || 0,
        ingresos: Number(sumatoriasMes[0]?.ingresos) || 0,
        gastos: Number(sumatoriasMes[0]?.gastos) || 0,
        comisiones: Number(sumatoriasMes[0]?.comisiones) || 0,
    };
}
