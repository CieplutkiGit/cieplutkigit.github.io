import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const root = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  base: "/",
  build: {
    rollupOptions: {
      input: {
        home: resolve(root, "index.html"),
        case: resolve(root, "case/index.html"),
        evidence: resolve(root, "evidence/index.html"),
        timeline: resolve(root, "timeline/index.html"),
        archives: resolve(root, "archives/index.html"),
        contact: resolve(root, "contact/index.html"),
        notFound: resolve(root, "404.html")
      }
    }
  }
});
