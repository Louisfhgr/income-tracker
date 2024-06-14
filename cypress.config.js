import { defineConfig } from "cypress";

export default defineConfig({
  video: false,

  e2e: {
    setupNodeEvents(on, config) {},
    baseUrl: "http://localhost:3000",
  },

  component: {
    devServer: {
      framework: "vue",
      bundler: "vite",
    },
  },
});
