import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

//Estructura de los datos 
//Esto es como un plano arquitectonico de las tablas que se van a crear en el dispositivo mobile 
//Definir qué tablas existen, tipo de datos que almacenan por columna. Ej: Una transacción pertenece obligatoriamente a cuenta 


// 1. Tabla de Cuentas (Efectivo, Bancos, Tarjetas)
export const cuentas = sqliteTable('cuentas', {
    id: text('id').primaryKey(),
    nombre: text('nombre').notNull(),
    tipo: text('tipo', { enum: ['EFECTIVO', 'BANCO', 'TARJETA_CREDITO'] }).notNull(),
    saldoActual: real('saldo_actual').notNull().default(0.0),
    limiteCredito: real('limite_credito'), // Solo para tarjetas
    fechaCorte: integer('fecha_corte'),    // Solo para tarjetas
    fechaPago: integer('fecha_pago'),      // Solo para tarjetas
});

// 2. Tabla de Categorías
export const categorias = sqliteTable('categorias', {
    id: text('id').primaryKey(),
    nombre: text('nombre').notNull().unique(),
    esNecesidad: integer('es_necesidad', { mode: 'boolean' }).notNull().default(false),
});

// 3. Tabla Principal de Transacciones
export const transacciones = sqliteTable('transacciones', {
    id: text('id').primaryKey(),
    cuentaOrigenId: text('cuenta_origen_id')
        .notNull()
        .references(() => cuentas.id, { onDelete: 'cascade' }),
    cuentaDestinoId: text('cuenta_destino_id')
        .references(() => cuentas.id, { onDelete: 'set null' }), // Solo para transferencias propias
    categoriaId: text('categoria_id')
        .notNull()
        .references(() => categorias.id),
    monto: real('monto').notNull(),
    comision: real('comision').notNull().default(0.0),
    tipo: text('tipo', { enum: ['INGRESO', 'GASTO', 'TRANSFERENCIA'] }).notNull(),
    descripcion: text('descripcion'),
    esPendiente: integer('es_pendiente', { mode: 'boolean' }).notNull().default(false), // Break Point
    requiereRevision: integer('requiere_revision', { mode: 'boolean' }).notNull().default(false), // Error NLP
    fechaCreacion: text('fecha_creacion').notNull(), // Almacenado como ISO string
});

// 4. Tabla de Cuentas por Cobrar (Gastos Compartidos con Amigos)
export const deudasAmigos = sqliteTable('deudas_amigos', {
    id: text('id').primaryKey(),
    transaccionId: text('transaccion_id')
        .notNull()
        .references(() => transacciones.id, { onDelete: 'cascade' }),
    nombreAmigo: text('nombre_amigo').notNull(),
    montoDebe: real('monto_debe').notNull(),
    estaPagado: integer('esta_pagado', { mode: 'boolean' }).notNull().default(false),
});

// 5. Tabla de Metas de Ahorro (Gamificación/Alcancías)
export const metasAhorro = sqliteTable('metas_ahorro', {
    id: text('id').primaryKey(),
    nombreMeta: text('nombre_meta').notNull(),
    montoObjetivo: real('monto_obj_gta').notNull(),
    montoActual: real('monto_actual').notNull().default(0.0),
});