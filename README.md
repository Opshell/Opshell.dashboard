# BasicViteQuasar
Basic Vite + Quasar framework











---
## 目錄結構

### mock [測試API 端點]

### public [靜態資源]

### src [主要開發檔案區]
- assets (靜態資源)
> - fonts
> - icons (svg)
> - images
> - scss (全站用SCSS)

- components (元素區塊)[採原子設計] (自動載入元件 依子目錄自動命名)
> - el(atom)
> - mole(molecule)
> - orga(organism)
```
> components --- 動態載入的話考慮
> - common (表單類和按鈕)
> - layouts (動態路由的預設顯示樣式，有分Parent和Chid)
> - effect (有特效的組件，有的是給canvas + webgl，有的是活動特殊用途)
> - observer (滾動事件偵測、資料是否改變的偵測事件等)
```
- composables (vue3的composables) [主要區別為有沒有使用到Vue的模態]
- hooks (共用JS) [封裝後的JS共用邏輯]

- pages (主要頁面) [可以當作路由參考]
> - develop (工程模式下專用的頁面或測試)

- plugins (全域外掛)
> - notify

- router (路由管理) [vue-router]
- store (共用資料管理) [pinia]
- types (類別資料管理)


## SCSS 原則
1. common => vite.config.ts 全域載入 [不帶實際selector 會重複載入]
>  1-1. _mixin.scss => 自定義函式
>  1-2. _variable.scss => 自定義變數(顏色 尺寸 區域範圍 動畫曲線...等 網站的統一參數  CSS 或 SCSS 的參數都在這邊)
2. base => 元件基礎樣式&行為 [App.vue 載入]
3. vueTransition => vue Transition 的動畫 [App.vue 載入]


## CSS 原則
- 元件基本都用全域
- 頁面專屬(page目錄下的vue-sfc)才用scope
- z-index 管理
> 1 => 元件本身調整(一般用在:: before偽元素之類的)
> 10 => 用在打開關閉的元件上面
> 100 => 用在sticky 或 吸頂的底層邏輯
> 1000 => 絕對最上層

- class name 的級距
> Block > Box > el


## TS 原則
- 命名
> 如果是切換開關、狀態 的功能 都用 toggle 當前墜 ex：toggleAlbumModal
> 如果是用來表達狀態的 isAlbumModalOpen: booleam
> 基本上採取開頭小寫的駝峰
> 帶底線的基本上是資料庫帶回來的 patient_id => 常使用的情況會存起來 所以會變成 patentId

> interface 命名會是 i 開頭
> 全域 interface 命名會是 gi 開頭


```SCSS
position
    top
    right
    bottom
    left

display
    align-items

background
    size
    padding
    border
    margin

color
font-size
font-family
font


opacity
trans
z-index


```