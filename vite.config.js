import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import ElementPlus from 'unplugin-element-plus/vite'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import removeConsole from 'vite-plugin-remove-console'


// https://vitejs.dev/config/
export default defineConfig({
  base: '/daily/',
  plugins: [
    vue(),
    vueJsx(),
    removeConsole(),
    AutoImport({
      imports: ['vue'],
      resolvers: [
        ElementPlusResolver(),
        IconsResolver()
      ]
    }),
    Components({
      resolvers: [
        ElementPlusResolver(),
        IconsResolver({
          enabledCollections: ['ep']
        })
      ]
    }),
    Icons({
      autoInstall: true
    }),
    ElementPlus({
      useSource: false,
      defaultLocale: 'zh-cn'
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // 删除所有的console语句
        drop_debugger: true, // 删除所有的debugger语句
        pure_funcs: ['console.log'], // 删除所有的console.log函数调用
      },
      mangle: {
        keep_classnames: false,
      },
      output: {
        // 删除所有注释
        comments: false,
      },
    },
  },
  server: {
    // 开发服务器配置
    proxy: {
      '/daily/api': {
        target: 'http://127.0.0.1:13200', // 后端服务实际地址
        changeOrigin: true //开启代理
        // rewrite: (path) => path.replace(/^\/api/g, '')
      }
    }
  }
})
