import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "logo.svg",
        "robots.txt",
      ],
      pwaAssets: {
        disabled: true,
      },
      devOptions: {
        enabled: true,
      },
      manifest: {
        name: "Product Advisor",
        short_name: "ProAdvisor",
        description: "Smart AI-driven product recommendations",
        theme_color: "#DD2D4A",
        background_color: "#0a0102",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "logo.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "any maskable",
          },
          {
            src: "logo.svg",
            sizes: "192x192",
            type: "image/svg+xml",
          },
          {
            src: "logo.svg",
            sizes: "512x512",
            type: "image/svg+xml",
          },
        ],
      },
    }),
  ],
});
