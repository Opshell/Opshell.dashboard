<script setup lang="ts">
    import { RouteLocationRaw } from 'vue-router';

    interface iProps {
        title?: string;
        icon?: string;
        href?: RouteLocationRaw;
    }

    const props = withDefaults(defineProps<iProps>(), {
        title: '',
        icon: '',
        href: '',
    });
</script>

<template>
    <router-link v-if="href != ''" :to="href" class="Btn" role="button">
        <slot v-if="$slots.icon" name="icon"></slot>
        <span v-if="$slots.default" class="text">
            <slot></slot>
        </span>
    </router-link>

    <div v-else class="Btn" role="button">
        <slot v-if="$slots.icon" name="icon"></slot>
        <span v-if="$slots.default" class="text">
            <slot></slot>
        </span>
    </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
    .Btn {
        position: relative;
        @include setFlex();

        background: $colorSubs;
        @include setSize(100%, 45px);
        padding: 8px 15px;
        border: 2px solid $colorSubs;
        border-radius: 8px;

        color: #ccc;
        cursor: pointer;
        transition: 0.2s $cubic-FiSo;
        overflow: hidden;

        .text {
            font-size: 16px;
            user-select: none;
        }
        &.current { // 當前頁面
            flex: 6;
            background: $colorMain;
            border-color: $colorMain;
            color: $colorSubs;
        }
        &.back { // 返回
            flex: 4;
            background-color: $colorFont;
            border-color: $colorFont;
            color: #fff;
        }

        &:hover {
            background: $colorMain;
            // filter: saturate(0.5);
            border-color: $colorMain;
            box-shadow: 0 0 3px 1px rgba($color: #000, $alpha: .25);
            color: $colorSubs;
            transform: scale3d(1.03, 1.03, 1);
            transition: .1s $cubic-FiSo;
        }
        &:active {
            box-shadow: 0 0 1px 1px rgba($color: #000000, $alpha: .15) inset;
            transition-duration: 0.03s;
            .text {
                transform: translate3d(1px, 1px, 0);
            }
        }
    }
</style>
