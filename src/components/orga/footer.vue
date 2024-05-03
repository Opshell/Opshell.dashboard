<script setup lang="ts">

</script>

<template>
    <footer class="footer-block">
        <div class="copyright-box">
            <span class="text copyright">Copyright © 2024 www.Opshell.info </span>
            <span class="text design">
                <a href="https://github.com/Opshell" target="_blank" rel="noopener noreferrer"
                    >Designed By Opshell</a
                >
            </span>
        </div>
    </footer>
</template>

<script setup lang="ts"></script>

<style lang="scss">
    .footer-block {
        flex-shrink: 0;
        @include setFlex(flex-end, center, 20px);
        background: var(--color-border-box);
        @include setSize(100%, 67px);
        @extend %scope;
        border-top: 1px solid var(--color-view-block);

        .copyright-box {
            font-size: 14px;
        }
    }
</style>
