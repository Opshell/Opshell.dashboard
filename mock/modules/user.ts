import { MockMethod } from 'vite-plugin-mock';
import JWT, { VerifyOptions } from 'jsonwebtoken';

const secretKey = 'O0SxS/WcxD:](MJ'; // 請替換為您自己的密鑰

// 聲明 JWT 負載的類型
interface JwtPayload {
    id: string;
    name: string;
    [key: string]: any;
    // 你可以根據需要添加其他負載字段
}

// JWT 封裝程式
export class JwtService {
    private readonly secretKey: string;
    private readonly options: VerifyOptions;

    constructor(secretKey: string) {
        this.secretKey = secretKey;
        this.options = { algorithms: ['HS256'] }; // JWT 驗證的選項
    }

    // 生成 JWT
    generateToken(payload: JwtPayload): string {
        return JWT.sign(payload, this.secretKey, { expiresIn: '1d' }); // 1天後過期
    }

    // 驗證 JWT
    verifyToken(token: string): JwtPayload | null {
        try {
            const decoded = JWT.verify(token, this.secretKey, this.options) as JwtPayload;
            return decoded;
        } catch (error) {
            console.error('JWT verification error:', error);
            return null;
        }
    }
}

// 使用者Api
export default [
    { // 登入
        url: '/mapi/user/login',
        method: 'post',
        response: ({ body }) => {
            const { username, password } = body;
            if (username === 'admin' && password === 'admin') {
                const jwtService = new JwtService(secretKey);
                // 生成 JWT
                const payload: JwtPayload = { id: '1', name: 'Opshell', authLevel: 'Top Admin', uid: 'ead2577489'};
                const token = jwtService.generateToken(payload);

                return {
                    status: 0,
                    message: '登入成功',
                    data: {},
                    access_token: token,
                    refresh_token: '',
                };
            } else {
                return {
                    status: -1,
                    message: '帳號或密碼錯誤',
                    data: {}
                };
            }
        },
    },
    { // 驗證使用者
        url: '/mapi/user/verify',
        method: 'post',
        response: ( { headers, body } ) => {
            const token = headers.authorization.split('Bearer ')[1];
            // const JWTStructure =  token.split('.'); // 解析使用者資料

            const jwtService = new JwtService(secretKey);

            // 驗證 JWT
            const verifiedPayload = jwtService.verifyToken(token);

            // 預設result
            let result = {
                status: -1,
                message: '驗證失敗',
                data: {},
                access_token: '',
                refresh_token: '',
            }

            if(verifiedPayload){
                // verifiedPayload 移除iat, exp
                const { iat, exp, ...newToken } = verifiedPayload;

                // 生成新的token
                const newTokenString = jwtService.generateToken(newToken);
                result = {
                    status: 0,
                    message: '驗證成功',
                    data: {},
                    access_token: newTokenString,
                    refresh_token: '',
                };
            }

            return result;
        },
    },
    { // 依權限取得Menu
        url: '/mapi/user/getMenu',
        method: 'get',
        response: ( { headers } ) => {
            const token = headers.authorization.split('Bearer ')[1];
            // const JWTStructure =  token.split('.'); // 解析使用者資料

            const jwtService = new JwtService(secretKey);

            // 驗證 JWT
            const verifiedPayload = jwtService.verifyToken(token);

            // 預設result
            let result = {
                status: -1,
                message: '驗證失敗',
                data: {},
            }

            const menu = [
                {
                    "id": 6,
                    "parent_id": 0,
                    "title": "文章",
                    "icon": "description",
                    "hide_sub": 1,
                    "link": "/article",
                    "child": [
                        {
                            "id": 61,
                            "parent_id": 6,
                            "title": "文章分類",
                            "icon": "book_2",
                            "hide_sub": 1,
                            "link": "/article/category"
                        },
                        {
                            "id": 62,
                            "parent_id": 6,
                            "title": "文章標籤",
                            "icon": "document_scanner",
                            "hide_sub": 1,
                            "link": "/article/tag"
                        },
                        {
                            "id": 63,
                            "parent_id": 6,
                            "title": "文章管理",
                            "icon": "task",
                            "hide_sub": 1,
                            "link": "/article/list"
                        },
                    ]
                },
                {
                    "id": 16,
                    "parent_id": 0,
                    "title": "作品集",
                    "icon": "photo_library",
                    "hide_sub": 1,
                    "link": "/project",
                    "child": [
                        {
                            "id": 161,
                            "parent_id": 6,
                            "title": "作品分類",
                            "icon": "book_2",
                            "hide_sub": 1,
                            "link": "/project/category/list"
                        },
                        {
                            "id": 162,
                            "parent_id": 6,
                            "title": "作品標籤",
                            "icon": "document_scanner",
                            "hide_sub": 1,
                            "link": "/project/tag/list"
                        },
                        {
                            "id": 163,
                            "parent_id": 6,
                            "title": "作品管理",
                            "icon": "photo_library",
                            "hide_sub": 1,
                            "link": "/project/list"
                        },
                    ]
                },
                {
                    "id": 10,
                    "parent_id": 0,
                    "title": "開發輔助",
                    "icon": "settings_applications",
                    "hide_sub": 1,
                    "link": "/develop",
                    "child": [
                        {
                            "id": 101,
                            "parent_id": 10,
                            "title": "UI kit",
                            "icon": "cards",
                            "hide_sub": 1,
                            "link": "/develop/ui-kit",
                        },
                        {
                            "id": 102,
                            "parent_id": 10,
                            "title": "Icon庫",
                            "icon": "grid_view",
                            "hide_sub": 1,
                            "link": "/develop/icon-list",
                        },
                    ]
                },
                {
                    "id": 1,
                    "parent_id": 0,
                    "title": "後台管理",
                    "icon": "folder",
                    "hide_sub": 1,
                    "link": "/dashboard",
                    "child": [
                        {
                            "id": 2,
                            "parent_id": 1,
                            "title": "權限群組",
                            "icon": "lock_person",
                            "hide_sub": 1,
                            "link": "/dashboard/auth"
                        },
                        {
                            "id": 3,
                            "parent_id": 1,
                            "title": "後台帳號",
                            "icon": "person",
                            "hide_sub": 1,
                            "link": "/dashboard/user"
                        },
                        {
                            "id": 4,
                            "parent_id": 1,
                            "title": "網站設定",
                            "icon": "folder",
                            "hide_sub": 1,
                            "link": "/dashboard/settings",
                            "child": [
                                {
                                    "id": 9,
                                    "parent_id": 4,
                                    "title": "基本設定",
                                    "icon": "settings",
                                    "hide_sub": 1,
                                    "link": "/dashboard/settings/setting"
                                },
                                {
                                    "id": 8,
                                    "parent_id": 4,
                                    "title": "SEO 管理",
                                    "icon": "location_searching",
                                    "hide_sub": 1,
                                    "link": "/dashboard/settings/seo"
                                }
                            ]
                        },
                        {
                            "id": 5,
                            "parent_id": 1,
                            "title": "功能表單",
                            "icon": "dns",
                            "hide_sub": 1,
                            "link": "/dashboard/section-list"
                        }
                    ]
                }
            ];

            result = {
                status: 0,
                message: '驗證成功',
                data: menu,
            };

            return result;
        },
    },
] as MockMethod[];