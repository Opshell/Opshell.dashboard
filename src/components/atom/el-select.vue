<script setup lang="ts">
    interface Option<T> {
        title: string;
        value: T;
    }

    // 設定props type
    interface iProps<T> {
        modelValue: T | null;
        options: Option<T>[];
        multiple?: boolean;
        unit?: string;
    }

    // [!] 要寫這一段後面才不會報錯 找時間在研究一下
    const withDefaults = <T>(
        props: iProps<T>,
        defaults: Partial<iProps<T>>
    ): iProps<T> => {
        return Object.assign({}, defaults, props);
    };

    const props = withDefaults(defineProps<iProps<string | number | string[] | number[]>>(), {
        modelValue: null,
        options: [{title: '請選擇', value: '1'}],
        multiple: false,
        unit: '',
    });

    // [-] Select 開關
    const open = ref(false);
    const triggerSelect = () => {
        open.value = !open.value;
    };
    // 關閉下拉選單(暴露出去做總控)
    const closeSelect = () => {
        open.value = false;
    };
    defineExpose({ closeSelect, open });

    // [-]目前選中的選項
    const option = computed(() => {
        let result = '';

        if (props.multiple) {
            const options = props.options.filter((item) => inArray(item.value, props.modelValue as string[]));

            result = options.map((item) => item.title).join('、');
        } else {
            const option = props.options.find((item) => item.value == props.modelValue);

            result = option?.title || '';
        }

        return result;
    });

    const emit = defineEmits<{
        'update:modelValue': [result: string | string[]]
    }>();

    // input值更新的時候，emit出去
    const updateModelValue = (event: Event) => {
        // 不斷言 HTMLInputElement的話 取值會有錯誤
        const target = event.target as HTMLInputElement;

        let result: string | string[] = target.value;

        // 關閉下拉選單
        if (!props.multiple) {
            open.value = false;
        } else {
            if(Array.isArray(props.modelValue)){
                let oldAry = props.modelValue as string[];

                // 判斷 array 中有沒有這個值
                if (oldAry.includes(target.value)) { // 有的話就刪除
                    oldAry = oldAry.filter((item) => item != target.value);
                } else { // 沒有的話就新增
                    oldAry.push(target.value);
                }

                result = oldAry;
            }
        }

        emit('update:modelValue', result);
    };

    const inArray = <T>(value: T, array: T[]): boolean => {
        return array.indexOf(value) !== -1;
    };
</script>

<template>
    <div class="select" :class="{open: open}" ref="selectElement" role="select">
        <div class="selected" @click="triggerSelect" :title="option">
            <span class="text">{{ option }}</span>
            <span v-if="unit != ''" class="unit">{{ unit }}</span>
            <ElSvgIcon name="arrow_drop_down" />
        </div>

        <ul class="options">
            <li v-for="(item, i) in options" :key="`${item.title}_${i}`"
                class="option"
                :class="{current:
                    (multiple && (modelValue as string[]).includes(item.value)) ||
                    (!multiple && item.value == modelValue)
                }"
                :value="item.value"
                @click="updateModelValue($event)"
            >{{ item.title }}</li>
        </ul>
    </div>
</template>

<style lang="scss">
    .select {
        display: flex;
        align-items: center;
        justify-content: flex-start;

        position: relative;

        background: rgba(255, 255, 255, 0.95);
        @include setSize(100%, 55px);
        max-width: 500px;
        min-width: 140px;
        padding: 8px 20px;
        border: 1px solid $colorFont;
        border-radius: 20px;
        font-size: 18px;
        backdrop-filter: blur(5px);
        -webkit-autofill: unset;
        transition: .05s $cubic-FiSo;
        &:focus {
            outline: 0;
            border-color: $colorMain;
        }
        &:disabled {
            background: #eee;
            border-color: #ddd;
            color: #666;
            cursor: not-allowed;
        }
        &.open {
            border-color: $colorMain;
            z-index: 10;
            box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.25);
            .icon {
                transform:  rotateX(180deg) translate3d(5px, -1px, 0);
            }
            .options {
                max-height: 180px;
                opacity: 1;
                box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.25);
                transform: translateY(10px);
                z-index: 1;
            }
        }

        .selected {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
            @include setSize(100%, 100%);
            cursor: pointer;
        }

        .unit {
            color: $colorMain;
            user-select: none;
            transform: translateX(15px);
        }

        .icon {
            fill: $colorMain;
            @include setSize(30px, 30px);
            transform: translate3d(5px, -3px, 0);
        }

        .options {
            position: absolute;
            top: 100%;
            left: 0;

            background: #f4f4f4;
            width: 100%;
            max-height: 0;
            border:1px solid #f4f4f4;
            border-radius: 20px;

            list-style: none;
            opacity: 0;
            transition: .1s $cubic-FiSo;
            z-index: 10;
            transform: translateY(0);
            overflow: auto;
            // 卷軸體
            &::-webkit-scrollbar {
                background: #fff;
                width: 3px;
                border-radius: 1.5px;
            }
            // 卷軸底
            &::-webkit-scrollbar-thumb {
                background: $colorMain;
                border-radius: 1.5px;
                border: 0.5px solid rgba(153, 153, 153, 0.25);
            }

            .option {
                padding: 8px 20px;
                font-size: 18px;
                user-select: none;
                cursor: pointer;
                transition: .1s $cubic-FiSo;
                &:hover {
                    filter: saturate(0.5);
                }
                &:hover,
                &.current {
                    background: $colorMain;
                    color: #fff;
                }
            }
        }
    }
</style>
