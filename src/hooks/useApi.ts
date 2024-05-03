// 從Axios 拉型別出來用
import { Method, AxiosRequestHeaders, AxiosRequestConfig, AxiosProgressEvent } from 'axios';
import { storeToRefs } from 'pinia';
import piniaStore from '@/store';

interface iErrorMessage {
    [key: string]: string[];
}
// [-]固定的回傳格式(axios 的 data 內層)

export interface iPaginator {
    current_page: number; // 目前頁面
    total: number; // 資料筆數
    per_page: number; // 每頁幾筆
    last_page: number; // 最後頁
}
export interface iResult {
    status: boolean;
    msg: string;
    data: any;
    paginator?: iPaginator;
    access_token?: string; //JWT token
    refresh_token?: string; // 刷新 token
}
export interface iAxiosProgressEvent extends AxiosProgressEvent{
    lengthComputable: boolean; // [#] 是否開始上傳 沒有這個屬性@"@?
    total: number; // 上傳總量
}

export const sendRequest = async function (
    url: string,
    method: Method = 'GET',
    data: any = {},
    headers?: AxiosRequestHeaders,
    onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
): Promise<iResult | null> {

    // [-]檢查store 或 storeg 有沒有 token 有的話就合併到到headers
    const userStore = piniaStore.useUserStore;
    const { userState } = storeToRefs(userStore);

    let token: string | null = userState.value.jwtToken;
    if (!token) { // [!]正式上線可能會拿掉
        // 如果沒有token 就從localStorage找看看
        token = localStorage.getItem('jwtToken');
        if (!token) { // 有東西的話 把token存到store裡面
            userState.value.jwtToken = token as string;
        }
    }

    // [-] header 處理
    if (!headers) headers = {} as AxiosRequestHeaders;
    headers.Authorization = `Bearer ${token}`;

    const config: AxiosRequestConfig = {
        url,
        method,
        data,
        headers,
    };

    if (method === 'POST' && onUploadProgress) {
        config.onUploadProgress = onUploadProgress;
    }

    return await axios(config)
    .then((axiosResponse) => {
        // console.log('axiosResponse：', axiosResponse);

        let result: iResult = {
            status: false,
            msg: '網路問題！',
            data: null,
        };

        // [-] 結果無誤的話
        if (axiosResponse.status == 200) {

            const response = axiosResponse.data; // 回傳的資料

            let resMsg: string | iErrorMessage = response.message;

            if (url == '/oauth/token') { // 目前登入、刷新驗證 未調整，先用舊的
                result = {
                    status: true,
                    msg: data.grant_type === 'refresh_token' ? '刷新token' : '登入成功',
                    data: {},
                    paginator: undefined,
                    access_token: response.access_token ? response.access_token : '',
                    refresh_token: response.refresh_token ? response.refresh_token : '',
                };
            } else { // 完整的回傳格式
                // 如果 response.message 是物件
                if (typeof resMsg === 'object') { // 錯誤回傳的格式
                    // 把物件遍歷 然後把value 的 array 轉成 string 分隔時斷行
                    const messageArray = Object.values(resMsg).map((item) => {
                        if (Array.isArray(item)) {
                            return item.join('<br>');
                        }
                        return item;
                    });

                    //array 轉成 string 分隔時斷行
                    resMsg = messageArray.join('<br>');
                }

                result = {
                    status: response.status === 0 ? true : false,
                    msg: resMsg,
                    data: response.data,
                    paginator: response.paginator ? response.paginator : undefined,
                    access_token: response.access_token ? response.access_token : '',
                    refresh_token: response.refresh_token ? response.refresh_token : '',
                };
            }
        }

        return result;
    })
    .catch(error => {
        console.error('Axios Error');
        console.error('--Summary：', error.response.data.message);
        console.error('--Detail：', error);

        return null;
    });
};

export const getImage = async function (url: string): Promise<iResult | null> {
    // [-]檢查store 或 storeg 有沒有 token 有的話就合併到到headers
    const userStore = piniaStore.useUserStore;
    const { userState } = storeToRefs(userStore);

    let token: string | null = userState.value.jwtToken;
    if (!token) {
        // 如果沒有token 就從localStorage找看看
        token = localStorage.getItem('jwtToken');
        if (!token) { // 有東西的話 把token存到store裡面
            userState.value.jwtToken = token as string;
        }
    }
    const headers = {
        Authorization: `Bearer ${token}`,
    };

    const config: AxiosRequestConfig = {
        responseType: 'blob',
        headers,
    };

    return await axios.get(url, config)
    .then((axiosResponse) => {
        let result: iResult = {
            status: false,
            msg: '圖片取得失敗！',
            data: null,
        };

        // [-] 結果無誤的話
        if (axiosResponse.status == 200) {
            result = {
                status: true,
                msg: '圖片取得成功！',
                data: axiosResponse.data,
            };
        }

        return result;
    })
    .catch((error) => {
        console.error('Axios Image Error：', error);

        return null;
    });
}

export default {
    setup() {
        return {
            sendRequest,
            getImage,
        };
    },
};
