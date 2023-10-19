import { App, createApp } from 'vue';
import Notify from './notify.vue';

interface iPluginOptions {
    name?: string;
}

interface iNotifyFun {
    (
        type: 'info' | 'success' | 'warning' | 'error',
        title: string,
        message: string,
        duration: number,
        showCancelBtn: boolean
    ): Promise<boolean>;
}

class NotifyPlugin {
    private app: App;
    private options: iPluginOptions;

    constructor(app: App, options: iPluginOptions = {}) {
        this.app = app;
        this.options = options;
    }

    // 使用 app.use 時會自動調用 install 屬性上的 function
    install() {
        const alert: iNotifyFun = (type = 'info', title = '標題', message = '內容', duration = 0, showCancelBtn = false) => {
            return new Promise((resolve, reject) => {
                // 實例 第一個參數接收 SFC，第二個接收 props
                const instance = createApp(Notify, {
                    type: type || 'info',
                    title: title || '標題',
                    message: message || '內容',
                    duration: duration || 0,
                    showCancelBtn: showCancelBtn,
                });

                const parentNode = document.createElement('div');
                document.body.appendChild(parentNode);
                instance.mount(parentNode);

                // 銷毀函式
                const unmount = () => {
                    if (parentNode.parentNode) { // 如果物件還存在
                        instance.unmount();
                        parentNode.parentNode.removeChild(parentNode);
                    }
                };

                const confirmBtn = parentNode.querySelector('.confirmBtn');
                confirmBtn?.addEventListener('click', () => {
                    unmount();
                    resolve(true);
                });

                if(showCancelBtn) {
                    const cancelBtn = parentNode.querySelector('.cancelBtn');
                    cancelBtn?.addEventListener('click', () => {
                        unmount();
                        reject(false);
                    });
                }

                if(duration > 0){
                    setTimeout(() => {
                        unmount();
                        resolve(true);
                    }, duration);
                }
            });
        };

        const { name } = this.options;
        // 這裡設定的屬性在 getCurrentInstance().proxy 裡面可以找到
        this.app.config.globalProperties[name || '$alert'] = alert;
    }
}

export default NotifyPlugin;