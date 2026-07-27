//Aqui se controlará el saldo disponible total, el estado de la burbuja y los contadores de los Break Points pendientes en tiempo real.

import { create } from 'zustand';

// Interfaces de TypeScript para asegurar el tipado estricto
export interface AccountBalance {
    id: string;
    nombre: string;
    tipo: 'EFECTIVO' | 'BANCO' | 'TARJETA_CREDITO';
    saldoActual: number;
    limiteCredito?: number;
}

export interface TransactionItem {
    id: string;
    cuentaOrigenId: string;
    categoriaNombre: string; // Join con Categorias
    monto: number;
    comision: number;
    tipo: 'INGRESO' | 'GASTO' | 'TRANSFERENCIA';
    descripcion: string | null;
    fechaCreacion: string;
    esNecesidad: boolean; // Para el termómetro
}

export interface MetaAhorroItem {
    id: string;
    nombreMeta: string;
    montoObjetivo: number;
    montoActual: number;
}

interface FinanceState {
    // --- Estados para el core ---
    cuentasList: AccountBalance[];
    transaccionesList: TransactionItem[];
    metasAhorroList: MetaAhorroItem[];
    saldoTotalNeto: number;
    pendientesCount: number;      // Para el círculo rojo de los Break Points
    isRecordingVoz: boolean;      // Estado de la burbuja flotante
    isLoading: boolean;

    // --- Estados para el analiticas ---

    ingresosMes: number;
    gastosMes: number;
    gastosHormigaMes: number;     // Acumulado de sándwiches/tabacos
    comisionesMes: number;

    // --- Biometria ---
    isAppFullyUnlocked: boolean;
    isBubbleUnlocked: boolean;

    // --- ACCIONES (setter simples) ---
    setLoading: (loading: boolean) => void;
    setRecordingVoz: (recording: boolean) => void;

    // --- Biometria (setter simples) ---
    setAppFullyUnlock: (unlocked: boolean) => void;
    setBubbleUnlock: (unlocked: boolean) => void;

    // Sincronización inicial desde SQLite a la memoria de la app Acciones del core
    syncFromDatabase: (data: {
        cuentas: AccountBalance[];
        transacciones: TransactionItem[];
        metas: MetaAhorroItem[];
        pendientes: number;
        analiticas: {
            hormiga: number,
            ingresos: number;
            gastos: number;
            comisiones: number;
        }
    }) => void;

    // Actualización Optimista: Cambia el saldo al instante en la UI sin esperar a la DB
    registrarMovimientoOptimista: (params: {
        cuentaOrigenId: string;
        monto: number;
        comision: number;
        tipo: 'GASTO' | 'INGRESO';
        esHormiga: boolean;
        nuevaTransaccionFake: TransactionItem; //Esto mostrara la transacion en la lista de forma inmediata

    }) => void;

    // Incrementar los Break Points instantáneamente desde la burbuja
    addBreakPointOptimista: () => void;

    // --- ACCIONES ASÍNCRONAS CON BD ---
    addAccountState: (cuenta: AccountBalance) => void;
    addGoalState: (meta: MetaAhorroItem) => void;
    updateGoalState: (meta: MetaAhorroItem) => void;
}

// Creación del store con Zustand
export const useFinanceStore = create<FinanceState>((set) => ({
    // Valores iniciales por defecto
    cuentasList: [],
    transaccionesList: [],
    metasAhorroList: [],
    saldoTotalNeto: 0,
    pendientesCount: 0,
    ingresosMes: 0,
    gastosMes: 0,
    gastosHormigaMes: 0,
    comisionesMes: 0,
    isLoading: true,
    isRecordingVoz: false,

    //Biometria
    isAppFullyUnlocked: false,
    isBubbleUnlocked: false,

    // --- ACCIONES (Actions) ---
    setLoading: (loading) => set({ isLoading: loading }),
    setRecordingVoz: (recording) => set({ isRecordingVoz: recording }),

    // --- Biometria (Actions) ---
    setAppFullyUnlock: (unlocked) => set({ isAppFullyUnlocked: unlocked }),
    setBubbleUnlock: (unlocked) => set({ isBubbleUnlocked: unlocked }),


    syncFromDatabase: (data) => set(() => {
        // Calculamos el dinero real disponible (Efectivo + Bancos - Deuda de Tarjetas)
        const neto = data.cuentas.reduce((acc, cuenta) => {
            if (cuenta.tipo === 'TARJETA_CREDITO') {
                return acc - cuenta.saldoActual; // Resta la deuda de la tarjeta
            }
            return acc + cuenta.saldoActual;    // Suma el efectivo y bancos
        }, 0);

        return {
            cuentasList: data.cuentas,
            transaccionesList: data.transacciones,
            metasAhorroList: data.metas,
            saldoTotalNeto: neto,
            pendientesCount: data.pendientes,
            gastosHormigaMes: data.analiticas.hormiga,
            ingresosMes: data.analiticas.ingresos,
            gastosMes: data.analiticas.gastos,
            comisionesMes: data.analiticas.comisiones,
            isLoading: false,
        };
    }),

    registrarMovimientoOptimista: (params) => set((state) => {
        const { cuentaOrigenId, monto, comision, tipo, esHormiga, nuevaTransaccionFake } = params;
        const costoTotal = monto + comision;

        // Modificamos la cuenta afectada en memoria
        const nuevasCuentas = state.cuentasList.map((cuenta) => {
            if (cuenta.id !== cuentaOrigenId) return cuenta;

            let nuevoSaldo = cuenta.saldoActual;
            if (tipo === 'GASTO') {
                nuevoSaldo = cuenta.tipo === 'TARJETA_CREDITO'
                    ? cuenta.saldoActual + costoTotal
                    : cuenta.saldoActual - costoTotal;
            } else if (tipo === 'INGRESO') {
                nuevoSaldo = cuenta.tipo === 'TARJETA_CREDITO'
                    ? cuenta.saldoActual - monto
                    : cuenta.saldoActual + monto;
            }

            return { ...cuenta, saldoActual: nuevoSaldo };
        });

        // Recalculamos el balance neto global con los nuevos datos mutados
        const nuevoNeto = nuevasCuentas.reduce((acc, c) => {
            return c.tipo === 'TARJETA_CREDITO' ? acc - c.saldoActual : acc + c.saldoActual;
        }, 0);

        return {
            cuentasList: nuevasCuentas,
            saldoTotalNeto: nuevoNeto,
            transaccionesList: [nuevaTransaccionFake, ...state.transaccionesList],
            gastosHormigaMes: esHormiga ? state.gastosHormigaMes + monto : state.gastosHormigaMes,
            gastosMes: tipo === 'GASTO' ? state.gastosMes + monto : state.gastosMes,
            ingresosMes: tipo === 'INGRESO' ? state.ingresosMes + monto : state.ingresosMes,
            comisionesMes: state.comisionesMes + comision,
        };
    }),

    addBreakPointOptimista: () => set((state) => ({
        pendientesCount: state.pendientesCount + 1
    })),

    addAccountState: (cuenta) => set((state) => {
        const nuevasCuentas = [...state.cuentasList, cuenta];
        const nuevoNeto = nuevasCuentas.reduce((acc, c) => {
            return c.tipo === 'TARJETA_CREDITO' ? acc - c.saldoActual : acc + c.saldoActual;
        }, 0);
        return {
            cuentasList: nuevasCuentas,
            saldoTotalNeto: nuevoNeto,
        };
    }),

    addGoalState: (meta) => set((state) => ({
        metasAhorroList: [...state.metasAhorroList, meta]
    })),

    updateGoalState: (metaActualizada) => set((state) => ({
        metasAhorroList: state.metasAhorroList.map((m) => m.id === metaActualizada.id ? metaActualizada : m)
    })),
}));