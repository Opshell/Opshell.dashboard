// src/store/index.ts

import useUIUXStore from './modules/uiuxStore';
import usePatientStore  from './modules/patientStore';
import useUserStore  from './modules/userStore';

export interface iStore {
    useUIUXStore: ReturnType<typeof useUIUXStore>;
    usePatientStore: ReturnType<typeof usePatientStore>;
    useUserStore: ReturnType<typeof useUserStore>;
}

const piniaStore: iStore = {} as iStore;

// 註冊所有的Store
export const registerStore = () => {
    piniaStore.useUIUXStore = useUIUXStore();
    piniaStore.usePatientStore = usePatientStore();
    piniaStore.useUserStore = useUserStore();
};

export default piniaStore;