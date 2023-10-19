<template>
    <nav class="sideMenu">
        <ElTreeItem :menu="list" :child_count="list.length" />
    </nav>
</template>

<script setup lang="ts">
    import { iMenu } from '@/components/molecule/mole-treeItem.vue';
    import { getData } from '@/hooks/useApi';

    const list: Ref<iMenu[]> = ref([]);

    getData('/api/backEnd/sidemenu').then((result) => {
        if (result && result.status) {
            list.value = result.data;
        }
    });
</script>

<style lang="scss">
    .sideMenu {
        display: flex;
        flex-direction: column;
        background: #333;
        @include setSize(100%, 100%);
        padding: 0;
        box-sizing: border-box;
        overflow-y: auto;

        .fitBar {
            animation: fit-in 0.3s $cubic-FiSo both;
            @include setDelay('animation-delay', 15, 0.045);
        }

        /* 卷軸設定 */
        &::-webkit-scrollbar {
            background: #999;
            width: 8px;
            border-radius: 2px;
        }

        &::-webkit-scrollbar-thumb {
            background: $colorMain;
            border-radius: 5px;
            border: 0.5px solid rgba(153, 153, 153, 0.5);
            box-shadow: 0 0 10px 2px #20476e;
        }
    }
</style>
