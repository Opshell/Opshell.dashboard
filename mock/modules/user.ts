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
            if (username === 'Opshell' && password === 'password') {
                const jwtService = new JwtService(secretKey);
                // 生成 JWT
                const payload: JwtPayload = { id: '1', name: 'Opshell', auth: 0 };
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
                    "icon": "notebook",
                    "hide_sub": 1,
                    "link": "/articleList"
                },
                {
                    "id": 10,
                    "parent_id": 0,
                    "title": "工程模式",
                    "icon": "dashboard",
                    "hide_sub": 1,
                    "link": "",
                    "child": [
                        {
                            "id": 101,
                            "parent_id": 10,
                            "title": "UI/UX View",
                            "icon": "database",
                            "hide_sub": 1,
                            "link": "/develop/ui-ux-set"
                        },
                        {
                            "id": 102,
                            "parent_id": 10,
                            "title": "圖標總覽",
                            "icon": "grid",
                            "hide_sub": 1,
                            "link": "/develop/icon-list"
                        },
                    ]
                },
                {
                    "id": 1,
                    "parent_id": 0,
                    "title": "後台管理",
                    "icon": "folder",
                    "hide_sub": 1,
                    "link": "",
                    "child": [
                        {
                            "id": 2,
                            "parent_id": 1,
                            "title": "權限群組",
                            "icon": "fingerprint",
                            "hide_sub": 1,
                            "link": "/group"
                        },
                        {
                            "id": 3,
                            "parent_id": 1,
                            "title": "後台帳號",
                            "icon": "user",
                            "hide_sub": 1,
                            "link": "/admin"
                        },
                        {
                            "id": 4,
                            "parent_id": 1,
                            "title": "網站設定",
                            "icon": "folder",
                            "hide_sub": 1,
                            "link": "",
                            "child": [
                                {
                                    "id": 9,
                                    "parent_id": 4,
                                    "title": "基本設定",
                                    "icon": "settings",
                                    "hide_sub": 1,
                                    "link": "/setting"
                                },
                                {
                                    "id": 8,
                                    "parent_id": 4,
                                    "title": "SEO 管理",
                                    "icon": "chart-network",
                                    "hide_sub": 1,
                                    "link": "/seo"
                                }
                            ]
                        },
                        {
                            "id": 5,
                            "parent_id": 1,
                            "title": "功能表單",
                            "icon": "layers",
                            "hide_sub": 1,
                            "link": "/sectionList"
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