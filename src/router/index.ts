import { createRouter, createWebHistory } from 'vue-router';

// 路由註冊表
import routes from './routes';
import { useTitle } from '@vueuse/core';

import { storeToRefs } from 'pinia';
import piniaStore from '@/store';

import beforeEach from './beforeEach';



const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
    // scrollBehavior(to, from, savedPosition) { // 滾動行為
    //     return { top: 0 };
    // }
});

router.beforeEach(beforeEach);

// 可以帶to, from, failure
router.afterEach((to) => {
    const uiuxStore = piniaStore.useUIUXStore;

     // 刷新head title
    useTitle(`${to.meta.title} - Opshell`);

    // 更新麵包屑
    uiuxStore.setBreadcrumbs(to.matched);

    //     setTimeout(() => {
    //         uiuxStore.endLoading(); // 關閉遮罩
    //     }, 300);
})

export default router;