import { createApp } from 'vue';
// import '@/style.css';
import App from '@/App.vue';
import { createPinia } from 'pinia';
import { registerStore } from '@/store';
import router from '@/router';

// [-]字體引用
import '@/assets/fonts/font.css';

// [-]Quasar
import { Quasar, Dialog } from 'quasar';
import '@quasar/extras/material-icons/material-icons.css';
import 'quasar/src/css/index.sass';

// plugin
import 'virtual:svg-icons-register';
import notifyPlugin from '@/plugins/notify';

// [-]樣式載入
import '@/assets/scss/theme.scss'; // 基礎CSS 變數
import '@/assets/scss/vueTransition.scss';
import '@/assets/scss/base.scss'; // 基礎元件與行為

const app = createApp(App);
// app.provide('app', app); // 提供this.$app 主要是router 裡要使用全域變數

app.use(createPinia()); // 狀態管理
registerStore(); // 註冊pinia所有的Store

// Quasar
app.use(Quasar, {
    plugins: { // import Quasar plugins and add here
        Dialog
    },
});

import {
    cloneDeep,
    findIndex,
    concat,
} from 'lodash-es';
const lodash = {
    cloneDeep, findIndex, concat
};
app.provide('_', lodash);
app.config.globalProperties._ = lodash;


// 生成plugin
// 這裡的第二個參數會傳給install裡面的第二個形式參數
app.use(new notifyPlugin(app, { name: '$notify' }));

app.use(router); // 路由

// app.mount('#app');
// router現在是異步的 所以要改下面的語法 讓他請求回來之後才掛載。
// 才不會有第一次請求抓不到資料的問題。
router.isReady().then(
    () => { app.mount('#app'); }
);

