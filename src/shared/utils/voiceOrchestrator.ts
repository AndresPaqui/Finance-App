import { parseVozADatos, ParsedTransaction } from './voiceParser';
import { NativeModules } from 'react-native';

// Suponiendo que expondremos el AICore de Android a través de un NativeModule llamado 'AiCoreBridge'
const { AiCoreBridge } = NativeModules;

export const VoiceOrchestrator = {
    /**
     * Procesa el texto de voz eligiendo el mejor motor disponible según el hardware
     */
    procesarTextoVoz: async (textoCrudo: string): Promise<ParsedTransaction> => {
        try {
            // 1. Verificar si el dispositivo soporta IA local (ej: tu S23)
            const esIaDisponible = AiCoreBridge ? await AiCoreBridge.isModelAvailable() : false;

            if (esIaDisponible) {
                console.log('🤖 Ejecutando procesamiento avanzado con IA local (SLM)...');
                return await VoiceOrchestrator.procesarConIaLocal(textoCrudo);
            }
        } catch (error) {
            console.warn('La IA local falló o no está lista. Aplicando degradación graciosa al algoritmo tradicional.', error);
        }

        // 2. Fallback: Si no hay IA o falla, el algoritmo tradicional salva el día
        console.log('⚡ Ejecutando procesamiento rápido por Algoritmo/Regex...');
        return parseVozADatos(textoCrudo);
    },

    /**
     * Pasa el texto por el modelo de lenguaje pequeño integrado en el teléfono
     */
    procesarConIaLocal: async (textoCrudo: string): Promise<ParsedTransaction> => {
        const systemPrompt = `
      Eres un extractor de datos financieros de nivel bancario y ultra preciso. 
      Tu única tarea es transformar el texto conversacional que te dé el usuario en un objeto JSON estricto y limpio.

      Campos obligatorios que debes extraer en el JSON:
      - monto: (número flotante, ej: 3.50. Si dice "3 con 50" conviértelo a 3.50).
      - comision: (número flotante, el costo extra por transferencia o retiro si se menciona. Por defecto 0.0).
      - tipo: (Únicamente 'GASTO' o 'INGRESO').
      - categoriaNombre: (Analiza el contexto. Si encaja con las comunes, usa una de estas: 'Comida/Snacks', 'Transporte', 'Entretenimiento', 'Suscripciones'. SI ES UNA CATEGORÍA TOTALMENTE NUEVA Y DIFERENTE como juegos, gimnasio, medicina, estudios, créala usando una sola palabra con la primera letra en mayúscula), "Otros" si el texto es totalmente ambiguo y no especifica el objeto del gasto o ingreso..
      - cuentaAlias: (Identifica el método de pago analizando los sinónimos. Elige únicamente una de estas tres opciones: 'EFECTIVO', 'BANCO_1', 'TARJETA_CREDITO').
      - descripcion: (Un texto muy corto, máximo 3 palabras, que describa qué compró o qué ingresó el usuario. Ej: "un sándwich", "pasajes de bus", "un tabaco").

      Reglas críticas de formato:
      - Prohibido agregar texto introductorio como "Aquí está tu JSON:".
      - Prohibido dar explicaciones o notas al final.
      - Devuelve exclusivamente el objeto JSON puro y plano.

      Texto del usuario a procesar: "${textoCrudo}"
    `;
        // Llamada al chip nativo del S23 (AICore / Gemini Nano)
        const jsonStringCrudo = await AiCoreBridge.executePrompt(systemPrompt);

        // Sanitizar la respuesta por si la IA agregó bloques de código ```json ... ```
        const jsonLimpio = jsonStringCrudo.replace(/```json|```/g, '').trim();

        const resultadoIa = JSON.parse(jsonLimpio);

        // Regla de negocio automatizada para el Gasto Hormiga
        const esGastoHormiga = resultadoIa.tipo === 'GASTO' &&
            resultadoIa.monto < 5.0 &&
            resultadoIa.categoriaNombre !== 'Otros';

        return {
            monto: Number(resultadoIa.monto) || 0,
            comision: Number(resultadoIa.comision) || 0,
            tipo: resultadoIa.tipo || 'GASTO',
            categoriaNombre: resultadoIa.categoriaNombre || 'Otros',
            cuentaAlias: resultadoIa.cuentaAlias || 'EFECTIVO',
            descripcion: resultadoIa.descripcion || textoCrudo.substring(0, 30),
            esHormiga: esGastoHormiga,
        };
    }
};