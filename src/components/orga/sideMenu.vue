<script setup lang="ts">
    import { iMenu } from '@/components/mole/treeItem.vue';
    import { sendRequest } from '@/hooks/useApi';

    const list: Ref<iMenu[]> = ref([]);

    sendRequest('/mapi/user/getMenu').then((result) => {
        if (result && result.status) {
            list.value = result.data;
        }
    });
</script>

<template>
    <nav class="side-menu-block">
        <MoleTreeItem :menu="list" :child_count="list.length" />
    </nav>
</template>

<style lang="scss">
    .side-menu-block {
        display: flex;
        flex-direction: column;
        @include setSize(100%, 100%);
        padding-left: 20px;
        overflow-y: auto;
        .fitBar {
            animation: fit-in 0.3s $cubic-FiSo both;
            @include setDelay('animation-delay', 15, 0.045);
        }

        /* 卷軸設定 */
        &::-webkit-scrollbar {
            background: var(--color-view-block);
            width: 5px;
            border-radius: 2.5px;
        }
        &::-webkit-scrollbar-thumb {
            background: var(--color-primary-light);
            border-radius: 2.5px;
            // border: .031rem solid rgba(153, 153, 153, 0.5);
            // box-shadow: 0 0 .625rem .125rem #20476e;
        }
    }
</style>
