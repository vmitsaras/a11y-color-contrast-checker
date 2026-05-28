import { defineConfig } from 'vite';

export default defineConfig({
  // Serve demo as root
  root: '.',
  build: {
    // Build directly into docs/ for GitHub Pages (main + /docs).
    outDir: 'docs',
    // Keep existing markdown/docs content in docs/.
    emptyOutDir: false,
    lib: {
      entry: 'src/a11y-color-contrast-checker.js',
      name: 'A11yColorContrastChecker',
      fileName: 'a11y-color-contrast-checker',
      formats: ['es']
    }
  }
});
