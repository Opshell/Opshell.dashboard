import { createRouter, createWebHistory } from 'vue-router';

import { storeToRefs } from 'pinia';
import piniaStore from '@/store';

import { getData } from '@/hooks/useApi';

// 路由註冊表
import routes from './routes';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
    // scrollBehavior(to, from, savedPosition) { // 滾動行為
    //     return { top: 0 };
    // }
});

// 在 login 頁面還不能完全做到攔截不正確登入訊息，我們必須在router做更進一步處理
router.beforeEach(async (to, from) => {
    const elStatusStore = piniaStore.useElStatusStore;
    const userStore = piniaStore.useUserStore;
    const { userState } = storeToRefs(userStore);

    elStatusStore.startLoading(); // 開啟遮罩

    // 目的路由在meta上是否有設置requireAuth: true 來判斷是否需要驗證
    if (to.meta.requireAuth) {
        if (userState.value.isLogin) {
            let token: string | null = userState.value.refreshToken;
            if (!token) { // [!] 登入的 localStorage 正式上線可能會拿掉
                // 如果沒有token 就從localStorage找看看
                token = localStorage.getItem('refreshToken');
                if (!token) { // 有東西的話 把token存到store裡面
                    userState.value.refreshToken = token as string;
                }
            }

            const fromData = reactive({
                grant_type: 'refresh_token',
                client_id: '2',
                client_secret: 'xPi3Jrzm3IOW4wBaQQhip86SySsBLobaNmnUHTd4',
                scope: '',
                refresh_token: token
            });

            // const url = '/oauth/token';
            const url = '/mapi/user/verify';

            await getData(url, 'POST', fromData).then((res) => {
                if(res){
                    if (res.status) {
                        if(res.access_token != undefined){
                            userStore.signIn(res.access_token, res.refresh_token);
                        } else {
                            userStore.signOut();
                            return { name: 'Login' };
                        }
                    } else { // 回傳狀態 失敗
                        userStore.signOut();
                        return { name: 'Login' };
                    }
                } else { // 回傳錯誤
                    userStore.signOut();
                    return { name: 'Login' };
                }
            });
        } else {
            userStore.signOut();
            return { name: 'Login' };
        }
    }

    // [-]根據不同情況 導向不同首頁
    if (to.path === '/' || to.path === '/index') {
        if (userState.value.isLogin) {
            return { name: 'PatientList', params: {p: 1} }; // 登入就去 會員列表
        } else {
            return { name: 'Login' }; // 沒登入就是去登入頁面
        }
    }

    // [#] 之後要改成導航會員列表
    if (to.path === '/login' && userState.value.isLogin) { // 如果是登入頁面，登出
        userStore.signOut();
    }
});

// 可以帶to, from, failure
// router.afterEach(() => {
//     const elStatusStore = piniaStore.useElStatusStore;

//     setTimeout(() => {
//         elStatusStore.endLoading(); // 關閉遮罩
//     }, 300);
// });

export default router;