/** @type {import('vite').UserConfig} */

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import { viteMockServe } from 'vite-plugin-mock';
import { quasar, transformAssetUrls } from '@quasar/vite-plugin';
import { visualizer } from 'rollup-plugin-visualizer';

import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig((env) => {
    return {
        define: {
            // __APP_ENV__: JSON.stringify(env.APP_ENV),
            __TITLE__: JSON.stringify('Opshell Blog'), // 網站標題 (要掛字串記得用JSON.stringify())
            __DOCKING__: false, // API 串接的目標位置 (true: Docker Container, false: mockjs)
        },
        plugins: [
            vue({
                template: { transformAssetUrls }
            }),
            AutoImport({
                imports: [
                    "vue",
                    "vue-router",
                    {
                        "@vueuse/core": [
                            "useMouse",
                            ["useFetch", "useMyFetch"]
                        ],
                        axios: [
                            ["default", "axios"]
                        ],
                        vue: ["PropType", "defineProps", "InjectionKey", "Ref"]
                    }
                ],
                dirs: [],
                dts: "src/types/auto-imports.d.ts",
                vueTemplate: false,
                eslintrc: {
                    enabled: false,
                    filepath: "./.eslintrc-auto-import.json",
                    globalsPropValue: true
                }
            }),
            Components({
                dirs: [ 'src/components' ], // 指定components位置 預設是'src/components'   'src/pages'[理論上只有路由會用到 不用自動引入?]
                // include: [/\.vue$/],
                dts: 'src/types/components.d.ts', // .d.ts生成位置
                extensions: ['vue'],
                directoryAsNamespace: true, // 允許子目錄作為命名空間
                resolvers: [],
            }),
            createSvgIconsPlugin({
                iconDirs: [resolve(process.cwd(), 'src/assets/icons')], // 指定需要占存的Icon目錄
                symbolId: '[name]', // 指定symbolId格式 預設：'icon-[dir]-[name]

                inject: 'body-last', // | 'body-first' sprite插入位置
                customDomId: '__svg__icons__dom__', // 自訂 Dom ID
            }),
            viteMockServe({
                // default
                // mockPath: 'mock',
                localEnabled: env.command === 'serve', // 開發環境是否打包
                prodEnabled: false, // 生產環境是否打包 command.command !== 'serve'
                supportTs: true, // 支援ts模組 (但是會無法監看js)
                watchFiles: true, // 監看檔案變化
                // 關閉mock時 mock 不打包到最終代碼中
                injectCode: `
                    import { setupProdMockServer } from '../mock';
                    setupProdMockServer();
                `,
            }),
            quasar({
                autoImportComponentCase: 'kebab', // 預設是 kebab // 用來區分自訂  和 Quasar元件的命名方式
                sassVariables: 'src/assets/scss/quasar-variables.scss'
            }),
            visualizer({
                filename: 'dist/stats.html',
                open: true,
                gzipSize: true,
                brotliSize: true,
            }),
        ],

        resolve: {
            alias: { // 設定別名
                '@': path.resolve(__dirname, 'src') // 根目錄下的 src 資料夾
            }
        },

        // 代理伺服器
        server: {
            host: true, // [!]預設是掛載 localhost，設定為 true 可以允許外部連接 (Vite 才能連 Docker Container 的 port)
            port: 8080,
            strictPort: false, // Port被占用時直接退出， false會嘗試連接下一個可用Port
            open: true, // dev時自動打開網頁，也可以給網址指定。
            // 自訂代理規則，配合後端進行Api呼叫等。
            // 預設使用 [http-proxy](https://github.com/http-party/node-http-proxy) 完整設定請見官方
            proxy: {
                '/api': {
                    // target: 'http://www.opshell.info/api/', // Docker Container 本機串接
                    target: 'http://localhost:8090/api/', // Docker Container 本機串接
                    // target: 'http://192.168.50.87/api/', // Docker Container 本機串接
                    ws: true, // 代理的WebSockets
                    changeOrigin: true, // 允許websockets跨域
                    rewrite: (path) => path.replace(/^\/api/, ''),
                },
                '/oauth': {
                    target: 'http://localhost:8090/oauth/', // Docker Container 串接
                    ws: true, // 代理的WebSockets
                    changeOrigin: true, // 允許websockets跨域
                    rewrite: (path) => path.replace(/^\/oauth/, ''),
                },
            },
        },

        // 共用全域 SCSS
        css: {
            devSourcemap: true, // scss sourcemap
            preprocessorOptions: {
                scss: {
                    additionalData: `@import "@/assets/scss/common.scss";`,
                    charset: false,
                },
            },
        },
        build: {
            sourcemap: true,
            rollupOptions: {
                // input: { // 多頁面設定
                //     main: path.resolve(__dirname, 'index.html'),
                //     article: path.resolve(__dirname, 'article.html')
                // },
                output: {
                    manualChunks(id) {
                        // pinia的全域實例打包進vendor，避免和頁面一起打包 造成重複import
                        if (id.includes(path.resolve(__dirname, '/src/store/index.ts'))) {
                            return 'vendor';
                        }
                    }
                }
            }
        },

        experimental: {
            renderBuiltUrl(
                filename: string,
                { hostId, hostType, type }: { hostId: string, hostType: 'js' | 'css' | 'html', type: 'public' | 'asset' }
            ) {
                console.log(`${filename}：`, hostId, hostType, type)

                // if (type === 'public') {
                //     return '/' + filename
                // } else if (path.extname(hostId) === '.js') {
                //     return { runtime: `/v2/window.__assetsPath(${JSON.stringify(filename)})` }
                // } else {
                //     return '/v2/' + filename
                // }
            }
        }
    }
});
