<script setup lang="ts">
    const props = defineProps({
        fieldName: { type: String, required: true, default: '' },
        remark: { type: String, default: '' },
    });
</script>

<template>
    <label class="inputBox">
        <span class="text">{{ fieldName }}</span>
        <slot></slot>
        <span v-if="remark != ''" class="remark">{{ remark }}</span>
    </label>
</template>

<style lang="scss">
    .inputBox {
        position: relative;
        @include setFlex(space-between, center, 5px);
        background: #f8f8f8;
        min-height: 55px;
        padding: 0 0 0 12px;
        border-radius: 20px;
        &.radio {
            justify-content: flex-start;
        }
        .text {
            color: $colorMain;
            white-space: nowrap;
            user-select: none;
        }
    }
</style>