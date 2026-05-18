// This file is required for Expo/React Native SQLite migrations - https://orm.drizzle.team/quick-sqlite/expo

import journal from './meta/_journal.json';
import m0000 from './0000_lame_snowbird.sql';

console.log("¡Forzando a Metro a leer el SQL con el parentesis corregido!");

export default {
  journal,
  migrations: {
    m0000
  }
}
