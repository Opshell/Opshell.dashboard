<script setup lang="ts">


    withDefaults(defineProps<{
        label: string,
        val: string | number,
    }>(), {
        label: '',
        val: ''
    });


    const data = defineModel<string | number>({ default: ''});
</script>

<template>
    <q-radio class="el-radio"
        v-model="data"

        :label
        :val
    >
        <slot></slot>
    </q-radio>
</template>

<style lang="scss">
    .el-radio {
        .q-radio__inner--truthy {
            color: var(--color-primary);
        }
    }
</style>