import { RouteRecordRaw } from 'vue-router';

export default [
    {
        name: 'NewsList',
        path: '/news-list',
        component: () => import('@/pages/client/NewsList.vue'),
        meta: { title : '患者列表', icon: 'ballot' },
        redirect: '/news-list/1',
        children: [
            {
                name: 'news-list-p',
                path: ':page',
                component: () => import('@/components/orga/waterfallsFlow.vue'),
                meta: { title: '最新消息列表', icon: 'ballot' },
                // props: () => ({ patientList: [] })
            },
        ],
    },
    {
        // 未定義網址 => 404
        name: 'PageNotFound',
        path: '/:pathMatch(.*)*',
        component: () => import('@/pages/PageNotFound.vue'),
        meta: { title: '頁面不存在!!', icon: 'cross-circle' },
    },
] as RouteRecordRaw[];