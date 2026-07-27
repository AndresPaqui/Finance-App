import { eq, sql } from 'drizzle-orm';
import * as Crypto from 'expo-crypto';
import { db } from '../db';
import { metasAhorro } from '../schema';

export interface CreateGoalInput {
    id?: string;
    nombreMeta: string;
    montoObjetivo: number;
    montoActual?: number;
}

/**
 * Obtener todas las metas de ahorro almacenadas en la base de datos local.
 */
export async function getAllGoals() {
    return await db.select().from(metasAhorro);
}

/**
 * Crear una nueva meta de ahorro (ej. PS5 Slim, Fondo de Emergencia).
 */
export async function createGoal(input: CreateGoalInput) {
    const id = input.id || Crypto.randomUUID();
    const nuevaMeta = {
        id,
        nombreMeta: input.nombreMeta,
        montoObjetivo: input.montoObjetivo,
        montoActual: input.montoActual ?? 0,
    };

    await db.insert(metasAhorro).values(nuevaMeta);
    return nuevaMeta;
}

/**
 * Abonar o retirar dinero a una meta de ahorro específica.
 */
export async function updateGoalProgress(goalId: string, montoAbonado: number, tx?: any) {
    const runner = tx || db;
    
    await runner
        .update(metasAhorro)
        .set({
            montoActual: sql`${metasAhorro.montoActual} + ${montoAbonado}`
        })
        .where(eq(metasAhorro.id, goalId));

    const metaActualizada = await runner
        .select()
        .from(metasAhorro)
        .where(eq(metasAhorro.id, goalId));

    return metaActualizada[0] || null;
}

/**
 * Eliminar una meta de ahorro por su ID.
 */
export async function deleteGoal(goalId: string) {
    await db.delete(metasAhorro).where(eq(metasAhorro.id, goalId));
    return true;
}
