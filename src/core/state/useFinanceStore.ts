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

interface FinanceState {
    // --- ESTADOS (State) ---
    cuentasList: AccountBalance[];
    saldoTotalNeto: number;
    pendientesCount: number;      // Para el círculo rojo de los Break Points
    gastosHormigaMes: number;     // Acumulado de sándwiches/tabacos
    isRecordingVoz: boolean;      // Estado de la burbuja flotante
    isLoading: boolean;

    // --- Biometria ---
    isAppFullyUnlocked: boolean;
    isBubbleUnlocked: boolean;

    // --- ACCIONES (Actions) ---
    setLoading: (loading: boolean) => void;
    setRecordingVoz: (recording: boolean) => void;

    // --- Biometria (Actions) ---
    setAppFullyUnlock: (unlocked: boolean) => void;
    setBubbleUnlock: (unlocked: boolean) => void;

    // Sincronización inicial desde SQLite a la memoria de la app
    syncFromDatabase: (data: {
        cuentas: AccountBalance[];
        pendientes: number;
        hormiga: number;
    }) => void;

    // Actualización Optimista: Cambia el saldo al instante en la UI sin esperar a la DB
    registrarMovimientoOptimista: (params: {
        cuentaOrigenId: string;
        monto: number;
        comision: number;
        tipo: 'GASTO' | 'INGRESO';
        esHormiga: boolean;
    }) => void;

    // Incrementar los Break Points instantáneamente desde la burbuja
    addBreakPointOptimista: () => void;
}

// Creación del store con Zustand
export const useFinanceStore = create<FinanceState>((set) => ({
    // Valores iniciales por defecto
    cuentasList: [],
    saldoTotalNeto: 0,
    pendientesCount: 0,
    gastosHormigaMes: 0,
    isRecordingVoz: false,
    isLoading: true,

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
            saldoTotalNeto: neto,
            pendientesCount: data.pendientes,
            gastosHormigaMes: data.hormiga,
            isLoading: false,
        };
    }),

    registrarMovimientoOptimista: (params) => set((state) => {
        const { cuentaOrigenId, monto, comision, tipo, esHormiga } = params;
        const costoTotal = monto + comision;

        // Modificamos la cuenta afectada en memoria
        const nuevasCuentas = state.cuentasList.map((cuenta) => {
            if (cuenta.id !== cuentaOrigenId) return cuenta;

            let nuevoSaldo = cuenta.saldoActual;
            if (tipo === 'GASTO') {
                // Si es tarjeta de crédito, gastar aumenta la deuda interna
                nuevoSaldo = cuenta.tipo === 'TARJETA_CREDITO'
                    ? cuenta.saldoActual + costoTotal //Gastar aumenta la deuda
                    : cuenta.saldoActual - costoTotal;
            } else if (tipo === 'INGRESO') {
                nuevoSaldo = cuenta.tipo === 'TARJETA_CREDITO'
                    ? cuenta.saldoActual - monto // Pagar la tarjeta reduce la deuda
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
            gastosHormigaMes: esHormiga ? state.gastosHormigaMes + monto : state.gastosHormigaMes,
        };
    }),

    addBreakPointOptimista: () => set((state) => ({
        pendientesCount: state.pendientesCount + 1
    })),
}));