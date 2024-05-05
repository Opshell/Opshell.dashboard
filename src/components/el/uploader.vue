<script setup lang="ts">
    defineProps<{
        url?: string,
        label?: string,
        multiple?: boolean,
    }>();
</script>

<template>
    <q-uploader
        class="el-uploader"
        url="/mapi/image/upload"
        label="Individual upload"
        multiple

        v-bind="$attrs"
    ></q-uploader>
</template>

<style lang="scss">
    .el-uploader {
        width: 100%;

        .q-uploader {
            &__header {
                &-content {
                    background: var(--color-primary);
                }
            }
        }
    }
</style>