import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
    {
        name: 'Login',
        path: '/login',
        component: () => import('@/pages/Login.vue'),
        meta: { title: '登入', icon: 'address-book' },
    },
    {
        name: 'Forget',
        path: '/forget',
        component: () => import('@/pages/Forget.vue'),
        meta: { title: '忘記密碼', icon: 'address-book' },
    },
    {
        name: 'PatientList',
        path: '/patient-list',
        component: () => import('@/pages/PatientList.vue'),
        meta: { requireAuth: true, title : '患者列表', icon: 'address-book' },
        redirect: '/patient-list/1',
        children: [
            {
                name: 'patient-list-p',
                path: ':page',
                component: () => import('@/components/organism/orga-patientTbody.vue'),
                meta: { requireAuth: true, title: '患者列表', icon: 'address-book' },
                // props: () => ({ patientList: [] })
            },
        ]
    },
    {
        name: 'Patient',
        path: '/patient/:pid',
        component: () => import('@/pages/Patient.vue'),
        meta: { requireAuth: true, title: '患者資料', icon: 'address-book' },
        children: [
            {
                name: 'TubeInfo',
                path: 'tube-info',
                component: () => import('@/pages/patient/TubeInfo.vue'),
                meta: { requireAuth: true, title: '廔管資料', icon: 'address-book' },
            },
            {
                name: 'SurgeryRecords',
                path: 'surgery-records',
                component: () => import('@/pages/patient/SurgeryRecords.vue'),
                meta: { requireAuth: true, title: '手術紀錄', icon: 'address-book' },
            },
            {
                name: 'OutpatientRecords',
                path: 'outpatient-records',
                component: () => import('@/pages/patient/OutpatientRecords.vue'),
                meta: { requireAuth: true, title: '回診紀錄', icon: 'address-book' },
                redirect: 'outpatient-records/1',
                children: [
                    {
                        name: 'OutpatientRecordsList',
                        path: ':page(\\d+)',
                        component: () => import('@/components/organism/orga-outPatientTbody.vue'),
                        meta: { requireAuth: true, title: '患者列表', icon: 'address-book' },
                        // props: () => ({ patientList: [] })
                    },
                ]
            },
            {
                name: 'MessageBoard',
                path: 'message-board',
                component: () => import('@/pages/patient/MessageBoard.vue'),
                meta: { requireAuth: true, title: '留言板', icon: 'address-book' },
            },
            {
                name: 'DataAnalysis',
                path: 'data-analysis',
                component: () => import('@/pages/patient/DataAnalysis.vue'),
                meta: { requireAuth: true, title: '數據分析', icon: 'address-book' },
            },
        ],
        beforeEnter: function (to) {
            if (to.path === `/patient/${to.params?.pid}`) { // 如果是剛進病患頁面

                const params = { pid: to.params?.pid, p: 1 };

                return {name: 'OutpatientRecordsList', params}; // 就去導向回診紀錄 [#] 之後要改成廔管
            }
        }
    },
    {
        name: 'Develop',
        path: '/develop',
        component: () => import('@/pages/develop/index.vue'),
        redirect: '/develop/ui-ux-set',
        meta: { title: '工程模式', icon: 'dashboard' },
        children: [
            {
                name: 'UIUXSet',
                path: 'ui-ux-set',
                component: () => import('@/pages/develop/UIUXSet.vue'),
                meta: { title: 'UI/UX', icon: 'database' },
            },
            {
                name: 'IconList',
                path: 'icon-list',
                component: () => import('@/pages/develop/IconList.vue'),
                meta: { title: '圖標列表', icon: 'grid' },
            },
        ]
    },
    {
        // 未定義網址 => 404
        name: 'PageNotFound',
        path: '/:pathMatch(.*)*',
        component: () => import('@/pages/PageNotFound.vue'),
        meta: { title: '頁面不存在!!', icon: 'cross-circle' },
    },
];

export default routes;
