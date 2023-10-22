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

        <ElInputBox fieldName="搜尋" class="searchBlock">
            <ElInput placeholder="請輸入關鍵字" suffix-icon="el-icon-search"></ElInput>
        </ElInputBox>

        <div class="btnBox">
            <ElSvgIcon name="search"></ElSvgIcon>
            <ElSvgIcon name="world"></ElSvgIcon>
            <ElSvgIcon name="bell"></ElSvgIcon>
        </div>
    </header>
</template>

<style lang="scss">
    .headerBlock {
        background: $colorBack;
        @include setFlex(space-between, center, 10px);
        padding: 40px;
        @extend %scope;
        border-radius: 20px 20px 0 0;
        .breadcrumbBox {
            flex: 1;
            color: $colorSubs;
            font-size: 22px;
            font-weight: bold;
            line-height: 22px;
        }

        .searchBlock {
            width: 250px;
            background: $colorBlock;
            border-radius: 5px;
        }

        .btnBox {
            @include setFlex(center, center, 10px);
            .icon {
                background: $colorBlock;
                @include setSize(40px, 40px);
                padding: 8px;
                border-radius: 5px;
                fill: $colorFont;
                cursor: pointer;
                &:hover {
                    fill: $colorMain;
                }
            }
        }
    }
</style>