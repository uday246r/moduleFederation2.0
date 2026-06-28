import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));


export default defineConfig({

  base: "http://localhost:5001/",

  plugins: [

    react(),

    federation({

      name: "employee_mf",
      filename: "remoteEntry.js",
      manifest: true,
      dts: false,

      exposes: {
        "./EmployeeApp": "./src/App.jsx",
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
        assetFileNames: "assets/[name].[ext]",
      },
    },
  },

  server: {
  host: "0.0.0.0",
  port: 5001,
  cors: true,
},

 preview: {
  host: "0.0.0.0",
  port: 5001,
  strictPort: true,
  cors: true,
  },
  
});