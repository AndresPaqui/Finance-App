export interface ParsedTransaction {
    monto: number;
    comision: number;
    tipo: 'GASTO' | 'INGRESO';
    categoriaNombre: string;
    cuentaAlias: string; // Se usará para hacer match con el ID real en el hook
    descripcion: string;
    esHormiga: boolean;
}

// Diccionarios de alias flexibles (Puedes expandirlos fácilmente)
const ALIAS_CUENTAS: Record<string, string[]> = {
    EFECTIVO: ['efectivo', 'mano', 'plata', 'cash', 'bolsillo'],
    BANCO_1: ['pichincha', 'banco', 'transferencia', 'cuenta', 'produbanco', 'guayaquil'],
    TARJETA_CREDITO: ['tarjeta', 'credito', 'discover', 'me', 'visa'],
};

const ALIAS_CATEGORIAS: Record<string, string[]> = {
    'Comida/Snacks': ['sandwich', 'comida', 'almuerzo', 'cafeteria', 'snack', 'papas', 'cola', 'comer', 'hambre'],
    'Transporte': ['pasaje', 'bus', 'taxi', 'uber', 'indrive', 'transporte', 'movilizacion'],
    'Entretenimiento': ['tabaco', 'cigarrillo', 'biela', 'cerveza', 'fiesta', 'salida', 'juego', 'play'],
    'Suscripciones': ['spotify', 'netflix', 'disney', 'stream', 'mensualidad'],
};

export function parseVozADatos(textoCrudo: string): ParsedTransaction {
    // 1. Normalización del texto
    const texto = textoCrudo
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Elimina acentos/tildes
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ''); // Elimina puntuación

    // 2. Determinar Tipo de Transacción
    let tipo: 'GASTO' | 'INGRESO' = 'GASTO';
    if (texto.includes('recibi') || texto.includes('deposito') || texto.includes('me transfirieron') || texto.includes('ingreso')) {
        tipo = 'INGRESO';
    }

    // 3. Extracción de Números (Montos y Comisiones)
    // Reemplaza "con" por un punto decimal (ej: "3 con 50" -> 3.50)
    const textoPrecesadoNumeros = texto.replace(/(\d+)\s+con\s+(\d+)/g, '$1.$2');
    const numerosEncontrados = textoPrecesadoNumeros.match(/\d+(\.\d+)?/g)?.map(Number) || [];

    let monto = 0;
    let comision = 0;

    if (numerosEncontrados.length > 0) {
        // Si la frase habla explícitamente de una comisión, aislamos ese valor
        if (texto.includes('comision') || texto.includes('extra')) {
            // Si hay dos números, asumimos que el menor o el segundo es la comisión
            if (numerosEncontrados.length >= 2) {
                monto = numerosEncontrados[0];
                comision = numerosEncontrados[1];
            } else {
                monto = numerosEncontrados[0];
            }
        } else {
            // Si no hay palabra comisión, el primer número es el monto total
            monto = numerosEncontrados[0];
        }
    }

    // 4. Identificar Cuenta de Origen/Destino mediante Alias
    let cuentaAlias = 'EFECTIVO'; // Cuenta por defecto si no se menciona una
    for (const [cuentaReal, palabrasClave] of Object.entries(ALIAS_CUENTAS)) {
        if (palabrasClave.some(palabra => texto.includes(palabra))) {
            cuentaAlias = cuentaReal;
            break;
        }
    }

    // 5. Identificar Categoría mediante Alias
    let categoriaNombre = 'Otros';
    let esGastoHormigaPotencial = false;

    for (const [catReal, palabrasClave] of Object.entries(ALIAS_CATEGORIAS)) {
        if (palabrasClave.some(palabra => texto.includes(palabra))) {
            categoriaNombre = catReal;
            break;
        }
    }

    // Regla de Negocio: Gastos menores a $5 en categorías no fijas son Hormiga
    if (tipo === 'GASTO' && monto < 5.0 && categoriaNombre !== 'Otros') {
        esGastoHormigaPotencial = true;
    }

    // 6. Intentar deducir una descripción corta
    // Extrae lo que esté después de "en un", "para el", "un", "unos"
    const matchDescripcion = textoCrudo.match(/(?:en un|para el|un|unos|por)\s+([a-zA-ZñÑáéíóúÁÉÍÓÚ\s]+?)(?:\s+de|\s+con|\s+usando|$)/i);
    const descripcion = matchDescripcion ? matchDescripcion[1].trim() : textoCrudo.substring(0, 30);

    return {
        monto,
        comision,
        tipo,
        categoriaNombre,
        cuentaAlias,
        descripcion,
        esHormiga: esGastoHormigaPotencial,
    };
}