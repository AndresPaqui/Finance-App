//Babel, compilador de JS, traduce el TS a JS moderno que cualquier telefono pueda ejecutar 

/* Plugin: inline-import. Por defecto los sistemas no entienden como importar un archivo de texto .sql 
el plugin "babel-plugin-inline-import" su funcion es interceptar los archivos de migracion .sql de drizzle durante la compilación y los convierte en simples cadena de texto de JS
en el mismo tiempo de ejecución permitiendo que la base de datos se configure sola al abrir la app*/

module.exports = function (api) {
    api.cache(true);
    return {
        presets: [
            'babel-preset-expo',
            // nativewind/babel exporta { plugins: [...] } → es un preset, no un plugin.
            // Incluirlo aquí evita el error ".plugins is not a valid Plugin property".
            'nativewind/babel',
        ],
        plugins: [
            [
                'babel-plugin-inline-import',
                {
                    extensions: ['.sql'],
                },
            ],
        ],
    };
};
