<script setup lang="ts">
    withDefaults(defineProps<{
        value: string | string[] | Date | null;
    }>(), {
        value: new Date(),
    });

    const data = defineModel< string | string[] | Date | null >();
</script>

<template>
    <q-date
        v-model="data"
        :today-btn="true"
        :years-in-month-view="true"
        :emit-immediately="true"
    >

    </q-date>
</template>

<style lang="scss">

</style>