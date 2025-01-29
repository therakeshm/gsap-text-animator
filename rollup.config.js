import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";

const packageJson = require("./package.json");

const umdName = "TextAnimator";

const globals = {
  jquery: "$",
  gsap: "gsap",
};

const external = ["jquery", "gsap"];

const banner = `/*!
 * ${packageJson.name} v${packageJson.version}
 * ${packageJson.homepage}
 *
 * Copyright (c) ${new Date().getFullYear()} ${packageJson.author}
 * Version: ${packageJson.version} 
 * Author URL: ${packageJson.authorUrl}
 * Released under the ${packageJson.license} license
 *
 * Date: ${new Date().toISOString()}
 */`;

const makeConfig = (format, filename, plugins = []) => ({
  input: "src/textAnimator.js",
  output: {
    file: filename,
    format: format,
    name: umdName,
    globals,
    exports: "named",
    banner,
  },
  external,
  plugins: [resolve(), commonjs(), ...plugins],
});

export default [
  // UMD Development version
  makeConfig("umd", "dist/textAnimator.js"),

  // UMD Production version
  makeConfig("umd", "dist/textAnimator.min.js", [
    terser({
      output: {
        comments: /^!/,
      },
    }),
  ]),

  // ESM version
  makeConfig("es", "dist/textAnimator.esm.js"),

  // CommonJS version
  makeConfig("cjs", "dist/textAnimator.common.js"),
];
