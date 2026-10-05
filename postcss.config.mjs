import { fileURLToPath } from "node:url";

const config = {
  plugins: {
    [fileURLToPath(new URL("./postcss-strip-bom.cjs", import.meta.url))]: {},
    "@tailwindcss/postcss": {},
  },
};

export default config;
