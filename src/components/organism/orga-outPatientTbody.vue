<script setup lang="ts">
    import { iOutPatientItem } from '@/components/molecule/mole-outPatientListBar.vue';

    const props = defineProps({
        outPatientList: {
            type: Array as () => iOutPatientItem[],
            default: []
        },
    });
</script>

<template>
    <MoleOutPatientListBar v-for="(item) in outPatientList" :outpatient="item" :header="false" :key="'outPatientBar_'+item.id"></MoleOutPatientListBar>
</template>

<style lang="scss">
    .outPatientListBar {
        animation: fall-in .25s $cubic-FiSo both;
        @include setDelay('animation-delay', 6, 0.045);
    }
</style>