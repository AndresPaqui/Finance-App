import { eq } from 'drizzle-orm';
import * as Crypto from 'expo-crypto';
import { db } from '../db';
import { cuentas } from '../schema';

export type AccountType = 'EFECTIVO' | 'BANCO' | 'TARJETA_CREDITO';

export interface CreateAccountInput {
    id?: string;
    nombre: string;
    tipo: AccountType;
    saldoActual?: number;
    limiteCredito?: number;
    fechaCorte?: number;
    fechaPago?: number;
    presetId?: string;
    colorGradienteInicio?: string;
    colorGradienteFin?: string;
    icono?: string;
}

/**
 * Obtener todas las cuentas registradas en la base de datos local.
 */
export async function getAllAccounts() {
    return await db.select().from(cuentas);
}

/**
 * Obtener una cuenta específica por su ID.
 */
export async function getAccountById(accountNominatedId: string, tx?: any) {
    const runner = tx || db;
    const result = await runner.select().from(cuentas).where(eq(cuentas.id, accountNominatedId));
    return result[0] || null;
}

/**
 * Actualiza el saldo de una cuenta considerando el tipo de movimiento y el tipo de cuenta.
 * Para Tarjetas de Crédito, un GASTO incrementa la deuda (saldoActual) y un INGRESO/Pago la reduce.
 * Para Efectivo y Bancos, un GASTO reduce el saldo y un INGRESO lo incrementa.
 */
export async function updateAccountBalance(
    cuentaId: string,
    montoTotal: number,
    tipo: 'GASTO' | 'INGRESO' | 'TRANSFERENCIA',
    tx?: any
) {
    const runner = tx || db;
    const targetCuenta = await getAccountById(cuentaId, runner);

    if (!targetCuenta) {
        throw new Error(`La cuenta con ID "${cuentaId}" no existe.`);
    }

    let nuevoSaldo = targetCuenta.saldoActual;
    const esTarjeta = targetCuenta.tipo === 'TARJETA_CREDITO';

    if (tipo === 'GASTO') {
        nuevoSaldo = esTarjeta ? targetCuenta.saldoActual + montoTotal : targetCuenta.saldoActual - montoTotal;
    } else if (tipo === 'INGRESO') {
        nuevoSaldo = esTarjeta ? targetCuenta.saldoActual - montoTotal : targetCuenta.saldoActual + montoTotal;
    }

    await runner
        .update(cuentas)
        .set({ saldoActual: nuevoSaldo })
        .where(eq(cuentas.id, cuentaId));

    return nuevoSaldo;
}

/**
 * Crear una nueva cuenta en la base de datos.
 */
export async function createAccount(input: CreateAccountInput) {
    const id = input.id || Crypto.randomUUID();
    const nuevaCuenta = {
        id,
        nombre: input.nombre,
        tipo: input.tipo,
        saldoActual: input.saldoActual ?? 0,
        limiteCredito: input.limiteCredito ?? null,
        fechaCorte: input.fechaCorte ?? null,
        fechaPago: input.fechaPago ?? null,
        presetId: input.presetId ?? null,
        colorGradienteInicio: input.colorGradienteInicio ?? null,
        colorGradienteFin: input.colorGradienteFin ?? null,
        icono: input.icono ?? null,
    };

    await db.insert(cuentas).values(nuevaCuenta);
    return nuevaCuenta;
}
