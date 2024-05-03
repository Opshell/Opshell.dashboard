import { RouteLocationNormalized } from 'vue-router';

import { storeToRefs } from 'pinia';
import piniaStore from '@/store';

import { sendRequest } from '@/hooks/useApi';

import { useQuasar } from 'quasar';
import confirmComponent from '@/components/mole/confirm.vue';
import notifyComponent from '@/components/mole/notify.vue';

export default async (to: RouteLocationNormalized) => {
    const uiuxStore = piniaStore.useUIUXStore;
    const userStore = piniaStore.useUserStore;
    const { userState } = storeToRefs(userStore);

    uiuxStore.startLoading(); // 開啟遮罩

    const $q = useQuasar();

    // 如果是編輯模式，詢問是否離開
    if (uiuxStore.uiuxState.isEdit) {
        const leaveConfirm = await $q.dialog({
            component: confirmComponent,
            componentProps: {
                title: '提醒！',
                message: "您尚在編輯模式，<br />可能有未儲存的資料，<br />離開資料將遺失，<br />請確認是否要離開此頁面。",
                infoLink: 'https://www.google.com',
            }
        }).onOk(() => {
            return true;
        }).onCancel(() => {
            return false;
        });

        console.log('leaveConfirm：', leaveConfirm);

        if (!leaveConfirm) {
            return false;
        } else {
            uiuxStore.endEdit();
        }
    }

    // 目的路由在meta上是否有設置requireAuth: true 來判斷是否需要驗證
    if (to.meta.requireAuth) {
        let token: string | null = userState.value.refreshToken;
        // [!] 登入的 localStorage 正式上線改成 cookie read only
        if (!token) {
            // 如果沒有token 就從localStorage找看看
            token = localStorage.getItem('refreshToken');
            if (token) { // 有東西的話 把token存到store裡面
                userState.value.refreshToken = token;
                if ( !userState.value.isLogin ) {
                    userState.value.isLogin = true;
                }
            } else {
                userStore.signOut();
                return { name: 'Login' };
            }
        }

        if (token && userState.value.isLogin) {
            const formData = reactive({
                grant_type: 'refresh_token',
                client_id: '2',
                client_secret: 'uHIg4fRigrOfAeA3uZqtyjReUF3LfjYsxy8WnYvu',
                scope: '',
                refresh_token: token
            });

            const url = (__DOCKING__) ?
                '/oauth/token' :
                '/mapi/user/verify';
            await sendRequest(url, 'POST', formData).then((res) => {
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
        // return { name: 'UIKit' };

        // if (userState.value.isLogin) {
        //     return { name: 'PatientList' }; // 登入就去病患列表
        // } else {
        //     return { name: 'Login' }; // 沒登入就是去登入頁面
        // }
    }

    // [#] 之後要改成導航會員列表
    if (to.path === '/login' && userState.value.isLogin) { // 如果是登入頁面，登出
        userStore.signOut();
    }
};