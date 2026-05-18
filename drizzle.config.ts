//Actua como puente entre el código de React native y la sabe de datos SQLite
/* Nos permite interactuar con la base de datos usando funciones purasd e TS como "db.insert() o db.select()"
En lugar de escribir cadenas largaaas de SQL a mano */
//Gracias a la segurar de tipado de typeScript nos daremos cuenta de inmediato si rompimos algo

import type { Config } from 'drizzle-kit';

export default {
    schema: './src/core/database/schema.ts',
    out: './drizzle',
    dialect: 'sqlite',
    driver: 'expo',
} satisfies Config;

