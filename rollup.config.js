import { terser } from "rollup-plugin-terser";
import filesize from "rollup-plugin-filesize";
import gzipPlugin from "rollup-plugin-gzip";
import resolve from 'rollup-plugin-node-resolve';
import commonjs from "rollup-plugin-commonjs";

export default [
  {
    input: "src/index.js",
    output: [
      {
        file: "dist/index.js",
        format: "module",
        name: "Layout",
        sourcemap: true,
        plugins: [terser(), gzipPlugin(), filesize()],
      },
    ],

    plugins: [resolve(), commonjs()],
  },
];
