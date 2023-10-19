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
                const payload: JwtPayload = { id: '1', name: 'Opshell' };
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
    }
] as MockMethod[];