import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));


export default defineConfig({
  base: "http://localhost:5003/",

  plugins: [
    react(),
    federation({
      name: "asset_management",
      filename: "remoteEntry.js",
      manifest: true,
      dts: false,
      exposes: {
        "./AssetApp": "./src/App.jsx",
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: false,
        },
        "react-dom": {
          singleton: true,
          requiredVersion: false,
        },
        "react-router-dom": {
          singleton: true,
          requiredVersion: false,
        },
      },
    }),
  ],

  server: {
    port: 5003,
    cors: true,
  },

  preview: {
    port: 5003,
    strictPort: true,
    cors: true,
  },

  build: {
    target: "esnext",
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        assetFileNames: "assets/[name].[ext]",
      },
    },
  },
});