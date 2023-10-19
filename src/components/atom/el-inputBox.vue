<script setup lang="ts">
    const props = defineProps({
        fieldName: { type: String, required: true, default: '' },
        remark: { type: String, default: '' },
    });
</script>

<template>
    <label class="inputBox">
        <slot></slot>
        <span class="text">{{ fieldName }}</span>
        <span v-if="remark != ''" class="remark">{{ remark }}</span>
    </label>
</template>

<style lang="scss">
    .inputBox {
        @include setFlex(flex-start, flex-start, 0, column-reverse);

        background: #f8f8f8;
        width: 100%;

        padding: 8px 15px;
        border: 2px solid $colorFont;
        border-radius: 8px;
        transition: .2s $cubic-FiSo;
        &:focus-within {
            border-color: $colorMain;
        }
        &.disabled {
            background: #eee;
            border-color: #ddd;
            color: #666;
            cursor: not-allowed;
        }

        .input {
            height: 0;
            &:not(:placeholder-shown),
            &:focus {
                height: 20px;
                ~ .text {
                    color: $colorMain;
                    transform: translateY(-3px);
                }
            }
        }

        .text {
            color: $colorSubs;
            font-size: 16px;
            white-space: nowrap;
            user-select: none;
            transition: 0.2s $cubic-FiSo;
        }
    }
</style>