<script setup lang="ts">
    interface iOption {
        title: string;
        value: string | number;
    }

    // 設定props type
    interface iProps {
        modelValue: string | number | null;
        options: Array<iOption>;
        unit?: string;
    }
    const props = withDefaults(defineProps<iProps>(), {
        modelValue: '',
        options: [{title: '請選擇', value: '1'}],
        unit: '',
    });

    const open = ref(false);

    // 開關下拉選單
    const triggerSelect = () => {
        open.value = !open.value;
    };

    // 關閉下拉選單(暴露出去做總控)
    const closeSelect = () => {
        open.value = false;
    };

    // 目前選中的選項
    const option = computed(() => {
        const option = props.options.find((item) => item.value == props.modelValue);
        return option?.title || '';
    });

    // [-] 下面是輸出區塊-------------------------------------------------------------------------------------------

    // type-based (TS)
    const emit = defineEmits<{
        (e: 'change', id: number): void;
        (e: 'update:modelValue', value: string): void;
    }>();
    // input值更新的時候，emit出去
    const updateModelValue = (event: Event) => {
        // 不斷言 HTMLInputElement的話 取值會有錯誤
        const target = event.target as HTMLInputElement;

        // 關閉下拉選單
        open.value = false;

        emit('update:modelValue', target.value);
    };

    defineExpose({ closeSelect, open });

    // 全域點擊事件 (掛載太多時會吃資源  改成VueUse onClickOutside 解決方案)
    // const selectElement = ref<HTMLElement | null>(null);
    // // 點擊畫面的全域事件監聽
    // const handleClickOutside = (event: MouseEvent) => {
    //     if (selectElement.value && !selectElement.value.contains(event.target as Node)) {
    //         open.value = false; // 關閉選擇框
    //     }
    // };
    // // 在onMounted後掛在監聽
    // onMounted(() => {
    //     window.addEventListener('click', handleClickOutside);
    // });
    // // 在组件銷毀时移除監聽，防止記憶體洩漏
    // onUnmounted(() => {
    //     window.removeEventListener('click', handleClickOutside);
    // });
</script>

<template>
    <!-- 手刻一個ul 做的 select  -->
    <div class="select" :class="{open: open}" ref="selectElement">
        <div class="selected" @click="triggerSelect">
            <span class="text">{{ option }}</span>
            <span v-if="unit != ''" class="unit">{{ unit }}</span>
            <ElSvgIcon name="caret-down" />
        </div>

        <ul class="options">
            <li v-for="(item, i) in options" :key="`${item.title}_${i}`"
                class="option" :class="{current: item.value == modelValue}"
                :value="item.value"
                @click="updateModelValue($event)"
            >{{ item.title }}</li>
        </ul>
    </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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

            .icon {
                transform:  rotateX(180deg) translate3d(5px, -1px, 0);
            }
            .options {
                max-height: 120px;
                opacity: 1;
                transform: translateY(10px);
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
