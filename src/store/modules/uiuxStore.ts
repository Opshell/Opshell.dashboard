/** 網站介面控制 Store
 *
 */

import { reactive } from 'vue';
import { defineStore } from 'pinia';

import { ThemeTypes } from '@/hooks/useTheme';

import { RouteLocationMatched } from 'vue-router';
import { iBreadcrumb } from '@/components/orga/header.vue';


export interface iRouteState {
    theme: ThemeTypes; // 網站主題
    isLoading: boolean; // 是否處於Loading狀態
    isEdit: boolean; // 是否處於Loading狀態
    selectClose: string; // 用來記錄 開啟的select ref 點擊外面 直接觸發關閉
    breadcrumbs: iBreadcrumb[]; // 麵包屑
}

const useUIUXStore = defineStore('useUIUXStore', () => {
    const uiuxState: iRouteState = reactive({
        theme: 'light',
        isLoading: false,
        isEdit: false,
        selectClose: '',
        breadcrumbs: [],
    });

    const startLoading = () => { uiuxState.isLoading = true; };
    const endLoading = () => { uiuxState.isLoading = false; };

    const startEdit = () => { uiuxState.isEdit = true; }
    const endEdit = () => { uiuxState.isEdit = false; }

    const switchTheme = (theme: ThemeTypes = "light") => {
        uiuxState.theme = theme;
    }

    const setBreadcrumbs = (routeMatched: RouteLocationMatched[]) => {
        uiuxState.breadcrumbs = routeMatched.map((record) => {
            return {
                name: record.name,
                path: record.path,
                meta: record.meta,
            };
        });
    }

    return {
        uiuxState,
        startLoading,
        endLoading,
        startEdit,
        endEdit,
        switchTheme,
        setBreadcrumbs,
    }
})

export default useUIUXStore