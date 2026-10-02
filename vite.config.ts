import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "@leadconnector/vibe-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    allowedHosts: [".modal.host"],
    hmr: {
      overlay: false,
    },
  },
  build: {
    // Lighthouse flags large first-party bundles without maps; they also make
    // production errors readable.
    sourcemap: true,
  },
  plugins: [
    react(),
    // The tagger feeds LeadConnector's visual editor, but it puts a ref on
    // every component, so React warns once per function component. Opt in
    // with VIBE_TAGGER=1 wherever the editor runs.
    mode === "development" &&
      process.env.VIBE_TAGGER === "1" &&
      componentTagger({ tailwindConfig: true }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
