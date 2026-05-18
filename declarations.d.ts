//Le decimos que el modulo de migrations.js es perfectamente leible aunque sea un archivo JS

/// <reference types="nativewind/types" />

declare module "*.css";

declare module './drizzle/migrations' {
    const migrations: any;
    export default migrations;
}