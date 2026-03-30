import { VitePWA } from "vite-plugin-pwa";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import mkcert from "vite-plugin-mkcert";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,
    // хост для localtunnel
    // npm i -g localtunnel
    // lt --port 3000 --subdomain 123pwa-example
    // при просмотре через localtunnel необходимо отключить mkcert
    // allowedHosts: ["123pwa-example.loca.lt"],
  },
  preview: {
    port: 3000,
  },
  plugins: [
    react(),
    mkcert({
      savePath: "./certs",
    }),
    VitePWA({
      base: "/",
      strategies: "injectManifest",
      srcDir: "src",
      filename: "sw.ts",
      registerType: "prompt",
      injectRegister: false,

      pwaAssets: {
        disabled: false,
        config: true,
      },

      manifest: {
        start_url: "/",
        name: "PWA Example",
        short_name: "PWA Example",
        description: "Progressive Web Application example",
        theme_color: "#f8f8f8",
        background_color: "#000000",
        display: "standalone",
        share_target: {
          action: "/share-target",
          method: "GET",
          params: {
            title: "title",
            text: "text",
          },
          enctype: "application/x-www-form-urlencoded",
        },
      },

      injectManifest: {
        globPatterns: ["**/*.{js,css,html,svg,png,ico}"],
      },

      devOptions: {
        enabled: true,
        navigateFallback: "index.html",
        suppressWarnings: true,
        type: "module",
      },
    }),
  ],
  resolve: {
    alias: {
      "#": "/src",
    },
  },
});
