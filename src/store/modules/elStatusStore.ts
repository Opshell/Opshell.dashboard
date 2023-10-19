/** 網站介面控制 el Status Store
 *
 */

import { reactive } from 'vue';
import { defineStore } from 'pinia';

export interface iRouteState {
    isLoading: boolean; // 是否處於Loading狀態
    selectClose: string; // 用來記錄 開啟的select ref 點擊外面 直接觸發關閉
}

const useElStatusStore = defineStore('useElStatusStore', () => {
    const elStatusState = reactive({
        isLoading: false,
        selectClose: '',
    });

    const startLoading = () => {
        elStatusState.isLoading = true;
    };
    const endLoading = () => {
        elStatusState.isLoading = false;
    };


    return {
        elStatusState,
        startLoading,
        endLoading
    }
})

export default useElStatusStore