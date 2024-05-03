type tNumStrUnion = number | string;

// [-] 字串相關
export const str = {
    // 補字 - 輸出成字串
    strPad: function (input: string | number, length: number, padStr = '0', type = 'left') {
        const oriText = input.toString();
        const inpLen = oriText.length;
        let addText = '';

        if (inpLen < length) {
            for (let i = inpLen; i < length; i++) {
                addText += padStr;
            }
        }

        const result = type == 'left' ? addText + oriText : oriText + addText;
        return result;
    },
};

/** 物件相關 */
interface iAnyObj {
    [key: string]: any;
}
export const obj = {
    /** 解深拷貝 */
    deepCopy: function (obj: iAnyObj) {
        return JSON.parse(JSON.stringify(obj));
    },
    /** 判斷是否是物件 */
    isObj: function (obj: iAnyObj) {
        return obj != null && typeof obj === 'object';
    },
    /** 判斷物件是否為空 */
    isObjEmpty: function (obj: iAnyObj) {
        return Object.keys(obj).length === 0;
    },
    /** 判斷兩個物件Key、value是否相等 */
    isObjEqual: function (obj1: iAnyObj, obj2: iAnyObj) {
        const keys1 = Object.keys(obj1);
        const keys2 = Object.keys(obj2);

        if (keys1.length !== keys2.length) {
            return false;
        }

        for (let index = 0; index < keys1.length; index++) {
            const val1 = obj1[keys1[index]];
            const val2 = obj2[keys2[index]];
            const areObjects = obj.isObj(val1) && obj.isObj(val2);
            if ((areObjects && !obj.isObjEqual(val1, val2)) || (!areObjects && val1 !== val2)) {
                return false;
            }
        }

        return true;
    },
    // [-] Object.prototype.hasOwnProperty.call
    objHOP: function (obj: iAnyObj, key: string) {
        return Object.prototype.hasOwnProperty.call(obj, key);
    },
    // 從物件陣列中取得key 值 等於value 的物件
    getObjInArray: function (array: iAnyObj[], key: string, value: tNumStrUnion) {
        return array.find((item: iAnyObj) => {
            return item[key] === value;
        });
    },

    // 轉換成 select option 陣列
    formatOptions: function (array: iAnyObj[], key: string, value: string) {
        return array.map((item: iAnyObj) => {
            return {
                title: item[key],
                value: item[value],
            };
        });
    },
};

/** 浮點數相關 */
export const flt = {
    /** 浮點數相加 */
    floatAddUp: function (float1: tNumStrUnion, float2: tNumStrUnion) {
        if (typeof float1 === 'string') {
            float1 = parseFloat(float1);
        }
        if (typeof float2 === 'string') {
            float2 = parseFloat(float2);
        }

        return float1 + float2;
    },
};

export const file = {
    /** 取得圖片路徑
     * @param filename 圖片名稱
     */
    getAssetsImageUrl: (filename: string) => {
        return new URL(`../assets/images/${filename}`, import.meta.url).href;
    },

    // 格式化文件大小顯示文字
    formatSize: (size: number) => {
        return size > 1024
            ? size / 1024 > 1024
                ? size / (1024 * 1024) > 1024
                    ? (size / (1024 * 1024 * 1024)  > 1024)
                        ? (size / (1024 * 1024 * 1024 * 1024)).toFixed(2) + "TB"
                        : (size / (1024 * 1024 * 1024)).toFixed(2) + "GB"
                    : (size / (1024 * 1024)).toFixed(2) + "MB"
                : (size / 1024).toFixed(2) + "KB"
            : size.toFixed(2) + "B";
    },
};

// 驗證器
export class useValidactor {
    private errors: string[] = [];
    private firstEmptyInput: string | null = null; // 用來記錄首個空值欄位的變數

    // 檢查是否為空字串
    checkEmpty(value: string, fieldName: string, inputName: string) {
        if (value.trim() === '') {
            this.errors.push(`<span class="error-item">● "${fieldName}"不能為空</span>`);
            this.firstEmptyInput = this.firstEmptyInput || inputName;
        }
    }

    // 檢查是否為零
    checkZero(value: number, fieldName: string, inputName: string) {
        if (value === 0) {
            this.errors.push(`<span class="error-item">● "${fieldName}"不能為零</span>`);
            this.firstEmptyInput = this.firstEmptyInput || inputName;
        }
    }

    // 檢查是否為 undefined
    checkUndefined(value: any, fieldName: string, inputName: string) {
        if (typeof value === 'undefined') {
            this.errors.push(`<span class="error-item">● "${fieldName}"不能為"undefined"</span>`);
            this.firstEmptyInput = this.firstEmptyInput || inputName;
        }
    }

    /** 檢查密碼格式
     * @param password 密碼字串
     * @param length 密碼長度
     * @param level 密碼強度等級 1 最高, 5 最低
     */
    checkPassword(password: string, filedName: string, length: number = 8, level: number = 5, ) {
        if (level < 2) { // 最高強度檢查特殊符號
            if (!/[@#$%^&()_+=,.]/.test(password)) {
                this.errors.push(`<span class="error-item">● "${filedName}"必須包含至少一個下列特殊符號 @#$%^&()_+=,. </span>`);
            }
        }

        if (level < 3) { // 至少一個大寫字母
            if (!/[A-Z]/.test(password)) {
                this.errors.push(`<span class="error-item">● "${filedName}"必須包含至少一個大寫英文字母</span>`);
            }
        }
        if (level < 4) { // 英數混合
            if (!/\d/.test(password) || (!/[a-z]/.test(password) || !/[A-Z]/.test(password))) {
                this.errors.push(`<span class="error-item">● "${filedName}"必須包含英文及數字</span>`);
            }
        }
        if (level < 5) { // 長度檢測
            if (password.length < length) {
                this.errors.push(`<span class="error-item">● "${filedName}"必須至少包含"${length}"個字元</span>`);
            }
        }

        if (password == '') {
            this.errors.push(`<span class="error-item">● "${filedName}"不得為空</span>`);
        }
    }

    // 取得所有錯誤訊息
    getErrors() {
        return this.errors;
    }

    // 錯誤訊息轉換為換行分隔的字串
    getErrorsAsString() {
        return this.errors.join("\n\r");
    }

    // 取得首個空值欄位
    getFirstEmptyInput() {
        return this.firstEmptyInput;
    }

    // 取得錯誤訊息包
    getErrorPackage() {
        return {
            errors: this.getErrorsAsString(),
            firstEmptyInput: this.firstEmptyInput,
        };
    }

    // 清除錯誤訊息
    clearErrors() {
        this.errors = [];
        this.firstEmptyInput = null; // 清除首個空值欄位
    }
}

import { getCurrentInstance, ComponentInternalInstance } from 'vue';
export const useGlobalProperties = () => (getCurrentInstance() as ComponentInternalInstance).appContext.config.globalProperties;


export default {
    setup() {
        return {
            str,
            obj,
            flt,
            useValidactor,
            useGlobalProperties
        };
    },
};