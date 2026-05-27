import { defineConfig } from 'vite';

export default defineConfig({
  // Serve demo as root
  root: '.',
  build: {
    lib: {
      entry: 'src/a11y-color-contrast-checker.js',
      name: 'A11yColorContrastChecker',
      fileName: 'a11y-color-contrast-checker',
      formats: ['es']
    }
  }
});
