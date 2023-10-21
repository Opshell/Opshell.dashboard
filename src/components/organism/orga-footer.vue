<template>
    <footer class="footerBlock">
        <span class="text copyright">Copyright © 2022 www.Opshell.info </span>
        <span class="text design">
            <a href="https://github.com/Opshell" target="_blank" rel="noopener noreferrer"
                >Designed By Opshell</a
            >
        </span>
    </footer>
</template>

<script setup lang="ts"></script>

<style lang="scss">
    .footerBlock {
        flex-shrink: 0;
        @include setFlex(flex-end, center, 20px);
        background: $colorBack;
        @include setSize(100%, 50px);
        @extend %scope;
        font-size: 10px;
    }
</style>
