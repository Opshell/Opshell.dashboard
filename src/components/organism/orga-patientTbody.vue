<script setup lang="ts">
    import { iPatientItem } from '@/components/molecule/mole-patientListBar.vue';

    const props = defineProps({
        // header: {
        //     type: Object as () => iPatientItem,
        //     default: {}
        // },
        patientList: {
            type: Array as () => iPatientItem[],
            default: []
        },
    });
</script>

<template>
    <MolePatientListBar v-for="(item) in patientList" :patient="item" :key="'patientBar_'+item.id"></MolePatientListBar>
</template>

<style lang="scss">
    .patientListBar {
        animation: fall-in .25s $cubic-FiSo both;
        @include setDelay('animation-delay', 4, 0.045);
    }
</style>
