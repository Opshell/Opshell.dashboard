<script setup lang="ts">

</script>

<template>
    <q-tooltip v-bind="$attrs">
        <slot></slot>
    </q-tooltip>
</template>

<style lang="scss">
    .q-tooltip {
        padding: 8px 15px;
        border: 10px;
        font-size: 14px;
    }
</style>