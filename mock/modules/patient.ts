import { MockMethod } from 'vite-plugin-mock';
import JWT, { VerifyOptions } from 'jsonwebtoken';

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
    { // 取得患者列表
        url: '/mapi/patient/list',
        method: 'get',
        response: ({ query }) => {
            const { page, keywords } = query;

            console.log('page：', page);
            console.log('keywords：', keywords);

            const patientList = [
                {
                    id: 1,
                    name: '王爺爺',
                    appStatus: true,
                    identification: 'A123456789',
                    age: 90,
                    note: '頸部',
                    appointment: '2023-06-30',
                    doctor: '張睿智',
                    disease: '糖尿病/高血壓',
                    unread: 1,
                },
                {
                    id: 3,
                    name: '張奶奶',
                    appStatus: true,
                    identification: 'A223456789',
                    age: 77,
                    note: '頸部',
                    appointment: '2023-06-30',
                    doctor: '張睿智',
                    disease: '糖尿病/高血壓',
                    unread: 1,
                },
                {
                    id: 7,
                    name: '黃爺爺',
                    appStatus: true,
                    identification: 'A123456789',
                    age: 86,
                    note: '頸部',
                    appointment: '2023-06-30',
                    doctor: '張睿智',
                    disease: '糖尿病',
                    unread: 0,
                },
            ];

            return {
                status: 0,
                message: '取得病患列表成功',
                data: patientList,
                paginator: {
                    current_page: page,
                    total: 30,
                    per_page: 3,
                    lastPage: 10,
                }
            };
        },
    },
    { // 患者 $_GET['patient_id'] 基礎資料
        url: '/mapi/patient/info',
        method: 'get',
        response: ({ query }) => {
            const { patient_id } = query;

            const info = {
                id: 1,
                name: '王爺爺',
                uid: 'A123456789', // 身分證字號
                age: 90,
                place: '頸部',
                next: '2023-09-12', // 下次回診時間
                doctor: '張睿智',
            };
            const tube = 'Right forearm、AVG、外動內靜';
            const questionnaire = '左手臂腫脹、無靜脈壓力高、廔管塌陷';

            return {  // 在data裡
                status: 0,
                message: `取得病患${patient_id}資料成功'`,
                data: {
                    info,
                    tube,
                    questionnaire,
                }
            };
        },
    },
    { // 患者 $_GET['patient_id'] 的 "回診資料列表" 第 $_GET['page'] 頁
        url: '/mapi/patient/outpatient-list',
        method: 'get',
        response: ({ query }) => {
            const { patient_id, page, keywords } = query;

            const outpatientList = [
                {
                    id: 1,
                    createDate: '2023-06-30', // 建立日期
                    place: '頸部', // 洗腎部位
                    BP_1: '123',
                    BP_2: '123',
                    HR: '123',
                    PI: '123',
                    RI: '123',
                    TAMEAN: '123',
                    flow: '1234',
                    diameter: '123',
                    next: '2023-09-12',
                    questionnaire: {
                        swelling: 1,
                        pressure: 1,
                        collapse: 1,
                        msg: '',
                    }
                },
                {
                    id: 2,
                    createDate: '2023-06-30', // 建立日期
                    place: '頸部', // 洗腎部位
                    BP_1: '123',
                    BP_2: '123',
                    HR: '123',
                    PI: '123',
                    RI: '123',
                    TAMEAN: '123',
                    flow: '1234',
                    diameter: '123',
                    next: '2023-09-12',
                    questionnaire: {
                        swelling: 1,
                        pressure: 1,
                        collapse: 1,
                        msg: '',
                    }
                },
                {
                    id: 3,
                    createDate: '2023-06-30', // 建立日期
                    place: '頸部', // 洗腎部位
                    BP_1: '123',
                    BP_2: '123',
                    HR: '123',
                    PI: '123',
                    RI: '123',
                    TAMEAN: '123',
                    flow: '1234',
                    diameter: '123',
                    next: '2023-09-12',
                    questionnaire: {
                        swelling: 1,
                        pressure: 1,
                        collapse: 1,
                        msg: '',
                    }
                },
                {
                    id: 4,
                    createDate: '2023-06-30', // 建立日期
                    place: '頸部', // 洗腎部位
                    BP_1: '123',
                    BP_2: '123',
                    HR: '123',
                    PI: '123',
                    RI: '123',
                    TAMEAN: '123',
                    flow: '1234',
                    diameter: '123',
                    next: '2023-09-12',
                    questionnaire: {
                        swelling: 1,
                        pressure: 1,
                        collapse: 1,
                        msg: '',
                    }
                },
                {
                    id: 5,
                    createDate: '2023-06-30', // 建立日期
                    place: '頸部', // 洗腎部位
                    BP_1: '123',
                    BP_2: '123',
                    HR: '123',
                    PI: '123',
                    RI: '123',
                    TAMEAN: '123',
                    flow: '1234',
                    diameter: '123',
                    next: '2023-09-12',
                    questionnaire: {
                        swelling: 1,
                        pressure: 1,
                        collapse: 1,
                        msg: '',
                    }
                },
                {
                    id: 6,
                    createDate: '2023-06-30', // 建立日期
                    place: '頸部', // 洗腎部位
                    BP_1: '123',
                    BP_2: '123',
                    HR: '123',
                    PI: '123',
                    RI: '123',
                    TAMEAN: '123',
                    flow: '1234',
                    diameter: '123',
                    next: '2023-09-12',
                    questionnaire: {
                        swelling: 1,
                        pressure: 1,
                        collapse: 1,
                        msg: '',
                    }
                },
            ];

            return {
                status: 0,
                message: `取得病患${patient_id}回診資料成功`,
                data: outpatientList,
                paginator: {
                    current_page: page,
                    total: 48,
                    per_page: 6,
                    last_page: 8,
                }
            };
        },
    },
    // [#]回診資料的CRUD

    { // 患者 $_GET['patient_id'] 的 "醫師與洗腎室對話列表"
        url: '/mapi/patient/message-board',
        method: 'get',
        response: ({ query }) => {
            const { patient_id, page } = query;

            const msgList = [
                {
                    id: 1,
                    status: true, // 1= 已讀 0=未讀
                    createDate: '2023-06-30 05:28pm', // 建立日期
                    from: 'out',
                    msg: '請問醫師洗腎時須特別留意甚麼事項?',
                },
                {
                    id: 2,
                    status: true, // 1= 已讀 0=未讀
                    createDate: '2023-06-30 05:28pm', // 建立日期
                    from: 'out',
                    msg: '上次洗腎測量靜脈壓力高',
                },
                {
                    id: 3,
                    status: true, // 1= 已讀 0=未讀
                    createDate: '2023-06-30 05:28pm', // 建立日期
                    from: 'out',
                    msg: '難紮針',
                },
                {
                    id: 4,
                    status: true, // 1= 已讀 0=未讀
                    createDate: '2023-06-30 05:28pm', // 建立日期
                    from: 'self',
                    msg: '注意廔管A點入針方向，避免廔管塌陷',
                },
                {
                    id: 5,
                    status: false, // 1= 已讀 0=未讀
                    createDate: '2023-06-30 05:28pm', // 建立日期
                    from: 'self',
                    msg: 'B廔管塌陷時，可嘗試C點入針',
                },
            ];

            const quickReply = [
                {
                    id: 1,
                    msg: '靜脈壓力高',
                },
                {
                    id: 2,
                    msg: '血塊多',
                },
                {
                    id: 3,
                    msg: '難扎針',
                },
                {
                    id: 4,
                    msg: '流速不足',
                },
                {
                    id: 5,
                    msg: '今日沒洗完(提早收機)',
                },
            ];

            return {
                status: 0,
                message: `取得${patient_id}留言板資料成功`,
                data: {
                    msgList,
                    quickReply
                }
            };
        },
    },
    // [#]留言板的留言送出
    // [#]留言板罐頭留言的CRUD

    { // 患者 $_GET['patient_id'] 的 "血管攝影列表"
        url: '/map/patient/vascular',
        method: 'get',
        response: ({ query }) => {
            const { patient_id } = query;

            const album = [
                {
                    id: 1, // 這個id是為了讓照片可以被刪除
                    file: '/upload/ct.png',
                },
                {
                    id: 2, // 這個id是為了讓照片可以被刪除
                    file: '/upload/ct.png',
                },
                {
                    id: 3, // 這個id是為了讓照片可以被刪除
                    file: '/upload/ct.png',
                },
                {
                    id: 4, // 這個id是為了讓照片可以被刪除
                    file: '/upload/ct.png',
                },
                {
                    id: 5, // 這個id是為了讓照片可以被刪除
                    file: '/upload/ct.png',
                },
                {
                    id: 6, // 這個id是為了讓照片可以被刪除
                    file: '/upload/ct.png',
                },
                {
                    id: 7, // 這個id是為了讓照片可以被刪除
                    file: '/upload/ct.png',
                },
                {
                    id: 8, // 這個id是為了讓照片可以被刪除
                    file: '/upload/ct.png',
                },
                {
                    id: 9, // 這個id是為了讓照片可以被刪除
                    file: '/upload/ct.png',
                },
                {
                    id: 10, // 這個id是為了讓照片可以被刪除
                    file: '/upload/ct.png',
                },

            ];

            return {
                status: 0,
                message: `取得${patient_id}血管攝影相簿成功`,
                data: album
            };
        },
    },
    { // 患者 $_GET['patient_id'] 的 "原始圖標記"
        url: '/map/patient/real-img-mark-list',
        method: 'get',
        response: ({ query }) => {
            const { patient_id } = query;

            const markList = [
                {
                    id: 1, // 這個id是為了讓照片可以被刪除
                    text: '支架',
                    x: 0,
                    y: 0
                },
                {
                    id: 2, // 這個id是為了讓照片可以被刪除
                    text: '血管支架',
                    x: 100,
                    y: 210
                },
            ];

            return {
                status: 0,
                message: `取得${patient_id}標記成功`,
                data: markList
            };
        },
    },

] as MockMethod[];