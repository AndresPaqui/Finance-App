// src/core/database/seed.ts
import { SQLiteDatabase } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { cuentas, categorias, transacciones, metasAhorro } from './schema';
import * as Crypto from 'expo-crypto';

export async function seedDatabase(expoDb: SQLiteDatabase) {
    const db = drizzle(expoDb);

    console.log('🌱 Iniciando sembrado de base de datos...');

    try {
        // 1. Limpiar datos existentes 
        await db.delete(transacciones);
        await db.delete(metasAhorro);
        await db.delete(cuentas);
        await db.delete(categorias);

        // 2. Crear Cuentas (Efectivo $20 + Débito $506.82 - Deuda Crédito $100 = Neto $426.82)
        const idEfectivo = Crypto.randomUUID();
        const idDebito = Crypto.randomUUID();
        const idCredito = Crypto.randomUUID();

        await db.insert(cuentas).values([
            { id: idEfectivo, nombre: 'Efectivo', tipo: 'EFECTIVO', saldoActual: 20.00 },
            { id: idDebito, nombre: 'Débito', tipo: 'BANCO', saldoActual: 506.82 },
            { id: idCredito, nombre: 'Crédito', tipo: 'TARJETA_CREDITO', saldoActual: 100.00 },
        ]);

        // 3. Crear Metas de Ahorro
        await db.insert(metasAhorro).values([
            {
                id: Crypto.randomUUID(),
                nombreMeta: 'PS5 Slim',
                montoObjetivo: 500.00,
                montoActual: 320.00,
            }
        ]);

        // 4. Crear Categorías
        const catComidaId = Crypto.randomUUID();
        const catTransporteId = Crypto.randomUUID();
        const catSaludId = Crypto.randomUUID();
        const catEducacionId = Crypto.randomUUID();
        const catSueldoId = Crypto.randomUUID();
        const catSnacksId = Crypto.randomUUID(); // Fuga de dinero / hormiga
        const catEntreteId = Crypto.randomUUID();

        await db.insert(categorias).values([
            { id: catComidaId, nombre: 'Comida', esNecesidad: true },
            { id: catTransporteId, nombre: 'Transporte', esNecesidad: true },
            { id: catSaludId, nombre: 'Salud', esNecesidad: true },
            { id: catEducacionId, nombre: 'Educación', esNecesidad: true },
            { id: catSueldoId, nombre: 'Sueldo', esNecesidad: false },
            { id: catSnacksId, nombre: 'Snacks', esNecesidad: false },
            { id: catEntreteId, nombre: 'Entretenimiento', esNecesidad: false },
        ]);

        // 5. Crear Transacciones simulando fechas (ISO strings)
        const hoy = new Date();
        const ayer = new Date(hoy); ayer.setDate(ayer.getDate() - 1);
        const haceDosDias = new Date(hoy); haceDosDias.setDate(haceDosDias.getDate() - 2);
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
                cuentaOrigenId: idDebito,
                categoriaId: catEducacionId,
                monto: 850.00,
                tipo: 'GASTO',
                descripcion: 'Matrícula Universidad',
                fechaCreacion: haceDosDias.toISOString(),
            },
            {
                id: Crypto.randomUUID(),
                cuentaOrigenId: idDebito,
                categoriaId: catComidaId,
                monto: 150.00,
                tipo: 'GASTO',
                descripcion: 'Supermercado',
                fechaCreacion: haceDosDias.toISOString(),
            },
            {
                id: Crypto.randomUUID(),
                cuentaOrigenId: idDebito,
                categoriaId: catTransporteId,
                monto: 100.00,
                comision: 3.25, // Comisión cajero
                tipo: 'GASTO',
                descripcion: 'Retiro ATM y Transporte',
                fechaCreacion: haceDosDias.toISOString(),
            },
            {
                id: Crypto.randomUUID(),
                cuentaOrigenId: idDebito,
                categoriaId: catSaludId,
                monto: 32.40,
                tipo: 'GASTO',
                descripcion: 'Farmacia',
                fechaCreacion: ayer.toISOString(),
            },
            {
                id: Crypto.randomUUID(),
                cuentaOrigenId: idCredito,
                categoriaId: catComidaId,
                monto: 25.00,
                comision: 1.50, // Comisión bancaria (3.25 + 1.50 = $4.75 total comisiones)
                tipo: 'GASTO',
                descripcion: 'Pizza Express',
                fechaCreacion: ayer.toISOString(),
            },
            // Gastos hormiga en snacks: 14.50 + 15.00 + 12.50 = $42.00 exactos
            {
                id: Crypto.randomUUID(),
                cuentaOrigenId: idDebito,
                categoriaId: catSnacksId,
                monto: 14.50,
                tipo: 'GASTO',
                descripcion: 'Cafetería Campus',
                fechaCreacion: haceDosDias.toISOString(),
            },
            {
                id: Crypto.randomUUID(),
                cuentaOrigenId: idEfectivo,
                categoriaId: catSnacksId,
                monto: 15.00,
                tipo: 'GASTO',
                descripcion: 'Heladería y Snacks',
                fechaCreacion: ayer.toISOString(),
            },
            {
                id: Crypto.randomUUID(),
                cuentaOrigenId: idEfectivo,
                categoriaId: catSnacksId,
                monto: 12.50,
                tipo: 'GASTO',
                descripcion: 'Cafetería Central',
                fechaCreacion: hoy.toISOString(),
            },
            {
                id: Crypto.randomUUID(),
                cuentaOrigenId: idCredito,
                categoriaId: catEntreteId,
                monto: 75.00,
                tipo: 'GASTO',
                descripcion: 'Cine y Bowling',
                fechaCreacion: hoy.toISOString(),
            }
        ]);

        console.log('✅ Base de datos sembrada con éxito.');
    } catch (error) {
        console.error('❌ Error al sembrar la base de datos:', error);
    }
}