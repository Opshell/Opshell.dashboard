import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta extends Record<string | number | symbol, unknown> {

    title?: string // 路由名稱
    icon?: string // 路由Icon (name)

    // hidden?: boolean // 預設false, true 的时候該路由不會在側邊攔出現

    /**
     * 當一個路由下面的 children Length 大於 1 個時，自動會變成巢狀路由的模式，
     * 只有一個時，會將那個子路由當做根路由顯示在側邊欄，
     * 若想不管路由下面的 children 聲明的個數都顯示你的根路由，
     * 可以設定 alwaysShow: true，這樣就會忽略之前定義的規則，一直顯示根路由
     */
    // alwaysShow?: boolean

    // 預設 true，如果 false，則不會在麵包屑中顯示
    // breadcrumb?: boolean

   // 設定該路由進入的權限，允許多個權限疊加
    // roles?: string[]

    /**
     * 範例: activeMenu: "/xxx/xxx"，
     * 當設定了該屬性進入路由時，則會高亮 activeMenu 屬性對應的側邊欄。
     * 該屬性適合使用在有 hidden: true 屬性的路由上
     */
    // activeMenu?: string

    /**
     * 是否暫存該路由頁面
     * 預設為 false，為 true 時代表需要暫存，此時該路由和該頁面都需要設定一致的 Name
     */
    // keepAlive?: boolean
  }
}