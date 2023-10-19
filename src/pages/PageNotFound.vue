<script setup lang="ts">
    const route = useRoute();

    const toUrl = route.params.pathMatch || '/'; // 取得目標路由
</script>

<template>
    <div class="contentBox">
        <ElSvgIcon name="cross-circle" />
        <h1 class="title">
            Page Not Found <strong class="focus">404</strong> !!
        </h1>
        <p class="content">
            The page <span class="tag">{{ toUrl }}</span> cannot be found !!
        </p>
    </div>
</template>

<style lang="scss" scoped>
    .contentBox {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 35px;
        padding: 50px 20px 30px;
        color: #333;

        .icon {
            fill: $colorError;
            filter: drop-shadow(1px 1px 3px rgba($color: #000, $alpha: .2));
            animation: horizontally-shake .35s $cubic-FiSo;
        }

        .title,
        .content {
            text-shadow: 1px 1px 3px rgba($color: #000, $alpha: .2);

        }
        .title {
            font-size: 3.5rem;
            font-weight: bold;
            .focus {
                color: $colorError;
            }
            animation: horizontally-shake .5s $cubic-FiSo .1s;
        }
        .content {
            font-size: 1.5rem;
            .tag {
                color: $colorError;
            }
            animation: horizontally-shake .5s $cubic-FiSo .2s;
        }
    }
</style>
