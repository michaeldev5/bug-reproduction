// @ts-check
import { defineConfig } from "eslint/config";
import tsdoc from "eslint-plugin-tsdoc";

export default defineConfig({
  plugins: { tsdoc },
  rules: { "tsdoc/syntax": "error" },
});
