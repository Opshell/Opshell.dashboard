import { sendRequest, iResult } from "@/hooks/useApi";
import { useValidactor, useGlobalProperties } from "@/hooks/utilityFunctions";

import piniaStore from '@/store';
const uiuxStore = piniaStore.useUIUXStore;



enum eUrls {
    adminLogin = '/mapi/user/login',
    adminGetMenu = '/mapi/user/getMenu',
}

export interface iErrorPackage {
    errors: string;
    firstEmptyInput: string | null;
}
/** Admin Login
 *
 */
function login(username: string, password: string, verification: string): Promise<iResult | null | iErrorPackage> {
    const loginForm = {
        grant_type: 'password',
        client_id: '2',
        client_secret: 'xPi3Jrzm3IOW4wBaQQhip86SySsBLobaNmnUHTd4',
        scope: '',

        username,
        password,
        verification,
    };

    // 資料檢查
    const checker = new useValidactor();

    checker.checkEmpty(username, '帳號', 'username');
    checker.checkEmpty(password, '密碼', 'password');

    const errorMsg = checker.getErrorsAsString();

    if  (errorMsg === '') { // 檢查通過
        return sendRequest(eUrls.adminLogin, 'POST', loginForm);
    } else {
        return new Promise((reject) => reject(checker.getErrorPackage()));
    }
}

/** Get Admin menu
 *
 */
function getMenu() {
    sendRequest(eUrls.adminGetMenu).then((result) => {
        if (result && result.status) {
            uiuxStore.setMenu(result.data);
        }
    });
}

export default {
    login,
    getMenu
};
