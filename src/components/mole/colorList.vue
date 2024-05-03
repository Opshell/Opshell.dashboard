<script setup lang="ts">
    interface iColor {
        value: string;
        var: string;
        text: string;
    }

    const props = defineProps<{
        colorList: iColor[];
    }>();
</script>

<template>
    <ul class="color-list">
        <li class="color-item"
            v-for="color in colorList"
            :key="'color_' + color.value"
        >
            <div class="color" :style="{'--color-self': color.var !== '' ? `var(${color.var})` : color.value}">
                <span class="var">{{ color.var }}</span>
            </div>
            <span v-if="color.text != ''" class="text">{{ color.text }}</span>
        </li>
    </ul>
</template>

<style lang="scss">
    .color-list {
        @include setFlex(flex-start, stretch, 0, column);
        width: 100%;
        .color-item {
            --color-self: var(--color-primary);
            @include setFlex(space-between, stretch);
            gap: 20px;

            width: 100%;
            min-height: 40px;

            font-size: 1rem;
            font-weight: 500;
            line-height: 1.2;

            .color {
                @include setFlex(center, center);
                background: var(--color-self);
                width: 100%;
                transition: .2s $cubic-FiSo;
                overflow: hidden;
                .var {
                    width: 100%;
                    padding: 5px;
                    color: #fff;
                    text-align: right;
                    text-shadow: 0 0 2px rgba($color: #000000, $alpha: 1);
                    transform: translateX(110%);
                    transition: .2s $cubic-FiSo;
                }

                &:hover {
                    .var { transform: translateX(0); }
                }
            }
            .text {
                @include setFlex(flex-start);
                width: 60%;
                padding: 5px;
                color: var(--color-title);
            }
        }
    }
</style>