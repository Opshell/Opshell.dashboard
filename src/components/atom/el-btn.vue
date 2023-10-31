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
        display: flex;
        align-items: center;
        justify-content: center;
        background: #fff;

        @include setSize(auto, 55px);
        padding: 15px 25px;
        border: 1px solid $colorMain;
        border-radius: 20px;

        color: $colorMain;
        cursor: pointer;
        transition: 0.2s $cubic-FiSo;
        overflow: hidden;

        .text {
            font-size: 20px;
            user-select: none;
        }
        &.current { // 當前頁面
            background: $colorMain;
            color: #fff;
        }
        &.subs { // 次要
            background: $colorSubs;
            border-color: $colorSubs;
            color: #fff;
            &:hover {
                background: $colorError;
            }
        }
        &.back { // 返回
            background-color: $colorFont;
            border-color: $colorFont;
            color: #fff;
        }
        &.addBtn {
            gap: 8px;
            background: $colorSubs;
            border-color: $colorSubs;
            padding: 15px;
            color: $colorUnFont;
            .icon {
                fill: $colorUnFont;
                @include setSize(25px, 25px);
            }
            &.Btn .text { transform: translateY(-1px); }
        }

        &:hover {
            background: $colorMain;
            color: #fff;
            // filter: saturate(0.5);
            box-shadow: 0 0 3px 1px rgba($color: #000, $alpha: .25);
            transform: scale3d(1.06, 1.06, 1);
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
