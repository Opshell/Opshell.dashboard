
export {}


// [#] 為什麼不能用自己匯入的Interface?
declare module 'vue' {
    interface ComponentCustomProperties {
        $notify: (
            type?: 'success' | 'warning' | 'error' | 'info',
            title?: string,
            message?: string,
            duration?: number,
            showCancelBtn?: boolean,
            confirmText?: string,
        ) => Promise<void>;
    }
}