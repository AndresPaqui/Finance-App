import { create, TwConfig } from "twrnc";
import resolveConfig from "tailwindcss/resolveConfig";

// como usas module.exports:
const tailwindConfig = require("../../../tailwind.config");

const fullConfig = resolveConfig(tailwindConfig) as unknown as TwConfig;

const tw = create(fullConfig);

export default tw;