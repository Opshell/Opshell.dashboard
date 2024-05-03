<template>
    <router-view v-slot="{ Component }">
        <transition name="zoom" mode="out-in">
            <component :is="Component"></component>
        </transition>
    </router-view>
</template>

<style lang="scss">
    #app {
        display: flex;
        background: var(--color-view-block);
        height: 100vh; // 讓firefox也能正常顯示
        @include setSize(100%, 100dvh);

        // 設定卷軸樣式
        @include setScroll(5px);

        overflow: auto;
    }
</style>
