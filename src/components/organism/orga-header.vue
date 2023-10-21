<script setup lang="ts">
    import { storeToRefs } from 'pinia';
    import piniaStore from '@/store';
    import useGlobalProperties from '@/hooks/useGlobalProperties';

    const proxy = useGlobalProperties();

    const userStore = piniaStore.useUserStore;
    const { userState } = storeToRefs(userStore);

    const route = useRoute();
    const router = useRouter();

    const loguot = () => {
        proxy.$notify('warning', '提醒！', '您確定要登出洗腎護照嗎?', 0, true).then(() => {
            userStore.signOut();

            router.push('/login');
        }).catch(() => {
            console.log('取消登出');
        })
    };

    // 深度監看 router
    // watch(route, (newVal) => {
    //     console.log('Route：', newVal);
    // }, { deep: true });
</script>

<template>
    <header class="headerBlock">
        <div class="breadcrumbBox">
            {{ route.meta.title }}
        </div>

        <div class="searchBlock">
            <ElInput placeholder="請輸入關鍵字" suffix-icon="el-icon-search"></ElInput>
        </div>

        <div class="btnBox">
            <ElSvgIcon></ElSvgIcon>
            <ElSvgIcon></ElSvgIcon>
        </div>
    </header>
</template>

<style lang="scss">
    .headerBlock {
        @extend %scope;
        .btnBox {
            .icon {
                @include setSize(32px, 32px);
            }
        }
    }
</style>