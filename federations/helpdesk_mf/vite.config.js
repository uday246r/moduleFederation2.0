import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));


export default defineConfig({
  base: "http://localhost:5004/",
  optimizeDeps: {
    exclude: ['@myorg/shared']
  },

  plugins: [
    react(),

    federation({
      name: "helpdesk",
      filename: "remoteEntry.js",
      manifest: true,
      dts: false,

      exposes: {
        "./HelpdeskApp": "./src/App.jsx",
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
    minify: false,
    cssCodeSplit: false,

    rollupOptions: {
      output: {
        assetFileNames: "assets/[name].[ext]",
      },
    },
  },

  server: {
    port: 5004,
    cors: true,
    watch: {
      ignored: ['!**/node_modules/@myorg/shared/**']
    }
  },

  preview: {
    port: 5004,
    strictPort: true,
    cors: true,
  },
});