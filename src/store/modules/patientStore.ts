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
    text_record: string; // 廔管建置狀況
    survey: string;  // 問卷
}

const StateDefault: iPatientState = {
    info: {
        id: 0,
        name: '',
        uid: '', // 身分證字號
        age: 0,
        place: '',
        next: '', // 下次回診時間
        doctor: '',
    },
    text_record: '',
    survey: '',
};

// action
const usePatientStore = defineStore('usePatientStore', () => {
    let patientState: iPatientState = reactive({...StateDefault});

    // 登入
    const setPatient = (data: string) => {
        // 記錄登入者資訊
        patientState.info = JSON.parse(data);
    };

    const resetPatient = () => {
        // [-]解構賦值的話  pinia 工具會有顯示問題 assign 則正常工作 雖然最終結果相同
        // patientState = {...StateDefault};
        Object.assign(patientState, StateDefault);
    }

    const updatePatient = (data: iPatientState) => {
        Object.assign(patientState, data);
    }

    return {
        patientState,
        setPatient,
        resetPatient,
        updatePatient
    }
});

export default usePatientStore;