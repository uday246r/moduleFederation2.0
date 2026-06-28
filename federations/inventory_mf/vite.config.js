import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));


export default defineConfig({
  base: "http://localhost:5002/",

  plugins: [
    react(),

    federation({
      name: "inventory",
      filename: "remoteEntry.js",
      manifest: true,
      dts: false,
      exposes: {
        "./AppRoutes": "./src/routes/AppRoutes.jsx",
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

  build: {
    target: "esnext",
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        entryFileNames: "assets/[name]-[hash].js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]"
      },
    },
  },

  server: {
    port: 5002,
    cors: true,
    Headers:{"Access-Control-Allow-Origin":"*"}
  },

  preview: {
    port: 5002,
    strictPort: true,
    cors: true,
    Headers:{"Access-Control-Allow-Origin":"*"}
  },
});