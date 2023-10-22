<script setup lang="ts">
    const route = useRoute();
</script>

<template>
    <div>
        <!-- <h2>工程頁面</h2> -->
        <router-view :key="route.path"></router-view>
    </div>

</template>

<style lang="scss">

</style>
