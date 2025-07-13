import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["./index.ts"],
  noExternal: ["@paperdex"],
  splitting: false,
  bundle: true,
  outDir: "./dist",
  clean: true,
  env: { IS_SERVER_BUILD: "true" },
  loader: { ".json": "copy" },
  minify: true,
  sourcemap: true,
  external: ["next/headers"],
});
