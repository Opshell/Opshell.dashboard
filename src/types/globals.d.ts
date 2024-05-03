export {}

// 環境常數
declare global {
    const __TITLE__: string; // API 串接的目標位置 (true: Docker Container, false: mockjs)
    const __DOCKING__: boolean; // API 串接的目標位置 (true: Docker Container, false: mockjs)
}


// 通用型別
declare global {
    interface giImageData {
        id: number;
        title: string;
        file_name: string;
        size: number;
        file: string;
        type?: number;
        active?: 0 | 1;
        created_at?: string | Date;
    }

    // select options
    interface giOption<T> {
        id: number;
        text: T;
    }

    // select Dom
    interface giSelectBox extends Ref{
        openSelect: () => void;
        closeSelect: () => void;
        open: boolean;
    }
}


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
        ) => Promise<void | boolean>;
    }
}