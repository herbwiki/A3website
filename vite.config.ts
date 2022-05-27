const { resolve } = require('path')
const { defineConfig } = require('vite')

module.exports = defineConfig({
  build: {
    rollupOptions: {
      input: {
        entry: resolve(__dirname, 'index.html'),
        herbs: resolve(__dirname, 'herbs.html')
      }
    }
  }
})