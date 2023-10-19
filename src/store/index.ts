// src/store/index.ts

import useElStatusStore from './modules/elStatusStore';
import usePatientStore  from './modules/patientStore';
import useUserStore  from './modules/userStore';

export interface iStore {
    useElStatusStore: ReturnType<typeof useElStatusStore>;
    usePatientStore: ReturnType<typeof usePatientStore>;
    useUserStore: ReturnType<typeof useUserStore>;
}

const piniaStore: iStore = {} as iStore;

// 註冊所有的Store
export const registerStore = () => {
    piniaStore.useElStatusStore = useElStatusStore();
    piniaStore.usePatientStore = usePatientStore();
    piniaStore.useUserStore = useUserStore();
};

export default piniaStore;