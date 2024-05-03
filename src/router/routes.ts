import { RouteRecordRaw } from 'vue-router';

import adminRoutes from './modules-routes';
import clientRoutes from './modules/client-routes';
import { RouteRecordRaw, RouteLocationNormalized } from 'vue-router';

const routes: RouteRecordRaw[] = [
    {
        name: 'Home',
        path: '/',
        redirect: '/develop/ui-kit',
        // component: () => import('@/pages/client/Home.vue'),
        meta: { title: '首頁', icon: 'home' },
    },
    {
        name: 'Admin',
        path: '',
        component: () => import('@/pages/index.vue'),
        meta: { title : `${__TITLE__} - 後臺`, icon: 'ballot' },
        redirect: '/develop/ui-kit',
        children: [
            {
                name: 'Develop',
                path: 'develop',
                redirect: '/develop/ui-kit',
                meta: { title: '開發輔助', icon: 'address-book' },
                children: [
                    {
                        name: 'UIKit',
                        path: 'ui-kit',
                        component: () => import('@/pages/develop/UIKit.vue'),
                        meta: {
                            title: 'UI Kit',
                            icon: 'cards',
                            summary: '設計風格、主題樣式與元件展示頁面。',
                        },
                    }, {
                        name: 'IconList',
                        path: 'icon-list',
                        component: () => import('@/pages/develop/IconList.vue'),
                        meta: {
                            title: 'Icon庫',
                            icon: 'grid_view',
                            summary: '網站使用的圖示列表，點選圖示可以直接複製icon name。',
                        },
                    },
                ],
                beforeEnter: async (to, from) => {

                },
            }, {
                name: 'Project',
                path: 'project',
                meta: { title: '作品集', icon: 'photo_library' },
                children: [
                    {
                        name: 'project-list',
                        path: 'list',
                        component: () => import('@/pages/ProjectList.vue'),
                        meta: { title: '作品管理', icon: 'photo_library' },
                        redirect: '/project/list/1',
                        children: [
                            {
                                path: ':page(\\d+)',
                                component: () => import('@/components/orga/list.vue'),
                                meta: {
                                    title: '作品集',
                                    icon: 'photo_library',
                                    summary: '作品集列表頁'
                                },
                            },
                        ]
                    }, {
                        name: 'project-info',
                        path: 'info/:id(\\d+)',
                        component: () => import('@/pages/ProjectInfo.vue'),
                        meta: { title: '作品內容', icon: 'address-book' },
                    }, {
                        name: 'category',
                        path: 'category',
                        component: () => import('@/pages/develop/UIKit.vue'),
                        meta: { title: 'UI Kit', icon: 'address-book' },
                    }, {
                        name: 'tag',
                        path: 'tag',
                        component: () => import('@/pages/develop/IconList.vue'),
                        meta: { title: 'Icon列表', icon: 'address-book' },
                    },
                ],
            }, {
                // 未定義網址 => 404
                name: 'PageNotFound',
                path: '/:pathMatch(.*)*',
                component: () => import('@/pages/PageNotFound.vue'),
                meta: { title: '頁面不存在!!', icon: 'cross-circle' },
            },
        ],
        beforeEnter: async (to: RouteLocationNormalized, from: RouteLocationNormalized) => {

        }
    },
];

export default routes;
