import { MockMethod } from 'vite-plugin-mock';

// 專案API
export default [
    { // 取得專案列表
        url: '/mapi/project/list',
        method: 'get',
        response: ({ query }) => {
            const { page, keywords, category_id } = query;

            console.log('page：', page);
            console.log('keywords：', keywords);
            console.log('keywords：', category_id);

            const list = [
                {
                    id: 11,
                    unique_id: 11,
                    image: {
                        file: '/assets/images/projects/johnsaon.png'
                    },
                    title: '喬山新概念居家健身',
                    tags: [
                        {
                            id: 3,
                            title: '購物',
                            background: '#9d5052'
                        },
                        {
                            id: 4,
                            title: '訂閱制',
                            background: '#fc651a'
                        },
                        {
                            id: 1,
                            title: 'RWD',
                            background: '#357a5e'
                        },
                        {
                            id: 5,
                            title: '外部API',
                            background: '#6c2499'
                        },
                    ],
                    category_id: 3,
                    category: '大型購物網',
                    link: 'https://www.johnsonfitnesslive.com/',
                    sort: 100,
                    disabled: false,
                    created_at: '2023-08-24 17:28',
                    updated_at: '2023-08-24 17:28',
                }, {
                    id: 11,
                    unique_id: 11,
                    image: {
                        file: 'string'
                    },
                    title: '傳閔人時案件打卡系統',
                    tags: [
                        {
                            id: 6,
                            title: '系統',
                            background: '#1a78b6'
                        },
                        {
                            id: 1,
                            title: 'RWD',
                            background: '#357a5e'
                        },
                    ],
                    category_id: 3,
                    category: '系統網站',
                    sort: 100,
                    disabled: false,
                    created_at: '2023-08-24 17:28',
                    updated_at: '2023-08-24 17:28',
                }, {
                    id: 11,
                    unique_id: 11,
                    image: {
                        file: '/assets/images/projects/solargo.png'
                    },
                    title: '宇軒綠能',
                    tags: [
                        {
                            id: 2,
                            title: '形象',
                            background: '#b09854'
                        },
                        {
                            id: 1,
                            title: 'RWD',
                            background: '#357a5e'
                        },
                        {
                            id: 8,
                            title: '客製系統',
                            background: '#6d269b'
                        },
                    ],
                    category_id: 3,
                    category: '形象網站',
                    link: 'https://www.solargo.com.tw/',
                    sort: 100,
                    disabled: false,
                    created_at: '2023-08-24 17:28',
                    updated_at: '2023-08-24 17:28',
                }, {
                    id: 11,
                    unique_id: 11,
                    image: {
                        file: '/assets/images/projects/fu-de.png'
                    },
                    title: '富德土雞城',
                    tags: [
                        {
                            id: 3,
                            title: '購物',
                            background: '#9d5052'
                        },
                        {
                            id: 1,
                            title: 'RWD',
                            background: '#357a5e'
                        },
                        {
                            id: 2,
                            title: '形象',
                            background: '#b09854'
                        },
                    ],
                    category_id: 3,
                    category: '型錄網站',
                    link: 'http://www.fu-de.com/',
                    sort: 100,
                    disabled: false,
                    created_at: '2023-08-24 17:28',
                    updated_at: '2023-08-24 17:28',
                }, {
                    id: 11,
                    unique_id: 11,
                    image: {
                        file: '/assets/images/projects/yun-cheng.png'
                    },
                    title: '允成建設',
                    tags: [
                        {
                            id: 1,
                            title: 'RWD',
                            background: '#357a5e'
                        },
                        {
                            id: 2,
                            title: '形象',
                            background: '#b09854'
                        },
                    ],
                    category_id: 3,
                    category: '特效網站',
                    link: 'https://www.yun-cheng.com.tw/',
                    sort: 100,
                    disabled: false,
                    created_at: '2023-08-24 17:28',
                    updated_at: '2023-08-24 17:28',
                }, {
                    id: 11,
                    unique_id: 11,
                    image: {
                        file: '/assets/images/projects/github.jpg'
                    },
                    title: 'GitHub-Opshell',
                    tags: [
                        {
                            id: 1,
                            title: 'RWD',
                            background: '#357a5e'
                        },
                        {
                            id: 2,
                            title: '形象',
                            background: '#b09854'
                        },
                        {
                            id: 2,
                            title: 'Side Project',
                        },
                    ],
                    category_id: 3,
                    category: 'Side Project',
                    link: 'https://www.yun-cheng.com.tw/',
                    sort: 100,
                    disabled: false,
                    created_at: '2023-08-24 17:28',
                    updated_at: '2023-08-24 17:28',
                }, {
                    id: 11,
                    unique_id: 11,
                    image: {
                        file: '/assets/images/projects/ts.png'
                    },
                    title: '如何用TypeScript水30天鐵人賽',
                    tags: [
                        {
                            id: 9,
                            title: '筆記',
                            background: '#9d5052'
                        },
                    ],
                    category_id: 3,
                    category: 'Side Project',
                    link: 'https://ithelp.ithome.com.tw/users/20109918/ironman/5363',
                    sort: 100,
                    disabled: false,
                    created_at: '2023-08-24 17:28',
                    updated_at: '2023-08-24 17:28',
                },
            ];

            return {
                status: 0,
                message: '取得專案列表成功',
                data: list,
                paginator: {
                    current_page: page,
                    total: 30,
                    per_page: 6,
                    lastPage: 5,
                }
            };
        },
    },
    { // 取得專案資訊
        url: '/mapi/project/info',
        method: 'get',
        response: ({ query }) => {
            const { id } = query;

            console.log('id：', id);

            const info =  {
                id: id,
                unique_id: id,
                image: {
                    file: '/assets/images/projects/fu-de.png'
                },
                title: '富德土雞城',
                tags: [
                    {
                        id: 3,
                        title: '購物',
                        background: '#9d5052'
                    },
                    {
                        id: 1,
                        title: 'RWD',
                        background: '#357a5e'
                    },
                    {
                        id: 2,
                        title: '形象',
                        background: '#b09854'
                    },
                ],
                category_id: 3,
                category: '型錄購物網',
                link: 'https://www.johnsonfitnesslive.com/',
                description: '<p>活潑俏皮的各種特效，<br />為了深化使用者體驗，使用各種套件進行結合。<br />這個作品除了特效的呈現是種挑戰，<br />最大的難題則是<strong>套件間的整合及效能的優化<strong>。</p>',
                sort: 100,
                disabled: false,
                created_at: '2023-08-24 17:28',
                updated_at: '2023-08-24 17:28',
            };

            return {
                status: 0,
                message: '取得專案列表成功',
                data: info
            };
        },
    },
] as MockMethod[];