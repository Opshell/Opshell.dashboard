<script setup lang="ts"></script>

<template>
    <nav class="modalHeader">
        <div v-if="$slots.close" class="featureBlock">
            <slot name="close"></slot>
        </div>

        <h3 class="title">
            <slot name="icon"></slot>
            <slot></slot>

            <div class="cover"></div>
        </h3>

        <div v-if="$slots.tabs" class="menu">
            <slot name="tabs"></slot>
        </div>
    </nav>
</template>

<style lang="scss">
    .modalHeader {
        flex-shrink: 0;
        @include setFlex(flex-start, center, 6px);
        @include setSize(100%, 55px);
        padding-right: 50px;
        transition: .25s cubic-bezier(0.645, 0.045, 0.355, 1);
        z-index: 10;

        .icon.close {
            background: #fff;
            @include setSize(45px, 45px);
            padding: 9px;
            border-radius: 50%;
            fill: var(--color-text);
            cursor: pointer;
            transform: translateY(-2px);
            &:hover { transform: translateY(-2px) scale3d(1.1, 1.1, 1); }
        }

        .title {
            position: relative;
            @include setFlex(flex-start, center, 8px);
            background: #fff;
            height: 100%;
            padding: 10px 45px 10px 25px;
            border-radius: 50px 100px 0 0;

            font-size: 20px;
            font-weight: normal;
            color: var(--color-primary);

            &::before,
            &::after {
                content: '';
                position: absolute;
                background: transparent;
                z-index: -1;
            }
            &::before{
                left: -25px;
                bottom: 0;
                @include setSize(25px, 25px);
                border-radius: 0 0 35px 0;
                box-shadow: 5px 5px 0 5px #fff;
            }
            &::after {
                right: -41px;
                bottom: -11px;
                @include setSize(40px, 64px);
                border-radius: 0 0 0 55px;
                box-shadow: -11px 11px 0 10px #fff;
                transform: rotateZ(-36deg);
            }

            .cover {
                position: absolute;
                bottom: 0;
                right: -65px;
                background: #7f7f7f;
                width: 30px;
                height: 10px;
            }

            .icon {
                @include setSize(30px, 30px);
                fill: var(--color-primary);
            }
        }

        .menu {
            flex: 1;
            align-self: flex-start;
            @include setFlex(flex-end, center);
            gap: 15px;
            transform: translateY(-1px);
            .Btn { height: 48px; }
        }
    }
</style>
