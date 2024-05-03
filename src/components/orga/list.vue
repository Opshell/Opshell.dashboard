<script setup lang="ts">
    import { iListBar } from '@/components/mole/listBar.vue';

    defineProps({
        list: {
            type: Array as () => iListBar[],
            default: []
        },
    });

    // const emit = defineEmits<{
    //     'edit-patient': [id: number],
    // }>();
    // const editPatient = (id: number) => {
    //     emit('edit-patient', id);
    // }
</script>

<template>
    <div class="list-tbody">
        <MoleListBar v-for="item in list"
            :item :key="'list_item_'+item.id"
        ></MoleListBar>
    </div>
</template>

<style lang="scss">
    .list-tbody {
        @include setFlex(flex-start, stretch, 2px, column);
        .mole-list-bar {
            animation: fall-in .25s $cubic-FiSo both;
            @include setDelay('animation-delay', 4, 0.045);
        }
    }
</style>
