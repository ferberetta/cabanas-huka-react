import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { playwright } from "@vitest/browser-playwright";

export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ["react", "react-dom"],
  },
  optimizeDeps: {
    include: [
      "react",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "react-dom",
      "react-dom/client",
      "react-router-dom",
      "@testing-library/react",
      "@testing-library/user-event",
    ],
  },
  test: {
    include: ["src/**/*.browser.test.{js,jsx}"],
    setupFiles: ["./src/test/setup.js"],
    browser: {
      enabled: true,
      provider: playwright({
        launch: { headless: false },
      }),
      instances: [{ browser: "chromium" }],
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/**/*.{js,jsx}"],
      exclude: ["src/**/*.test.{js,jsx}", "src/test/**", "src/main.jsx"],
    },
  },
});
