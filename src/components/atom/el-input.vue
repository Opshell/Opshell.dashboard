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

<style lang="scss" scoped>
    input {
        @include setFlex(flex-start);
        background: transparent;
        width: 100%;
        border: none;
        outline: none;
        @extend %baseFont;
        color: #444;
        -webkit-autofill: unset;
        transition: .15s $cubic-FiSo;

        &::placeholder {
            color: #9e9e9e;
            font-size: 12px;
        }
        &:disabled {
            background: #eee;
            border-color: #ddd;
            color: #666;
            cursor: not-allowed;
        }

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
