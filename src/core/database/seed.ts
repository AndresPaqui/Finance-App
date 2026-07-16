// src/core/database/seed.ts
import { SQLiteDatabase } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { cuentas, categorias, transacciones } from './schema';
import * as Crypto from 'expo-crypto';

export async function seedDatabase(expoDb: SQLiteDatabase) {
    const db = drizzle(expoDb);

    console.log('🌱 Iniciando sembrado de base de datos...');

    try {
        // 1. Limpiar datos existentes (Opcional, para desarrollo)
        await db.delete(transacciones);
        await db.delete(cuentas);
        await db.delete(categorias);

        // 2. Crear Cuentas
        const idEfectivo = Crypto.randomUUID();
        const idDebito = Crypto.randomUUID();
        const idCredito = Crypto.randomUUID();

        await db.insert(cuentas).values([
            { id: idEfectivo, nombre: 'Efectivo', tipo: 'EFECTIVO', saldoActual: 20.00 },
            { id: idDebito, nombre: 'Débito', tipo: 'BANCO', saldoActual: 306.00 },
            { id: idCredito, nombre: 'Crédito', tipo: 'TARJETA_CREDITO', saldoActual: 100.00 },
        ]);

        // 3. Crear Categorías
        const catComidaId = Crypto.randomUUID();
        const catTransporteId = Crypto.randomUUID();
        const catSueldoId = Crypto.randomUUID();
        const catSnacksId = Crypto.randomUUID(); // Fuga de dinero / hormiga

        await db.insert(categorias).values([
            { id: catComidaId, nombre: 'Comida', esNecesidad: true },
            { id: catTransporteId, nombre: 'Transporte', esNecesidad: true },
            { id: catSueldoId, nombre: 'Sueldo', esNecesidad: false },
            { id: catSnacksId, nombre: 'Snacks', esNecesidad: false },
        ]);

        // 4. Crear Transacciones simulando fechas (ISO strings)
        const hoy = new Date();
        const ayer = new Date(hoy); ayer.setDate(ayer.getDate() - 1);
        const haceTresDias = new Date(hoy); haceTresDias.setDate(haceTresDias.getDate() - 3);

        await db.insert(transacciones).values([
            {
                id: Crypto.randomUUID(),
                cuentaOrigenId: idDebito,
                categoriaId: catSueldoId,
                monto: 3200.00,
                tipo: 'INGRESO',
                descripcion: 'Nómina Quincenal',
                fechaCreacion: haceTresDias.toISOString(),
            },
            {
                id: Crypto.randomUUID(),
                cuentaOrigenId: idEfectivo,
                categoriaId: catSnacksId,
                monto: 3.50, // Gasto hormiga
                comision: 0,
                tipo: 'GASTO',
                descripcion: 'Cafetería Central',
                fechaCreacion: hoy.toISOString(),
            },
            {
                id: Crypto.randomUUID(),
                cuentaOrigenId: idCredito,
                categoriaId: catComidaId,
                monto: 25.00,
                comision: 1.50, // Comisión bancaria
                tipo: 'GASTO',
                descripcion: 'Pizza Express',
                fechaCreacion: ayer.toISOString(),
            }
        ]);

        console.log('✅ Base de datos sembrada con éxito.');
    } catch (error) {
        console.error('❌ Error al sembrar la base de datos:', error);
    }
}