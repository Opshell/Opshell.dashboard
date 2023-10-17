# basicViteFrontEnd
Establishing fundamental frontend framework rules based on Vite and Vue 3.

# Vue 3 + TypeScript + Vite

---

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Type Support For `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
   1. Run `Extensions: Show Built-in Extensions` from VSCode's command palette
   2. Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

---
## 目錄結構

- assets (靜態資源)
- components (元素區塊)[採原子設計]
> - atom
> - molecule
> - organism
> --- 動態載入的話考慮
> - common (表單類和按鈕)
> - layouts (動態路由的預設顯示樣式，有分Parent和Chid)
> - effect (有特效的組件，有的是給canvas + webgl，有的是活動特殊用途)
> - observer (滾動事件偵測、資料是否改變的偵測事件等)
- hook (compositon) [封裝後的共用邏輯]
- pages (主要頁面)
- router (路由管理)
- store (共用資料管理)
- types (類別資料管理)
