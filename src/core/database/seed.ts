// src/core/database/seed.ts
import { SQLiteDatabase } from 'expo-sqlite';
import * as Crypto from 'expo-crypto';

export async function seedDatabase(expoDb: SQLiteDatabase) {
    console.log('🌱 Iniciando verificación asincrónica de base de datos...');

    try {
        // 0. Auto-migración defensiva: asegurar que la tabla cuentas tenga las nuevas columnas
        await expoDb.execAsync('ALTER TABLE cuentas ADD COLUMN preset_id TEXT;').catch(() => {});
        await expoDb.execAsync('ALTER TABLE cuentas ADD COLUMN color_gradiente_inicio TEXT;').catch(() => {});
        await expoDb.execAsync('ALTER TABLE cuentas ADD COLUMN color_gradiente_fin TEXT;').catch(() => {});
        await expoDb.execAsync('ALTER TABLE cuentas ADD COLUMN icono TEXT;').catch(() => {});

        // 1. Verificación asincrónica: Comprobar si ya existen cuentas registradas
        const checkRows = await expoDb.getAllAsync<{ count: number }>(
            'SELECT COUNT(*) as count FROM cuentas;'
        ).catch(() => [{ count: 0 }]);

        if (checkRows && checkRows.length > 0 && checkRows[0].count >= 3) {
            console.log('ℹ️ Base de datos ya sembrada con las 3 billeteras iniciales. Omitiendo siembra inicial.');
            return;
        }

        console.log('🌱 Ejecutando siembra inicial de datos en SQLite...');

        // 2. Limpieza de datos previa en orden de llaves foráneas
        await expoDb.execAsync(`
            DELETE FROM transacciones;
            DELETE FROM deudas_amigos;
            DELETE FROM metas_ahorro;
            DELETE FROM cuentas;
            DELETE FROM categorias;
        `);

        // 3. Crear 8 Cuentas de Prueba representando cada Preset Corporativo
        const idPichincha = Crypto.randomUUID();
        const idGuayaquil = Crypto.randomUUID();
        const idProdubanco = Crypto.randomUUID();
        const idPacifico = Crypto.randomUUID();
        const idDiscover = Crypto.randomUUID();
        const idVisa = Crypto.randomUUID();
        const idDeuna = Crypto.randomUUID();
        const idEfectivo = Crypto.randomUUID();

        const insertCuentaStmt = `INSERT INTO cuentas (id, nombre, tipo, saldo_actual, limite_credito, preset_id, color_gradiente_inicio, color_gradiente_fin) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`;

        // 1. Banco Pichincha
        await expoDb.runAsync(insertCuentaStmt, [idPichincha, 'Banco Pichincha', 'BANCO', 506.82, null, 'pichincha', '#CA8A04', '#FACC15']);
        // 2. Discover
        await expoDb.runAsync(insertCuentaStmt, [idDiscover, 'Discover', 'TARJETA_CREDITO', 180.00, 600.00, 'discover', '#F26622', '#1F2937']);
        // 3. Efectivo
        await expoDb.runAsync(insertCuentaStmt, [idEfectivo, 'Efectivo', 'EFECTIVO', 45.00, null, 'efectivo', '#10B981', '#047857']);

        // 4. Crear Metas de Ahorro
        await expoDb.runAsync(
            `INSERT INTO metas_ahorro (id, nombre_meta, monto_obj_gta, monto_actual) VALUES (?, ?, ?, ?);`,
            [Crypto.randomUUID(), 'PS5 Slim', 500.00, 320.00]
        );

        // 5. Crear Categorías
        const catComidaId = Crypto.randomUUID();
        const catTransporteId = Crypto.randomUUID();
        const catSaludId = Crypto.randomUUID();
        const catEducacionId = Crypto.randomUUID();
        const catSueldoId = Crypto.randomUUID();
        const catSnacksId = Crypto.randomUUID();
        const catEntreteId = Crypto.randomUUID();

        const insertCatStmt = `INSERT INTO categorias (id, nombre, es_necesidad) VALUES (?, ?, ?);`;
        await expoDb.runAsync(insertCatStmt, [catComidaId, 'Comida', 1]);
        await expoDb.runAsync(insertCatStmt, [catTransporteId, 'Transporte', 1]);
        await expoDb.runAsync(insertCatStmt, [catSaludId, 'Salud', 1]);
        await expoDb.runAsync(insertCatStmt, [catEducacionId, 'Educación', 1]);
        await expoDb.runAsync(insertCatStmt, [catSueldoId, 'Sueldo', 0]);
        await expoDb.runAsync(insertCatStmt, [catSnacksId, 'Snacks', 0]);
        await expoDb.runAsync(insertCatStmt, [catEntreteId, 'Entretenimiento', 0]);

        // 6. Crear Transacciones simulando fechas
        const hoy = new Date();
        const ayer = new Date(hoy); ayer.setDate(ayer.getDate() - 1);
        const haceDosDias = new Date(hoy); haceDosDias.setDate(haceDosDias.getDate() - 2);
        const haceTresDias = new Date(hoy); haceTresDias.setDate(haceTresDias.getDate() - 3);

        const insertTxStmt = `INSERT INTO transacciones (id, cuenta_origen_id, categoria_id, monto, comision, tipo, descripcion, fecha_creacion) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`;

        await expoDb.runAsync(insertTxStmt, [Crypto.randomUUID(), idPichincha, catSueldoId, 3200.00, 0.0, 'INGRESO', 'Nómina Quincenal', haceTresDias.toISOString()]);
        await expoDb.runAsync(insertTxStmt, [Crypto.randomUUID(), idPichincha, catEducacionId, 850.00, 0.0, 'GASTO', 'Matrícula Universidad', haceDosDias.toISOString()]);
        await expoDb.runAsync(insertTxStmt, [Crypto.randomUUID(), idPichincha, catComidaId, 150.00, 0.0, 'GASTO', 'Supermercado', haceDosDias.toISOString()]);
        await expoDb.runAsync(insertTxStmt, [Crypto.randomUUID(), idPichincha, catTransporteId, 100.00, 3.25, 'GASTO', 'Retiro ATM y Transporte', haceDosDias.toISOString()]);
        await expoDb.runAsync(insertTxStmt, [Crypto.randomUUID(), idPichincha, catSaludId, 32.40, 0.0, 'GASTO', 'Farmacia', ayer.toISOString()]);
        await expoDb.runAsync(insertTxStmt, [Crypto.randomUUID(), idDiscover, catComidaId, 25.00, 1.50, 'GASTO', 'Pizza Express', ayer.toISOString()]);
        await expoDb.runAsync(insertTxStmt, [Crypto.randomUUID(), idPichincha, catSnacksId, 14.50, 0.0, 'GASTO', 'Cafetería Campus', haceDosDias.toISOString()]);
        await expoDb.runAsync(insertTxStmt, [Crypto.randomUUID(), idEfectivo, catSnacksId, 15.00, 0.0, 'GASTO', 'Heladería y Snacks', ayer.toISOString()]);
        await expoDb.runAsync(insertTxStmt, [Crypto.randomUUID(), idEfectivo, catSnacksId, 12.50, 0.0, 'GASTO', 'Cafetería Central', hoy.toISOString()]);
        await expoDb.runAsync(insertTxStmt, [Crypto.randomUUID(), idDiscover, catEntreteId, 75.00, 0.0, 'GASTO', 'Cine y Bowling', hoy.toISOString()]);

        console.log('✅ Base de datos sembrada asincrónicamente con éxito.');
    } catch (error) {
        console.error('❌ Error al sembrar la base de datos de forma asincrónica:', error);
    }
}