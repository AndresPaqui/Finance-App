import * as LocalAuthentication from 'expo-local-authentication';

export const BiometricService = {
    /**
     * Verifica si el dispositivo cuenta con el hardware necesario
     * y si el usuario tiene huellas o rostro registrados.
     */
    checkHardwareyRegistro: async (): Promise<{ b_disponible: boolean; error?: string }> => {
        const tieneHardware = await LocalAuthentication.hasHardwareAsync();
        if (!tieneHardware) {
            return { b_disponible: false, error: 'El dispositivo no soporta biometría.' };
        }

        const tieneRegistros = await LocalAuthentication.isEnrolledAsync();
        if (!tieneRegistros) {
            return { b_disponible: false, error: 'No hay huellas o rostros guardados en el sistema.' };
        }

        return { b_disponible: true };
    },

    /**
     * Ejecuta la autenticación de Nivel 1: Desbloqueo de la Burbuja
     */
    autenticarNivel1: async (): Promise<boolean> => {
        const validacion = await BiometricService.checkHardwareyRegistro();
        if (!validacion.b_disponible) return false;

        const resultado = await LocalAuthentication.authenticateAsync({
            promptMessage: 'Desbloquear accesos rápidos',
            cancelLabel: 'Cancelar',
            disableDeviceFallback: false, // Permite PIN/Patrón si la biometría falla repetidamente
        });

        return resultado.success;
    },

    /**
     * Ejecuta la autenticación de Nivel 2: Acceso total al Dashboard financiero
     */
    autenticarNivel2: async (): Promise<boolean> => {
        const validacion = await BiometricService.checkHardwareyRegistro();
        if (!validacion.b_disponible) return false;

        const resultado = await LocalAuthentication.authenticateAsync({
            promptMessage: 'Confirmación de identidad: Acceso a balances reales',
            cancelLabel: 'Salir',
            disableDeviceFallback: false,
        });

        return resultado.success;
    }
};