<script setup lang="ts">

</script>

<template>
    <div class="loadingOverlay">
        <div class="spinner"></div>
    </div>
</template>

<style lang="scss">
    .loadingOverlay {
        @include setFlex();
        position: absolute;
        inset: 0;
        background: rgba(255, 255, 255, 0.8);
        @include setSize(100%, 100%);
        backdrop-filter: blur(8px);
        .spinner {
            @include setSize(40px, 40px);
            border-radius: 50%;
            border: 4px solid #f3f3f3;
            border-top: 4px solid $colorMain;
            animation: spin 1s linear infinite;
        }
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
</style>