import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks for better caching
          vendor: ["react", "react-dom"],
          query: ["@tanstack/react-query"],
          ui: [
            "@radix-ui/react-accordion",
            "@radix-ui/react-alert-dialog",
            "@radix-ui/react-avatar",
          ],
          charts: ["recharts"],
          utils: ["clsx", "tailwind-merge", "class-variance-authority"],
        },
        // Optimize asset naming for caching
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split(".") ?? [];
          const extType = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType ?? "")) {
            return `assets/images/[name]-[hash][extname]`;
          }
          if (/woff2?|eot|ttf|otf/i.test(extType ?? "")) {
            return `assets/fonts/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        chunkFileNames: "assets/js/[name]-[hash].js",
        entryFileNames: "assets/js/[name]-[hash].js",
      },
    },
    // Enable minification and tree shaking
    minify: "esbuild",
    target: "es2020",
    // Optimize chunk size warnings
    chunkSizeWarningLimit: 1600,
    // Source maps for debugging (can disable for production)
    sourcemap: process.env.NODE_ENV !== "production",
  },
  server: {
    port: 5002,
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
    proxy: {
      "/api": {
        target: "http://localhost:8001",
        changeOrigin: true,
      },
    },
  },
});
