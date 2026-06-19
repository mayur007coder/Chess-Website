import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        learn: resolve(__dirname, "learn.html"),
        about: resolve(__dirname, "about.html"),
        privacy: resolve(__dirname, "privacy.html"),
        contact: resolve(__dirname, "contact.html"),
        notFound: resolve(__dirname, "404.html"),
      },
    },
  },
});
