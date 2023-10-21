// 從Axios 拉型別出來用
import { Method, AxiosRequestHeaders } from 'axios';
import { storeToRefs } from 'pinia';
import piniaStore from '@/store';
import { Console } from 'console';

// [-]固定的回傳格式(axios 的 data 內層)
export interface iResult {
    status: boolean;
    msg: string;
    data: any;
    paginator?: {
        current_page: number; // 目前頁面
        total: number; // 資料筆數
        per_page: number; // 每頁幾筆
        last_page: number; // 最後頁
    };
    access_token?: string; //JWT token
    refresh_token?: string; // 刷新 token
}

export const getData = async function (
    url: string,
    method: Method = 'GET',
    data: any = {},
    headers?: AxiosRequestHeaders
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

    return await axios({
        url,
        method,
        data,
        headers,
    }).then((axiosResponse) => {
        let result: iResult = {
            status: false,
            msg: '網路問題！',
            data: null,
        };

        // 網路連線沒問題的時候 確認回傳
        if (axiosResponse.status == 200) {
            const response = axiosResponse.data; // 回傳的資料

            result = {
                status: response.status === 0 ? true : false,
                msg: response.message,
                data: response.data,
                paginator: response.paginator ? response.paginator : null,
                access_token: response.access_token ? response.access_token : '',
                refresh_token: response.refresh_token ? response.refresh_token : '',
            };
        }

        return result;
    })
    .catch((error) => {
        console.error(error);
        return null;
    });
};

export default {
    setup() {
        return {
            getData,
        };
    },
};
