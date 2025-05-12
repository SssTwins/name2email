import { defineConfig } from 'vite'
import { crx } from '@crxjs/vite-plugin'
import vue from '@vitejs/plugin-vue'
import manifest from './src/manifest.js'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { visualizer } from 'rollup-plugin-visualizer'
import ElementPlus from 'unplugin-element-plus/vite'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const production = mode === 'production'

  return {
    plugins: [
      crx({ manifest }),
      vue(),
      visualizer(),
      ElementPlus(),
      Icons({ autoInstall: true }),
      AutoImport({
        resolvers: [
          ElementPlusResolver(),
          IconsResolver({
            prefix: 'Icon',
          }),
        ],
      }),
      Components({
        resolvers: [
          IconsResolver({
            enabledCollections: ['ep'],
          }),
          ElementPlusResolver(),
        ],
      }),
    ],
    build: {
      emptyOutDir: true,
      outDir: 'build',
      minify: false,
      rollupOptions: {
        output: {
          chunkFileNames: 'assets/chunk-[name]-[hash].js',
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('vue')) return 'vue'
              if (id.includes('vue-router')) return 'vue-router'
              if (id.includes('element-plus')) return 'element-plus'
              if (id.includes('jsstore')) return 'jsstore'
              if (id.includes('lodash-es')) return 'lodash'
              if (id.includes('xlsx')) return 'xlsx'
            }
          },
        },
      },
    },
    legacy: {
      skipWebSocketTokenCheck: true,
    },
  }
})
