<script setup lang="ts">
    import { isArray } from 'lodash-es';

    const route = useRoute();

    const toUrl = isArray(route.params.pathMatch)? route.params.pathMatch.join('/') : route.params.pathMatch !== '' ? route.params.pathMatch : '/'; // 取得目標路由
</script>

<template>
    <section class="not-found-block">
        <ElSvgIcon name="cance" />
        <h1 class="title"> Page Not Found <strong class="focus">404</strong> !! </h1>
        <p class="content"> The page <span class="tag">"/{{ toUrl }}"</span> cannot be found !! </p>
    </section>
</template>

<style lang="scss">
    .not-found-block {
        @include setFlex(center, center, 35px, column);
        width: 100%;
        padding: 50px 20px 30px;
        color: #333;
        .icon {
            @include setSize(100px, 100px);
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
            animation: horizontally-shake .5s $cubic-FiSo .1s;

            .focus { color: $colorError; }
        }
        .content {
            font-size: 1.5rem;
            animation: horizontally-shake .5s $cubic-FiSo .2s;

            .tag { color: $colorError; }
        }
    }
</style>
