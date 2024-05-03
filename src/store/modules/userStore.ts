import { defineStore } from 'pinia';
import { reactive } from 'vue';
import { Base64 } from 'js-base64';

// 把使用者權限列舉起來
enum PERMISSION_LEVEL {
    TOP_MANAGEMENT, // 0 最高管理者 全開
    MANAGER, // 1 網站管理者
    USER, // 2 一般使用者
    VISITOR, // 3 訪客
}

// 宣告、並匯出user的State
export interface iUserState {
    isLogin: boolean; // 是否有登入
    jwtToken: string;
    userData: {
        id: number;
        uid: string;
        user: string;
        name: string;
        auth: PERMISSION_LEVEL;
        authLevel: string;
    };
}

const useUserStore = defineStore('useUserStore', () => {
    const userState = reactive({
        isLogin: false,
        jwtToken: '',
        refreshToken: '',
        user: {
            id: 0,
            uid: '',
            name: '',
            avatar: '/assets/images/system_logo.jpg',
            auth: PERMISSION_LEVEL.VISITOR,
            authLevel: '訪客'
        }
    });

    // 登入
    const signIn = (JWT: string, refreshToken: string = '') => {
        userState.isLogin = true;
        setToken(JWT, refreshToken); // token 紀錄

        // JWT = header.payload.Signature
        const JWTStructure = JWT.split('.'); // 解析使用者資料
        const data = JSON.parse(Base64.decode(JWTStructure[1]));

        // 記錄登入者資訊
        userState.user = data;
    };

    const signOut = () => {
        userState.isLogin = false;
        setToken('', '');// 清空token
    };

    const setToken = (JWT: string, refreshToken: string) => {
        userState.jwtToken = JWT;
        userState.refreshToken = refreshToken;


        // 為了安全改成 cookie read only
        // document.cookie = `jwtToken=${JWT}; path=/; max-age=${60 * 60 * 24 * 7}`; // 紀錄 token 在 cookie
        // document.cookie = `refreshToken=${refreshToken}; path=/; max-age=${60 * 60 * 24 * 7}`; // 刷新用token

        localStorage.setItem('jwtToken', JWT); // 紀錄 token 在 localStorage
        localStorage.setItem('refreshToken', refreshToken); // 刷新用token
    }

    // 這邊順便被提醒state.user 不存在，把userData補上去。
    // const isAuthenticated = () => {!!userState.user.id || !!sessionStorage.getItem('id')};

    return {
        userState,
        signIn,
        signOut,
        setToken,
        // isAuthenticated
    }
});

export default useUserStore;