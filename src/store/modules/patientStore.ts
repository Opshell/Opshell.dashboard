import { defineStore } from 'pinia';

// 宣告、並匯出user的State
export interface iPatientState {
    info: {
        id: number;
        name: string;
        uid: string; // 身分證字號
        age: number;
        place: string;
        next: string; // 下次回診時間
        doctor: string;
    },
    tube: {
        position: string; // 廔管位置
        surgery: string; // 術式
        order: string; // 吻合位置
    },
    questionnaire: {
        swelling: string; // 腫脹
        venousPressure: string; // 靜脈壓力
        tubeStatus: string; // 廔管狀況
    },
}

const usePatientStore = defineStore('usePatientStore', () => {
    const patientState = reactive({
        info: {
            id: 0,
            name: '',
            uid: '', // 身分證字號
            age: 0,
            place: '',
            next: '', // 下次回診時間
            doctor: '',
        },
        tube: {
            position: '', // 廔管位置
            surgery: '', // 術式
            order: '', // 吻合位置
        },
        questionnaire: {
            swelling: '', // 腫脹
            venousPressure: '', // 靜脈壓力
            tubeStatus: '', // 廔管狀況
        },
    });

    // 登入
    const setPatient = (data: string) => {
        // 記錄登入者資訊
        patientState.info = JSON.parse(data);
    };

    return {
        patientState,
        setPatient,
    }
});

export default usePatientStore;