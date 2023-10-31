<script setup lang="ts">
    interface iProps {
        modelValue?: string | null;
    }
    const props = withDefaults(defineProps<iProps>(), {
        modelValue: '',
    });

    // type-based (TS)
    const emit = defineEmits<{
        (e: 'change', id: number): void;
        (e: 'update:modelValue', value: string): void;
    }>();

    // input值更新的時候，emit出去
    const updateModelValue = (event: Event) => {
        // 不斷言 HTMLInputElement的話 取值會有錯誤
        const target = event.target as HTMLInputElement;

        emit('update:modelValue', target.value);
    };
</script>

<template>
    <input class="input" :value="modelValue" @input="updateModelValue($event)" />
</template>

<style scoped lang="scss">
    input {
        display: flex;
        align-items: center;
        justify-content: flex-start;

        background: rgba(255, 255, 255, 0.95);
        @include setSize(100%, 55px);
        max-width: 500px;
        min-width: 140px;
        padding: 8px 20px;
        border: 1px solid $colorFont;
        border-radius: 20px;
        @extend %baseFont;
        color: #444;;
        font-size: 18px;

        backdrop-filter: blur(5px);
        -webkit-autofill: unset;
        transition: .05s $cubic-FiSo;
        &:focus {
            outline: 0;
            border-color: $colorMain;
        }
        &::placeholder {
            // color: #ccc;
            // color: transparent;
            color: #9e9e9e;
            font-size: 16px;
        }
        &:disabled {
            background: #eee;
            border-color: #ddd;
            color: #666;
            cursor: not-allowed;
        }

        &[type='text'],
        &[type='password'] {}

        &[type='number']::-webkit-inner-spin-button,
        [type='number']::-webkit-outer-spin-button {
            margin: 0;
            -moz-appearance: textfield;
            -webkit-appearance: none;
        }

        &:-webkit-autofill {
            -webkit-box-shadow: 0 0 0 30px $colorUnFont inset;
        }
    }
</style>
